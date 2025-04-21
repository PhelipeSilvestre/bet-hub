'use client';

import React from 'react';
import Link from 'next/link';

// Categorias de esportes para exibição na página inicial
const sportsIcons = [
  { id: 'futebol', name: 'Futebol', icon: '⚽' },
  { id: 'tenis', name: 'Tênis', icon: '🎾' },
  { id: 'formula1', name: 'F1', icon: '🏎️' },
  { id: 'esports', name: 'E-Sports', icon: '🎮' },
  { id: 'cassino', name: 'Cassino', icon: '🎰' },
  { id: 'basquete', name: 'Basquete', icon: '🏀' },
  { id: 'volei', name: 'Vôlei', icon: '🏐' },
  { id: 'tenis-de-mesa', name: 'T. Mesa', icon: '🏓' },
  { id: 'virtual', name: 'Virtual', icon: '🖥️' },
  { id: 'futebol-americano', name: 'F. Americano', icon: '🏈' },
  { id: 'beisebol', name: 'Beisebol', icon: '⚾' },
  { id: 'boxe', name: 'Boxe', icon: '🥊' },
];

// Banners para destaque
const bannerData = [
  {
    id: 'novos-clientes',
    title: 'DESCUBRA POR QUE O EXTRAORDINÁRIO ACONTECE AQUI',
    buttonText: 'Registre-se',
    disclaimer: 'Jogue com responsabilidade. 18+.',
    bgColor: 'from-bet-header to-primary-800',
  },
  {
    id: 'sao-paulo-vs-santos',
    title: 'PARA AMBOS OS TIMES MARCAREM',
    subtitle: 'São Paulo vs Santos',
    buttonText: 'Saiba mais',
    disclaimer: 'Apenas para clientes novos e elegíveis.',
    bgColor: 'from-primary-700 to-primary-800',
  },
  {
    id: 'substituicoes',
    title: 'JOGADOR SUBSTITUÍDO, APOSTA MANTIDA',
    buttonText: 'Apostar agora',
    disclaimer: 'Disponível para competições selecionadas.',
    bgColor: 'from-primary-800 to-primary-900',
  },
];

export const SportsCategoriesSection = () => {
  return (
    <div className="space-y-3">
      {/* Barra de pesquisa */}
      <div className="relative">
        <div className="flex items-center w-full bg-background border border-bet-border rounded-sm overflow-hidden">
          <svg
            className="h-3 w-3 text-gray-400 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Pesquisar"
            className="w-full py-1.5 px-2 bg-background text-white border-none focus:outline-none text-xs"
          />
        </div>
      </div>

      {/* Banners promocionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        {bannerData.map((banner) => (
          <div 
            key={banner.id} 
            className={`bg-gradient-to-r ${banner.bgColor} p-2 rounded-sm flex flex-col justify-between h-20 min-h-0`}
          >
            <div>
              <h2 className="text-[11px] font-bold text-white leading-tight">{banner.title}</h2>
              {banner.subtitle && (
                <p className="text-white/90 text-[10px] mt-0.5">{banner.subtitle}</p>
              )}
            </div>
            <div className="space-y-0.5">
              <button className="bg-secondary text-black font-medium py-0.5 px-2 rounded-sm text-[10px] hover:bg-secondary-600 transition-colors min-h-0 h-5">
                {banner.buttonText}
              </button>
              <p className="text-white/70 text-[9px] leading-tight">{banner.disclaimer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Categorias de esportes com ícones */}
      <div className="mt-1">
        <div className="grid grid-cols-6 md:grid-cols-12 gap-0.5">
          {sportsIcons.map(sport => (
            <Link 
              key={sport.id} 
              href={`/sports/${sport.id}`}
              className="flex flex-col items-center py-0.5 px-0.5 hover:bg-background-lighter rounded transition-colors min-h-0"
            >
              <div className="w-4 h-4 rounded-full flex items-center justify-center bg-background mb-0.5">
                <span className="text-[11px]">{sport.icon}</span>
              </div>
              <span className="text-[9px] text-gray-300 text-center whitespace-nowrap overflow-hidden text-ellipsis w-full leading-tight">{sport.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};