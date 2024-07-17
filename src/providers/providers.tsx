import OneTapComponent from "@/components/onetap";
import NextAuthProvider from "./next-auth-provider";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <OneTapComponent googleClientID={process.env.AUTH_GOOGLE_ID!} />
      </ThemeProvider>
    </NextAuthProvider>
  );
}
