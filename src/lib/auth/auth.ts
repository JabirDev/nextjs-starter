import NextAuth from "next-auth";
import Google from "@auth/core/providers/google";

import authConfig from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import prismadb from "@/lib/prisma/prismadb";

import Credentials from "@auth/core/providers/credentials";
import { OAuth2Client } from "google-auth-library";

const googleAuthClient = new OAuth2Client(process.env.AUTH_GOOGLE_ID);

const adapter = PrismaAdapter(prismadb);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter,
  providers: [
    Google,
    Credentials({
      // We will use this id later to specify for what Provider we want to trigger the signIn method
      id: "onetap",
      name: "one-tap",

      // This means that the authentication will be done through a single credential called 'credential'
      credentials: {
        credential: { type: "text" },
      },

      // This function will be called upon signIn
      async authorize(credentials, req) {
        // These next few lines are simply the recommended way to use the Google Auth Javascript API as seen in the Google Auth docs
        // What is going to happen is that t he Google One Tap UI will make an API call to Google and return a token associated with the user account
        // This token is then passed to the authorize function and used to retrieve the customer information (payload).
        // If this doesn't make sense yet, come back to it after having seen the custom hook.

        const token = credentials!.credential as string;
        const ticket = await googleAuthClient.verifyIdToken({
          idToken: token,
          audience: process.env.AUTH_GOOGLE_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
          throw new Error("Cannot extract payload from signin token");
        }

        const {
          email,
          sub,
          given_name,
          family_name,
          email_verified,
          picture: image,
        } = payload;
        if (!email) {
          throw new Error("Email not available");
        }

        // At this point we have deconstructed the payload and we have all the user's info at our disposal.
        // So first we're going to do a check to see if we already have this user in our DB using the email as identifier.
        // let user = adapter.getUserByEmail ? await adapter.getUserByEmail(email) : null;
        let user = await prismadb.user.findUnique({
          where: {
            email,
          },
        });

        // If no user is found, then we create one.
        if (!user) {
          // user = adapter.createUser ? await adapter.createUser({
          //   name: [given_name, family_name].join(" "),
          //   email,
          //   image,
          //   emailVerified: email_verified ? new Date() : null,
          // }) : null;
          user = await prismadb.user.create({
            data: {
              name: [given_name, family_name].join(" "),
              email,
              image,
              emailVerified: email_verified ? new Date() : null,
            },
          });
        }

        // The user may already exist, but maybe it signed up with a different provider. With the next few lines of code
        // we check if the user already had a Google account associated, and if not we create one.
        // let account = await adapter.getUserByAccount({ provider: "google", providerAccountId: sub });
        let account = await prismadb.account.findFirst({
          where: {
            providerAccountId: sub,
            provider: "google",
          },
        });

        if (!account && user) {
          console.log("creating and linking account");
          // await adapter.linkAccount({
          //   userId: user.id,
          //   provider: "google",
          //   providerAccountId: sub,
          //   type: "credentials",
          // });
          await prismadb.account.create({
            data: {
              userId: user.id,
              provider: "google",
              providerAccountId: sub,
              type: "credentials",
            },
          });
        }

        // The authorize function must return a user or null
        return user;
      },
    }),
  ],
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
