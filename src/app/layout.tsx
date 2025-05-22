import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Froggy's Portfolio",
  description: "Froggy (@froggodoggo) - a Roblox Backend Developer creating high-performance systems. Check out my portfolio for my work and hiring options.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
		<link rel="icon" href="/img/froggy.ico" sizes="32x32" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}