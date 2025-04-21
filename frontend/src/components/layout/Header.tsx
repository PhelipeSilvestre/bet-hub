'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#1a2c34] text-white shadow-md">
      {/* Top bar */}
      <div className="bg-[#0f2129] py-1 px-4 flex justify-between items-center text-xs border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Link href="/esportes" className="text-[#00a884] hover:text-[#00cc99] transition-colors px-2 py-1">
            Esportes
          </Link>
          <Link href="/cassino" className="text-[#00a884] hover:text-[#00cc99] transition-colors px-2 py-1">
            Cassino
          </Link>
          <Link href="/poker" className="text-[#00a884] hover:text-[#00cc99] transition-colors px-2 py-1">
            Poker
          </Link>
          <Link href="/extra" className="text-[#00a884] hover:text-[#00cc99] transition-colors px-2 py-1">
            Extra
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-white hover:text-gray-300 transition-colors px-2 py-1">
            Jogo Responsável
          </button>
          <button className="text-white hover:text-gray-300 transition-colors px-2 py-1">
            Ajuda
          </button>
          <button className="text-white hover:text-gray-300 transition-colors px-2 py-1">
            Contato
          </button>
        </div>
      </div>

      {/* Yellow divider */}
      <div className="bg-[#ffc107] h-0.5"></div>

      {/* Main header */}
      <div className="bg-[#1a2c34] py-2 px-6">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <svg className="h-8 w-8 text-white" viewBox="0 0 100 100" fill="currentColor">
              <path d="M90,78.5c0,8.3-12.4,15-27.7,15S34.6,86.8,34.6,78.5c0-3.2,2.5-6,5.6-6h44.1C87.5,72.5,90,75.3,90,78.5z M50,62.5 c-15.3,0-27.7-7.7-27.7-17.2c0-9.5,12.4-17.2,27.7-17.2s27.7,7.7,27.7,17.2C77.7,54.8,65.3,62.5,50,62.5z M50,28.3 c-9.2,0-16.7,4.6-16.7,10.3s7.5,10.3,16.7,10.3s16.7-4.6,16.7-10.3S59.2,28.3,50,28.3z M50,6.5c-15.3,0-27.7,7.7-27.7,17.2 c0,9.5,12.4,17.2,27.7,17.2s27.7-7.7,27.7-17.2C77.7,14.2,65.3,6.5,50,6.5z" />
            </svg>
          </Link>

          {/* Main navigation */}
          <nav className="hidden lg:flex flex-1 justify-center items-center space-x-6">
            <Link 
              href="/esportes" 
              className="text-white text-sm font-medium hover:bg-[#2a3f4a] px-3 py-1.5 rounded transition-colors"
            >
              Esportes
            </Link>
            <Link 
              href="/ao-vivo" 
              className="text-white text-sm font-medium hover:bg-[#2a3f4a] px-3 py-1.5 rounded transition-colors"
            >
              Ao Vivo
            </Link>
            <Link 
              href="/cassino" 
              className="text-white text-sm font-medium hover:bg-[#2a3f4a] px-3 py-1.5 rounded transition-colors"
            >
              Cassino
            </Link>
            <Link 
              href="/cassino-ao-vivo" 
              className="text-white text-sm font-medium hover:bg-[#2a3f4a] px-3 py-1.5 rounded transition-colors"
            >
              Cassino Ao Vivo
            </Link>
            <Link 
              href="/poker" 
              className="text-white text-sm font-medium hover:bg-[#2a3f4a] px-3 py-1.5 rounded transition-colors"
            >
              Poker
            </Link>
          </nav>

          {/* User account section */}
          <div className="flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-[#2a3f4a] rounded px-3 py-1">
                  <svg className="h-4 w-4 text-[#00a884] mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                  </svg>
                  <span className="text-sm text-white font-medium">R$ 500,00</span>
                </div>
                <button 
                  onClick={logout}
                  className="bg-[#00a884] hover:bg-[#008c6e] text-white text-sm font-medium py-1 px-4 rounded transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="bg-[#00a884] hover:bg-[#008c6e] text-white text-sm font-medium py-1 px-4 rounded transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-[#ffc107] hover:bg-[#e6ac00] text-black text-sm font-medium py-1 px-4 rounded transition-colors"
                >
                  Registre-se
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};