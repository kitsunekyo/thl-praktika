import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

type Role = "user" | "trainer" | "admin";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    role: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    email: string;
  }
}
