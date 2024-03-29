import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/auth";

const SignInForm = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button variant={"google"} type="submit">
        Sign In with Google
      </Button>
    </form>
  );
};

export default SignInForm;
