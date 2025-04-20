'use client';

import React from 'react';
import Link from 'next/link';

export interface Event {
  id: string;
  title: string;
  date: string;
  sport: string;
  teams?: {
    home: string;
    away: string;
  };
  odds?: {
    home: number;
    draw?: number;
    away: number;
  };
}

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Format date if it exists and is valid
  const formattedDate = event.date ? new Date(event.date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Data não disponível';

  return (
    <Link href={`/event/${event.id}`}>
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-900">
        {/* Event title and metadata */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{event.title || 'Evento sem título'}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.sport || 'Esporte não especificado'}</p>
          </div>
        </div>
        
        {/* Teams section */}
        {event.teams && (
          <div className="mt-4 grid grid-cols-3 text-center">
            <div className="text-sm font-medium">{event.teams.home}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">vs</div>
            <div className="text-sm font-medium">{event.teams.away}</div>
          </div>
        )}
        
        {/* Odds section */}
        {event.odds && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">Home</div>
              <div className="font-medium">{event.odds.home.toFixed(2)}</div>
            </div>
            
            {event.odds.draw !== undefined && (
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Draw</div>
                <div className="font-medium">{event.odds.draw.toFixed(2)}</div>
              </div>
            )}
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">Away</div>
              <div className="font-medium">{event.odds.away.toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};