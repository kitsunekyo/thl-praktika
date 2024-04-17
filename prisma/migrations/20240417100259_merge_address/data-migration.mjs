import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const trainings = await tx.training.findMany();
    for (const training of trainings) {
      await tx.training.update({
        where: { id: training.id },
        data: {
          address: [
            training.address,
            [training.zipCode, training.city].filter(Boolean).join(" "),
          ]
            .filter(Boolean)
            .join(", "),
        },
      });
    }

    const users = await tx.user.findMany();
    for (const user of users) {
      await tx.user.update({
        where: { id: user.id },
        data: {
          address: [
            user.address,
            [user.zipCode, user.city].filter(Boolean).join(" "),
          ]
            .filter(Boolean)
            .join(", "),
        },
      });
    }
  }, {
    maxWait: 10000, // default: 2000
    timeout: 20000, // default: 5000
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
