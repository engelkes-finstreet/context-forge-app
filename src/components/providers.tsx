"use client";

import { ThemeProvider } from "next-themes";
import { TransitionRouter } from "next-transition-router";
import { animate } from "framer-motion";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TransitionRouter
        auto={true}
        leave={async (next) => {
          // Exit animation: opacity 1→0, y 0→-10 (faster and less movement)
          await animate(
            "main",
            { opacity: 0, y: -10 },
            { duration: 0.1, ease: "easeOut" },
          );
          next();
        }}
        enter={async (next) => {
          // Complete navigation first
          next();

          // Entry animation: opacity 0→1, y 10→0 (faster and less movement)
          await animate(
            "main",
            { opacity: [0, 1], y: [10, 0] },
            { duration: 0.1, ease: "easeOut" },
          );
        }}
      >
        {children}
      </TransitionRouter>
    </ThemeProvider>
  );
}
