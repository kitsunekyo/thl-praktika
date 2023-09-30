import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
const prisma = new PrismaClient();

const DEMO_PASSWORD = "thldemo07";

(async () => {
  try {
    await prisma.user.deleteMany();
    await prisma.training.deleteMany();
    console.log("Deleted all users and trainings");

    const adminpassword = process.env.ADMIN_PW;
    if (!adminpassword) {
      throw new Error("No ADMIN_PW password set in .env");
    }
    const hashed = await hash(adminpassword, 12);
    await prisma.user.create({
      data: {
        email: "admin@mostviertel.tech",
        name: "Admin",
        role: "admin",
        password: hashed,
      },
    });
    console.log("Created admin user");

    await prisma.user.createMany({
      data: [
        {
          id: "demo-user1",
          email: "user1@mostviertel.tech",
          name: "User1",
          role: "user",
          city: "Wien",
          zipCode: "1010",
          password: await hash(DEMO_PASSWORD, 12),
        },
        {
          id: "demo-user2",
          email: "user2@mostviertel.tech",
          name: "User2",
          role: "user",
          city: "Purgstall",
          zipCode: "3251",
          password: await hash(DEMO_PASSWORD, 12),
        },
        {
          id: "demo-user3",
          email: "user3@mostviertel.tech",
          name: "User3",
          role: "user",
          city: "Loosdorf",
          zipCode: "3382",
          password: await hash(DEMO_PASSWORD, 12),
        },
        {
          id: "demo-trainer1",
          email: "trainer1@mostviertel.tech",
          name: "Trainer1",
          role: "trainer",
          city: "Wien",
          zipCode: "1070",
          password: await hash(DEMO_PASSWORD, 12),
        },
        {
          id: "demo-trainer2",
          email: "trainer2@mostviertel.tech",
          name: "Trainer2",
          role: "trainer",
          city: "Oberndorf",
          zipCode: "3281",
          password: await hash(DEMO_PASSWORD, 12),
        },
        {
          id: "demo-trainer3",
          email: "trainer3@mostviertel.tech",
          name: "Trainer3",
          role: "trainer",
          city: "Ansfelden",
          zipCode: "4052",
          password: await hash(DEMO_PASSWORD, 12),
        },
      ],
    });
    console.log("Created demo users");

    await prisma.training.createMany({
      data: [
        {
          authorId: "demo-trainer1",
          description: "Training 1",
          start: new Date("2023-11-01T15:00:00.000Z"),
          end: new Date("2023-11-01T17:00:00.000Z"),
          maxInterns: 1,
        },
        {
          authorId: "demo-trainer1",
          description: "Training 2",
          start: new Date("2023-11-02T14:00:00.000Z"),
          end: new Date("2023-11-02T15:00:00.000Z"),
          maxInterns: 1,
        },
        {
          authorId: "demo-trainer1",
          description: "Training 3",
          start: new Date("2023-11-01T10:00:00.000Z"),
          end: new Date("2023-11-01T12:00:00.000Z"),
          maxInterns: 2,
        },
        {
          authorId: "demo-trainer2",
          description: "Training 1",
          start: new Date("2023-11-04T10:00:00.000Z"),
          end: new Date("2023-11-04T12:00:00.000Z"),
          maxInterns: 2,
        },
        {
          authorId: "demo-trainer2",
          description: "Training 2",
          start: new Date("2023-11-04T15:00:00.000Z"),
          end: new Date("2023-11-04T18:00:00.000Z"),
          maxInterns: 2,
        },
        {
          authorId: "demo-trainer3",
          description: "Training 1",
          start: new Date("2023-11-10T17:00:00.000Z"),
          end: new Date("2023-11-10T18:00:00.000Z"),
          maxInterns: 2,
        },
        {
          authorId: "demo-trainer3",
          description: "Training 2",
          start: new Date("2023-11-10T12:00:00.000Z"),
          end: new Date("2023-11-10T13:30:00.000Z"),
          maxInterns: 5,
        },
      ],
    });
    console.log("Created demo trainings");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
