import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoPlanet — Жер планетасындағы қауіпті қалдықтар",
  description: "Қалдықтар туралы қазақ тіліндегі интерактивті жоба. Қалдықтарды сұрыпта, экологиялық ізіңді есепте және біліміңді тексер.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="kk">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
