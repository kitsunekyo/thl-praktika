import { PrismaAdapter } from "@next-auth/prisma-adapter";
import * as Sentry from "@sentry/nextjs";
import { compare } from "bcrypt";
import { AuthOptions, User } from "next-auth";
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
    async signIn({ user, account }) {
      const existingUser = await prisma.user.findFirst({
        where: {
          id: user.id,
        },
      });
      if (existingUser) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            lastLogin: new Date(),
          },
        });
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
      if (!account) {
        return false;
      }
      await prisma.account.create({
        data: {
          userId: user.id,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        },
      });
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: invitation.role,
        },
      });
      await prisma.invitation.delete({
        where: {
          id: invitation.id,
        },
      });
      return true;
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
    signOut: "/logout",
  },
};
