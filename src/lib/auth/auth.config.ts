import type { NextAuthConfig } from "next-auth";
import Google from "@auth/core/providers/google";

export default {
  secret: process.env.AUTH_SECRET,
  basePath: "/api/auth",
  providers: [Google],
  pages: {
    // signIn: "/signin",
    // signOut: "/signout",
  },
} satisfies NextAuthConfig;
