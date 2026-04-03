import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aristosys — AI-Powered Recruitment Platform (Demo)",
  description: "Demo showcase of Aristosys: AI resume screening, voice interviews, and recruiter pipeline management.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
