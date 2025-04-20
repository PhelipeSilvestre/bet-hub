'use client';

import Link from 'next/link';
import { useState } from 'react';

// Dados dos esportes para o menu
const sports = [
  { id: 'futebol', name: 'Futebol', icon: '⚽' },
  { id: 'basquete', name: 'Basquete', icon: '🏀' },
  { id: 'tenis', name: 'Tênis', icon: '🎾' },
  { id: 'volei', name: 'Vôlei', icon: '🏐' },
  { id: 'boxe', name: 'Boxe', icon: '🥊' },
  { id: 'formula1', name: 'Fórmula 1', icon: '🏎️' },
  { id: 'mma', name: 'MMA', icon: '🥋' },
  { id: 'americano', name: 'Futebol Americano', icon: '🏈' },
  { id: 'basebol', name: 'Basebol', icon: '⚾' },
  { id: 'hoquei', name: 'Hóquei', icon: '🏒' },
];

export const SideMenu = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-width duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } hidden md:block`}
    >
      <div className="sticky top-0">
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
          <h2 className={`font-semibold text-gray-800 dark:text-white ${isCollapsed ? 'sr-only' : ''}`}>
            Esportes
          </h2>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          >
            {isCollapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-1">
            {sports.map((sport) => (
              <li key={sport.id}>
                <Link
                  href={`/sports/${sport.id}`}
                  className="flex items-center px-2 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-xl mr-3">{sport.icon}</span>
                  {!isCollapsed && <span className="text-gray-700 dark:text-gray-300">{sport.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};