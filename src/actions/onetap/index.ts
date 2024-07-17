"use server";

import { AuthError } from "@auth/core/errors";
import { SignInOptions } from "next-auth/react";
import { signIn } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

interface OneTapSigninOptions {
  credential: string;
}

export const OneTapAction = async (
  options?: OneTapSigninOptions &
    Pick<SignInOptions, "redirect" | "callbackUrl">,
) => {
  try {
    // Here we call our Provider with the token provided by google
    const signin = await signIn("onetap", {
      ...options,
    });
    if (signin.ok) {
      redirect("/");
    }
    return signin;
  } catch (error) {
    console.error("OneTap:", error);
    if (error instanceof Error) {
      const { type, cause } = error as AuthError;
      switch (type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        case "CallbackRouteError":
          return cause?.err?.toString();
        default:
          return "Something went wrong.";
      }
    }

    throw error;
  }
};
