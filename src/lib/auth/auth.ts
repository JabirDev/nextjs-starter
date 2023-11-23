import NextAuth from "next-auth";
import authConfig from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import prismadb from "@/lib/prisma/prismadb";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prismadb),
  callbacks: {
    async session({ session }: any) {
      const users = await prismadb.user.findUnique({
        where: {
          email: session.user.email!,
        },
      });
      session.user.role = users?.role;
      return session;
    },
  },
  session: { strategy: "jwt" },
});
