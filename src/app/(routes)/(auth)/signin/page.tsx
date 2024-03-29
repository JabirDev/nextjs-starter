import { Metadata } from "next";
import SignInForm from "./components/signin-form";
import { ModeToggle } from "@/components/mode-toggle";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4 px-4 py-6">
      <div className="flex w-1/2 flex-col items-center">
        <h1 className="text-3xl font-bold">Sign In to Next.js Starter</h1>
        <p>This is simple Next-Auth Authentication</p>
      </div>
      <SignInForm />
      <ModeToggle />
    </div>
  );
}
