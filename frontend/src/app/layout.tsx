import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { SideMenu } from "@/components/layout/SideMenu";
import { AuthProvider } from "@/hooks/useAuth";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Bet Hub - Apostas Esportivas",
  description: "Plataforma de apostas esportivas online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-background text-white antialiased`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-grow">
              <SideMenu />
              <main className="flex-grow overflow-y-auto">
                {children}
              </main>
            </div>
            <footer className="py-2 border-t border-bet-border bg-background-dark text-gray-500 text-xs">
              <div className="max-w-7xl mx-auto px-4">
                <p className="text-center">
                  &copy; {new Date().getFullYear()} Bet Hub. Apostas seguras e responsáveis.
                </p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
