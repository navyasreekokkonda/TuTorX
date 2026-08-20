import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <SignIn
        appearance={{
          baseTheme: dark,
          elements: {
            rootBox: "w-full max-w-sm",
            card: "bg-black border border-neutral-800 shadow-none rounded-xl",
            headerTitle: "text-white text-xl font-medium",
            headerSubtitle: "text-neutral-400",

            socialButtonsBlockButton:
              "bg-black border border-neutral-800 text-white hover:bg-neutral-900",
            socialButtonsBlockButtonText: "text-white",

            dividerLine: "bg-neutral-800",
            dividerText: "text-neutral-500",

            formFieldLabel: "text-neutral-400",
            formFieldInput:
              "bg-black border-neutral-800 text-white focus:border-white focus:ring-0",

            formButtonPrimary:
              "bg-white text-black hover:bg-neutral-200 text-sm font-medium",

            footerActionLink: "text-neutral-400 hover:text-white",
            footer: "hidden",
          },
        }}
      />
    </div>
  );
}
