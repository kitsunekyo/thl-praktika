import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import {
  AuthOptions,
  getServerSession as NEXT_getServerSession,
  User,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { prisma } from "./prisma";
import { Role } from "../../next-auth";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "alex@example.com",
        },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          role: user.role as Role,
          email: user.email,
          image: user.image,
        } satisfies User;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const userExists = await prisma.user.findFirst({
        where: {
          id: user.id,
        },
      });
      if (userExists) {
        return true;
      }
      const invitation = await prisma.invitation.findFirst({
        where: {
          email: user.email,
        },
      });
      if (invitation) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            role: invitation.role,
          },
        });
        await prisma.invitation.delete({
          where: {
            id: invitation.id,
          },
        });
        return true;
      }
      return false;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role || "user";
        session.user.name = token.name || "";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
};

export async function getServerSession() {
  return NEXT_getServerSession(authOptions);
}
