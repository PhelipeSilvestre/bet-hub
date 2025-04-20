'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '@/components/EventCard';

interface EventTableCardProps {
  events: Event[];
  title?: string;
}

export const EventTableCard: React.FC<EventTableCardProps> = ({ events, title }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-md overflow-hidden shadow-sm border border-gray-200 dark:border-gray-800">
      {title && (
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-800 dark:text-white">{title}</h3>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            <tr>
              <th className="px-4 py-2 text-left">Dia/Horário</th>
              <th className="px-4 py-2 text-center">1</th>
              <th className="px-4 py-2 text-center">X</th>
              <th className="px-4 py-2 text-center">2</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {events.map((event) => {
              const { day, time } = formatDate(event.date);
              return (
                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3">
                    <Link href={`/event/${event.id}`} className="block">
                      <div className="text-gray-900 dark:text-white font-medium">{event.teams?.home || event.title}</div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-gray-500">{day} {time}</div>
                        {event.teams?.away && (
                          <div className="text-gray-900 dark:text-white font-medium">{event.teams.away}</div>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <button className="w-full rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 transition-colors text-center">
                      {event.odds?.home.toFixed(2) || '-'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button className="w-full rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 transition-colors text-center">
                      {event.odds?.draw?.toFixed(2) || '-'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button className="w-full rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 transition-colors text-center">
                      {event.odds?.away.toFixed(2) || '-'}
                    </button>
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