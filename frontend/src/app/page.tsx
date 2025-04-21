'use client';

import { useEffect, useState } from 'react';
import { EventTableCard } from '@/components/EventTableCard';
import { SportsCategoriesSection } from '@/components/SportsCategoriesSection';
import { mockEvents } from '@/mocks/events';
import { Event } from '@/components/EventCard';

// Agrupar eventos por esporte
const groupEventsBySport = (events: Event[]) => {
  return events.reduce((acc, event) => {
    if (!acc[event.sport]) {
      acc[event.sport] = [];
    }
    acc[event.sport].push(event);
    return acc;
  }, {} as Record<string, Event[]>);
};

export default function Home() {
  const [eventsBySport, setEventsBySport] = useState<Record<string, Event[]>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simular a chamada de API
    setEventsBySport(groupEventsBySport(mockEvents));
    setLoading(false);
  }, []);
  
  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-8 bg-background-lighter rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-32 bg-background-lighter rounded"></div>
              <div className="grid grid-cols-3 gap-3">
                <div className="h-20 bg-background-lighter rounded"></div>
                <div className="h-20 bg-background-lighter rounded"></div>
                <div className="h-20 bg-background-lighter rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full p-2 md:p-3">
      <SportsCategoriesSection />
      
      <div className="mt-6 flex flex-wrap gap-2">
        <div className="text-xs text-secondary font-medium uppercase border-l-2 border-secondary pl-2">
          Esportes em destaque
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        {Object.entries(eventsBySport).map(([sport, events]) => (
          <EventTableCard 
            key={sport}
            events={events}
            title={sport}
          />
        ))}
      </div>

      {/* Elementos adicionais como apostas ao-vivo exibidos no bet365 */}
      <div className="mt-6 bg-background-light p-3 rounded-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="text-white font-medium flex items-center">
            <svg className="h-5 w-5 mr-2 text-secondary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
            </svg>
            Em breve
          </div>
          <button className="text-secondary text-sm hover:underline">
            Ver tudo
          </button>
        </div>

        <div className="text-center py-6 text-gray-400">
          Não há eventos em breve neste momento
        </div>
      </div>
    </div>
  );
}
