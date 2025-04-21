'use client';

import Link from 'next/link';
import { useState } from 'react';

// Dados dos esportes para o menu
const sports = [
  { id: 'futebol', name: 'Futebol', icon: '⚽' },
  { id: 'tenis', name: 'Tênis', icon: '🎾' },
  { id: 'basquete', name: 'Basquete', icon: '🏀' },
  { id: 'volei', name: 'Vôlei', icon: '🏐' },
  { id: 'formula1', name: 'Fórmula 1', icon: '🏎️' },
  { id: 'mma', name: 'MMA', icon: '🥋' },
  { id: 'americano', name: 'Futebol Americano', icon: '🏈' },
  { id: 'boxe', name: 'Boxe', icon: '🥊' },
  { id: 'esports', name: 'eSports', icon: '🎮' },
];

const featuredCompetitions = [
  { id: 'serie-a', name: 'Série A', country: 'Brasil' },
  { id: 'premier-league', name: 'Premier League', country: 'Inglaterra' },
  { id: 'champions', name: 'Champions League', country: 'Europa' },
  { id: 'nba', name: 'NBA', country: 'EUA' },
];

export const SideMenu = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('em-alta');

  return (
    <aside 
      className={`bg-background border-r border-bet-border transition-width duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } hidden md:block overflow-y-auto`}
      style={{ height: 'calc(100vh - 8rem)' }}
    >
      <div className="px-3 py-2.5 flex justify-between items-center border-b border-bet-border">
        <svg className="h-5 w-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
        </svg>
        <h2 className={`font-medium text-white uppercase text-xs tracking-wider ${isCollapsed ? 'sr-only' : ''}`}>
          Ofertas
        </h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-bet-border text-gray-400 hover:text-white"
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Categoria Em Alta */}
      <div 
        className={`py-2 px-3 ${activeCategory === 'em-alta' ? 'bg-background-lighter' : ''} cursor-pointer`}
        onClick={() => setActiveCategory('em-alta')}
      >
        <div className="flex items-center text-white font-medium text-sm">
          <svg className="h-4 w-4 mr-2 text-secondary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
          {!isCollapsed && "EM ALTA"}
        </div>
      </div>

      <nav className="py-1">
        <ul className="space-y-0.5">
          {featuredCompetitions.map((comp) => (
            <li key={comp.id} className="hover:bg-background-lighter">
              <Link
                href={`/competicao/${comp.id}`}
                className="flex items-center px-3 py-2 text-gray-300 hover:text-white"
              >
                <svg className="h-4 w-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span className="text-xs">{comp.name}</span>
                    <span className="text-xs text-gray-500">{comp.country}</span>
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="h-px bg-bet-border my-2"></div>

        {/* Lista de Esportes */}
        {sports.map((sport) => (
          <Link
            key={sport.id}
            href={`/sports/${sport.id}`}
            className="flex items-center px-3 py-2 hover:bg-background-lighter text-gray-300 hover:text-white"
          >
            <span className="text-lg mr-3">{sport.icon}</span>
            {!isCollapsed && <span className="text-sm">{sport.name}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};