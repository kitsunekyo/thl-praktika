import { PrismaClient, User } from "@prisma/client";

// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export type SafeUser = Pick<User, keyof typeof selectUserSafe>;

export const selectUserSafe = {
  id: true,
  role: true,
  name: true,
  email: true,
  image: true,
  phone: true,
  address: true,
  preferences: true,
  lastLogin: true,
};
