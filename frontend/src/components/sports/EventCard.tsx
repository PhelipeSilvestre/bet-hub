import Link from 'next/link';
import { formatDate } from '@/lib/utils';

type EventCardProps = {
  id: string;
  sportKey: string;
  sportName: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  odds: {
    home: number | null;
    away: number | null;
    draw: number | null;
  };
};

export const EventCard = ({
  id,
  sportKey,
  sportName,
  homeTeam,
  awayTeam,
  startTime,
  odds,
}: EventCardProps) => {
  return (
    <Link href={`/sports/${sportKey}/events/${id}`}>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">{sportName}</span>
          <span className="text-sm text-gray-500">
            {formatDate(startTime, { 
              day: 'numeric', 
              month: 'short', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="font-semibold">{homeTeam}</div>
          <div className="text-gray-400">vs</div>
          <div className="font-semibold">{awayTeam}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <button className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-center hover:bg-gray-200 dark:hover:bg-gray-700">
            <div className="text-sm">Casa</div>
            <div className="font-semibold">{odds.home || '-'}</div>
          </button>
          {odds.draw !== null && (
            <button className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-center hover:bg-gray-200 dark:hover:bg-gray-700">
              <div className="text-sm">Empate</div>
              <div className="font-semibold">{odds.draw || '-'}</div>
            </button>
          )}
          <button className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-center hover:bg-gray-200 dark:hover:bg-gray-700">
            <div className="text-sm">Fora</div>
            <div className="font-semibold">{odds.away || '-'}</div>
          </button>
        </div>
      </div>
    </Link>
  );
};
