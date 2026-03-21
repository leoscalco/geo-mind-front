import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus Macro — Geopolítica · História · Economia",
  description:
    "Dashboard de inteligência que conecta eventos geopolíticos atuais com análogos históricos para gerar insights e playbooks estratégicos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full bg-slate-950">{children}</body>
    </html>
  );
}
