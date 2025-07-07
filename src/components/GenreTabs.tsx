'use client';

interface Genre {
  id: number;
  name: string;
  tmdbId: number;
}

interface GenreTabsProps {
  activeGenre: string;
  onGenreChange: (genreId: string) => void;
  activeService: string;
}

const genres: Genre[] = [
  { id: 0, name: 'All', tmdbId: 0 },
  { id: 1, name: 'Action', tmdbId: 28 },
  { id: 2, name: 'Adventure', tmdbId: 12 },
  { id: 3, name: 'Animation', tmdbId: 16 },
  { id: 4, name: 'Comedy', tmdbId: 35 },
  { id: 5, name: 'Documentary', tmdbId: 99 },
  { id: 6, name: 'Drama', tmdbId: 18 },
  { id: 7, name: 'Romance', tmdbId: 10749 },
  { id: 8, name: 'Sci-Fi', tmdbId: 878 },
  { id: 9, name: 'Thriller', tmdbId: 53 },
  { id: 10, name: 'Western', tmdbId: 37 }
];

export function GenreTabs({ activeGenre, onGenreChange, activeService }: GenreTabsProps) {
  // Only show genre tabs when a specific streaming service is selected (not "All")
  if (activeService === 'all') {
    return null;
  }

  return (
    <div className="glass-morphism border-t border-white/10">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
        <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-xs md:text-sm text-gray-300 whitespace-nowrap mr-2 md:mr-3 font-medium">Genres:</span>
          {genres.map((genre, index) => (
            <button
              key={genre.id}
              onClick={() => onGenreChange(genre.tmdbId.toString())}
              className={`
                px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap transform hover:scale-105
                ${activeGenre === genre.tmdbId.toString()
                  ? 'bg-red-500 text-white shadow-lg ring-2 ring-red-500/50 animate-pulse-glow'
                  : 'glass-morphism text-gray-300 hover:bg-white/10 hover:text-white'
                }
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { genres };
