import NextAuth from "next-auth";
import { assertAuthSecretConfigured, authOptions } from "@/auth";

const handler = NextAuth(authOptions);

const handleAuth: typeof handler = (...args: Parameters<typeof handler>) => {
  assertAuthSecretConfigured();
  return handler(...args);
};

export { handleAuth as GET, handleAuth as POST };
