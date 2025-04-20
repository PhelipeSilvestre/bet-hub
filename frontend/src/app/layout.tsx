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
    <html lang="pt-BR">
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-grow">
              <SideMenu />
              <main className="flex-grow overflow-y-auto">
                {children}
              </main>
            </div>
            <footer className="py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="max-w-7xl mx-auto px-4">
                <p className="text-center text-sm text-gray-500">
                  &copy; {new Date().getFullYear()} Bet Hub. Todos os direitos reservados.
                </p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
