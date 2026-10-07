import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getAdminPath } from "@/lib/admin-path";
import { rateLimit } from "@/lib/rate-limit";

const authSecret = process.env.NEXTAUTH_SECRET;
if (process.env.NODE_ENV === "production" && (!authSecret || authSecret.length < 32)) {
  throw new Error("Set NEXTAUTH_SECRET to a unique value of at least 32 characters in production.");
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  secret: authSecret,
  session: { strategy: "jwt", maxAge: 12 * 60 * 60 }, // 12h
  pages: { signIn: `${getAdminPath()}/login` },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase();
        const emailLimit = await rateLimit(`admin-email:${email}`, 20, 15 * 60 * 1000);
        const forwardedIp = req.headers?.["x-real-ip"] ?? req.headers?.["x-forwarded-for"];
        const ip = Array.isArray(forwardedIp)
          ? forwardedIp[0]?.split(",")[0]?.trim()
          : forwardedIp?.split(",")[0]?.trim();
        const ipLimit = ip
          ? await rateLimit(`admin-ip:${ip}`, 10, 15 * 60 * 1000)
          : { ok: true };
        if (!emailLimit.ok || !ipLimit.ok) return null;

        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) session.user.id = token.uid as string;
      return session;
    },
  },
};
