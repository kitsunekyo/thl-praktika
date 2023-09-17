import { DefaultSession } from "next-auth";

type Role = "user" | "trainer" | "admin";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    role?: Role;
  }
}
