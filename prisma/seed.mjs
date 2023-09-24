import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
const prisma = new PrismaClient();

(async () => {
  try {
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
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
