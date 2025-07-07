'use client';

interface StreamingService {
  id: string;
  name: string;
  logo: React.ReactNode;
  logoType: 'emoji' | 'svg' | 'text';
  color: string;
  tmdbId: number;
}

interface StreamingNavigationProps {
  activeService: string;
  onServiceChange: (serviceId: string) => void;
}

const streamingServices: StreamingService[] = [
  {
    id: 'all',
    name: 'All',
    logo: '🎬',
    logoType: 'emoji',
    color: 'bg-red-600 hover:bg-red-700',
    tmdbId: 0
  },
  {
    id: 'netflix',
    name: 'Netflix',
    logo: (
      <div className="bg-red-600 text-white font-bold text-xs px-2 py-1 rounded">
        N
      </div>
    ),
    logoType: 'svg',
    color: 'bg-red-600 hover:bg-red-700',
    tmdbId: 8
  },
  {
    id: 'prime',
    name: 'Prime Video',
    logo: (
      <div className="bg-blue-600 text-white font-bold text-xs px-2 py-1 rounded">
        P
      </div>
    ),
    logoType: 'svg',
    color: 'bg-blue-600 hover:bg-blue-700',
    tmdbId: 9
  },
  {
    id: 'hulu',
    name: 'Hulu',
    logo: (
      <div className="bg-green-500 text-white font-bold text-xs px-2 py-1 rounded">
        H
      </div>
    ),
    logoType: 'svg',
    color: 'bg-green-600 hover:bg-green-700',
    tmdbId: 15
  },
  {
    id: 'paramount',
    name: 'Paramount+',
    logo: (
      <div className="bg-blue-800 text-white font-bold text-xs px-2 py-1 rounded">
        P+
      </div>
    ),
    logoType: 'svg',
    color: 'bg-blue-800 hover:bg-blue-900',
    tmdbId: 531
  },
  {
    id: 'disney',
    name: 'Disney+',
    logo: (
      <div className="bg-blue-500 text-white font-bold text-xs px-2 py-1 rounded">
        D+
      </div>
    ),
    logoType: 'svg',
    color: 'bg-blue-500 hover:bg-blue-600',
    tmdbId: 337
  },
  {
    id: 'apple',
    name: 'Apple TV+',
    logo: (
      <div className="bg-gray-800 text-white font-bold text-xs px-2 py-1 rounded">
        A
      </div>
    ),
    logoType: 'svg',
    color: 'bg-gray-800 hover:bg-gray-900',
    tmdbId: 350
  },
  {
    id: 'hbo',
    name: 'HBO Max',
    logo: (
      <div className="bg-purple-600 text-white font-bold text-xs px-2 py-1 rounded">
        HBO
      </div>
    ),
    logoType: 'svg',
    color: 'bg-purple-600 hover:bg-purple-700',
    tmdbId: 384
  },
  {
    id: 'peacock',
    name: 'Peacock',
    logo: (
      <div className="bg-purple-500 text-white font-bold text-xs px-2 py-1 rounded">
        PC
      </div>
    ),
    logoType: 'svg',
    color: 'bg-purple-500 hover:bg-purple-600',
    tmdbId: 386
  },
  {
    id: 'discovery',
    name: 'Discovery+',
    logo: (
      <div className="bg-blue-700 text-white font-bold text-xs px-2 py-1 rounded">
        D+
      </div>
    ),
    logoType: 'svg',
    color: 'bg-blue-700 hover:bg-blue-800',
    tmdbId: 520
  },
  {
    id: 'oxygen',
    name: 'Oxygen True Crime',
    logo: (
      <div className="bg-red-500 text-white font-bold text-xs px-2 py-1 rounded">
        OX
      </div>
    ),
    logoType: 'svg',
    color: 'bg-red-500 hover:bg-red-600',
    tmdbId: 79
  }
];

export function StreamingNavigation({ activeService, onServiceChange }: StreamingNavigationProps) {
  return (
    <nav className="glass-morphism px-3 md:px-6 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide">
          {streamingServices.map((service, index) => (
            <button
              key={service.id}
              onClick={() => onServiceChange(service.id)}
              className={`
                px-4 md:px-6 py-2.5 rounded-xl font-bold text-white transition-all duration-300 whitespace-nowrap text-sm md:text-base flex-shrink-0 transform hover:scale-105
                ${activeService === service.id 
                  ? service.color + ' ring-2 ring-white/50 shadow-lg animate-pulse-glow' 
                  : 'glass-morphism hover:bg-white/10'
                }
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {service.name}
            </button>
          ))}
        </div>
        {/* Enhanced scroll indicator for mobile */}
        <div className="flex justify-center mt-2 sm:hidden">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export { streamingServices };
