import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext"; // ✅ Import AuthProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maven Group",
  description: "A real-estate maven",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> {/* ✅ Wrap the app with AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
