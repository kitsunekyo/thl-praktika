import { PrismaAdapter } from "@next-auth/prisma-adapter";
import * as Sentry from "@sentry/nextjs";
import { compare } from "bcrypt";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import {
  AuthOptions,
  User,
  getServerSession as nextAuth_getServerSession,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

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
        },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
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
          role: user.role,
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
      const existingUser = await prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });
      if (existingUser) {
        Sentry.setUser({ email: user.email, id: user.id });
        return true;
      }

      const invitation = await prisma.invitation.findFirst({
        where: {
          email: user.email,
        },
      });
      if (!invitation) {
        return false;
      }

      await prisma.invitation.delete({
        where: {
          id: invitation.id,
        },
      });

      return true;
    },
    jwt: async ({ token, user }) => {
      if (!user) {
        return token;
      }

      token.id = user.id;
      token.role = user.role;
      token.name = user.name;

      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.id;
      session.user.role = token.role || "user";
      session.user.name = token.name || "";

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth-error",
    signOut: "/logout",
  },
};

export function getServerSession(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return nextAuth_getServerSession(...args, authOptions);
}
