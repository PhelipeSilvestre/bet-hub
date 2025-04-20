'use client';

import React from 'react';
import Link from 'next/link';

// Categorias de esportes para exibição na página inicial
const sportsCategories = [
  { id: 'futebol', name: 'Futebol', icon: '⚽', competitions: ['brasileirao', 'champions', 'libertadores', 'premier-league'] },
  { id: 'basquete', name: 'Basquete', icon: '🏀', competitions: ['nba', 'euroleague'] },
  { id: 'tenis', name: 'Tênis', icon: '🎾', competitions: ['atp', 'wta', 'grand-slam'] },
  { id: 'volei', name: 'Vôlei', icon: '🏐', competitions: ['superliga'] },
  { id: 'formula1', name: 'Fórmula 1', icon: '🏎️', competitions: ['f1-mundial'] },
  { id: 'mma', name: 'MMA', icon: '🥋', competitions: ['ufc', 'bellator'] },
];

// Banners para carrossel
const banners = [
  { id: 1, title: 'Bônus de Boas-vindas', description: 'Ganhe até R$200 no seu primeiro depósito', image: '/images/banner1.jpg', color: 'bg-gradient-to-r from-primary to-primary-600' },
  { id: 2, title: 'Apostas sem Risco', description: 'Receba até R$100 de volta se perder', image: '/images/banner2.jpg', color: 'bg-gradient-to-r from-secondary to-secondary-600' },
  { id: 3, title: 'Super Odds na Premier League', description: 'Odds aumentadas para os jogos do fim de semana', image: '/images/banner3.jpg', color: 'bg-gradient-to-r from-primary-600 to-secondary-600' },
];

export const SportsCategoriesSection = () => {
  return (
    <div className="space-y-6">
      {/* Barra de pesquisa */}
      <div className="relative">
        <input
          type="text"
          placeholder="Pesquisar eventos, times ou competições..."
          className="w-full py-3 pl-10 pr-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Banners em carrossel */}
      <div className="relative rounded-lg overflow-hidden h-40 md:h-56">
        {banners.map((banner, index) => (
          <div 
            key={banner.id} 
            className={`absolute inset-0 ${banner.color} p-6 flex flex-col justify-between ${index === 0 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          >
            <div>
              <h2 className="text-2xl font-bold text-white">{banner.title}</h2>
              <p className="text-white/80 mt-2">{banner.description}</p>
            </div>
            <button className="self-start bg-white text-primary font-semibold py-2 px-4 rounded-md hover:bg-gray-100 transition-colors">
              Saiba Mais
            </button>
          </div>
        ))}
        
        {/* Indicadores de slide */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((banner, index) => (
            <button 
              key={banner.id} 
              className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Categorias de esportes */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Categorias Populares</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {sportsCategories.map(sport => (
            <Link 
              key={sport.id} 
              href={`/sports/${sport.id}`}
              className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <span className="text-3xl mb-2">{sport.icon}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{sport.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};