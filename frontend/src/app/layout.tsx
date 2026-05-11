import type { Metadata } from "next";
import { Bodoni_Moda, IBM_Plex_Sans } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const displayFont = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const bodyFont = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CarWash Admin",
  description: "Panel administrativo para CarWash Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,_rgba(193,116,57,0.18),_transparent_24%),linear-gradient(180deg,_rgba(11,11,15,1)_0%,_rgba(13,13,18,1)_34%,_rgba(8,8,11,1)_100%)] text-stone-100">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />
          <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
            <Sidebar />
            <main className="flex-1 px-4 py-4 lg:px-6 lg:py-6">
              <div className="glass-panel min-h-[calc(100vh-2rem)] p-5 sm:p-7">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
