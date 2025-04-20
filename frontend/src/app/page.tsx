import { Suspense } from 'react';
import { EventTableCard } from '@/components/EventTableCard';
import { SportsCategoriesSection } from '@/components/SportsCategoriesSection';
import { mockEvents } from '@/mocks/events';

// Agrupar eventos por esporte
const groupEventsBySport = (events: typeof mockEvents) => {
  return events.reduce((acc, event) => {
    if (!acc[event.sport]) {
      acc[event.sport] = [];
    }
    acc[event.sport].push(event);
    return acc;
  }, {} as Record<string, typeof mockEvents>);
};

export default async function Home() {
  // Obter eventos agrupados por esporte
  const eventsBySport = groupEventsBySport(mockEvents);
  
  return (
    <div className="p-4 md:p-6">
      <Suspense fallback={<div>Carregando...</div>}>
        <SportsCategoriesSection />
      </Suspense>
      
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Próximos Eventos</h2>
        
        {Object.entries(eventsBySport).map(([sport, events]) => (
          <div key={sport} className="mb-6">
            <EventTableCard 
              events={events}
              title={sport}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
