'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <div className="text-2xl font-bold">Bet Hub</div>
            </Link>
            
            <nav className="hidden md:flex space-x-1">
              <Link href="/sports" className="px-4 py-2 hover:bg-primary-600 rounded-md transition-colors">
                Todos os Esportes
              </Link>
              <span className="text-gray-300 self-center">|</span>
              <Link href="/live" className="px-4 py-2 hover:bg-primary-600 rounded-md transition-colors">
                Ao-Vivo
              </Link>
              <span className="text-gray-300 self-center">|</span>
              <Link href="/casino" className="px-4 py-2 hover:bg-primary-600 rounded-md transition-colors">
                Cassino
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm hidden md:inline-block">{user.name}</span>
                <Button variant="outline" className="bg-transparent hover:bg-primary-600 border-white text-white" onClick={logout}>
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" className="bg-transparent hover:bg-primary-600 border-white text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-white text-primary hover:bg-gray-100">
                    Registre-se
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};