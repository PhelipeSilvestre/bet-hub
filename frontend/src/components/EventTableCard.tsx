'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Event } from '@/components/EventCard';

interface EventTableCardProps {
  events: Event[];
  title?: string;
}

export const EventTableCard: React.FC<EventTableCardProps> = ({ events, title }) => {
  const [extraNumbers, setExtraNumbers] = useState<Record<string, number>>({});

  useEffect(() => {
    const numbers = events.reduce((acc, event) => {
      acc[event.id] = Math.floor(Math.random() * 30) + 10;
      return acc;
    }, {} as Record<string, number>);
    
    setExtraNumbers(numbers);
  }, [events]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="mb-4">
      {title && (
        <div className="bg-bet-header px-2 py-1 text-white font-medium text-xs flex items-center rounded-t-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="uppercase tracking-wide text-[11px]">{title}</span>
        </div>
      )}
      
      <div className="bg-background-light rounded-b-sm">
        <table className="w-full text-xs border-separate border-spacing-0">
          <thead className="bg-background">
            <tr className="text-gray-400 uppercase text-[10px]">
              <th className="px-2 py-1 text-left">Data / Evento</th>
              <th className="px-1 py-1 text-center w-12">1</th>
              <th className="px-1 py-1 text-center w-12">X</th>
              <th className="px-1 py-1 text-center w-12">2</th>
              <th className="px-2 py-1 text-center w-10">+</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const { day, time } = formatDate(event.date);
              return (
                <tr key={event.id} className="border-b border-bet-border">
                  <td className="px-2 py-1">
                    <Link href={`/event/${event.id}`} className="block">
                      <div className="text-[10px] text-gray-400">{day} {time}</div>
                      <div className="font-medium text-white text-xs leading-tight">{event.teams?.home || event.title}</div>
                      {event.teams?.away && (
                        <div className="font-medium text-white text-xs leading-tight">{event.teams.away}</div>
                      )}
                    </Link>
                  </td>
                  <td className="px-1 py-1">
                    <div className="bg-bet-odd hover:bg-bet-oddHover cursor-pointer text-center py-1 rounded-sm text-white text-xs font-semibold">
                      {event.odds?.home.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-1 py-1">
                    <div className="bg-bet-odd hover:bg-bet-oddHover cursor-pointer text-center py-1 rounded-sm text-white text-xs font-semibold">
                      {event.odds?.draw?.toFixed(2) || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1">
                    <div className="bg-bet-odd hover:bg-bet-oddHover cursor-pointer text-center py-1 rounded-sm text-white text-xs font-semibold">
                      {event.odds?.away.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-2 py-1 text-center">
                    <Link href={`/event/${event.id}`} className="text-secondary hover:underline text-[10px]">
                      +{extraNumbers[event.id] || ''}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};