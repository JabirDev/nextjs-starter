import type { NextAuthConfig } from "next-auth"
import Google from "@auth/core/providers/google"

export default {
  secret: process.env.AUTH_SECRET,
  providers: [Google],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl))
      }
      return true
    },
  },
  pages: {
    // signIn: "/signin",
    // signOut: "/signout",
  },
} satisfies NextAuthConfig
