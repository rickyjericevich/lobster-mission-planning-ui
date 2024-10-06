import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Mission Planner",
  description: "Mission planner for Lobster's AUVs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
