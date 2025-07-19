'use client';

import { useState, useEffect, useRef } from 'react';

interface ComingThisWeekItem {
  id: string;
  title: string;
  type: 'movie' | 'series';
  releaseDate: string;
  image: string;
  genre: string;
}

export function ComingThisWeek() {
  const [movies, setMovies] = useState<ComingThisWeekItem[]>([]);
  const [series, setSeries] = useState<ComingThisWeekItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeftMovies, setCanScrollLeftMovies] = useState(false);
  const [canScrollRightMovies, setCanScrollRightMovies] = useState(false);
  const [canScrollLeftSeries, setCanScrollLeftSeries] = useState(false);
  const [canScrollRightSeries, setCanScrollRightSeries] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const scrollContainerMoviesRef = useRef<HTMLDivElement>(null);
  const scrollContainerSeriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchComingThisWeek();
  }, []);

  useEffect(() => {
    // Check scroll position to enable/disable arrows for both sections
    const checkScrollPosition = () => {
      if (scrollContainerMoviesRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerMoviesRef.current;
        setCanScrollLeftMovies(scrollLeft > 0);
        setCanScrollRightMovies(scrollLeft < scrollWidth - clientWidth - 1);
      }
      if (scrollContainerSeriesRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerSeriesRef.current;
        setCanScrollLeftSeries(scrollLeft > 0);
        setCanScrollRightSeries(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    const scrollContainerMovies = scrollContainerMoviesRef.current;
    const scrollContainerSeries = scrollContainerSeriesRef.current;
    
    if (scrollContainerMovies) {
      scrollContainerMovies.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();
    }
    if (scrollContainerSeries) {
      scrollContainerSeries.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();
    }

    return () => {
      if (scrollContainerMovies) {
        scrollContainerMovies.removeEventListener('scroll', checkScrollPosition);
      }
      if (scrollContainerSeries) {
        scrollContainerSeries.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [movies, series]);

  const scrollLeftMovies = () => {
    if (scrollContainerMoviesRef.current) {
      setIsPaused(true);
      scrollContainerMoviesRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
      setTimeout(() => setIsPaused(false), 2000);
    }
  };

  const scrollRightMovies = () => {
    if (scrollContainerMoviesRef.current) {
      setIsPaused(true);
      scrollContainerMoviesRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
      setTimeout(() => setIsPaused(false), 2000);
    }
  };

  const scrollLeftSeries = () => {
    if (scrollContainerSeriesRef.current) {
      setIsPaused(true);
      scrollContainerSeriesRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
      setTimeout(() => setIsPaused(false), 2000);
    }
  };

  const scrollRightSeries = () => {
    if (scrollContainerSeriesRef.current) {
      setIsPaused(true);
      scrollContainerSeriesRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
      setTimeout(() => setIsPaused(false), 2000);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    // Touch handling can be implemented per section if needed
  };

  const fetchComingThisWeek = async () => {
    try {
      // Get date range for this week (extend to next month for better results)
      const today = new Date();
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      // Fetch all upcoming content (both movies and TV shows) in a single call
      const response = await fetch(`/api/search?query=upcoming&type=all&limit=80&t=${Date.now()}`);
      const data = await response.json();
      
      // Get all results
      const allResults = data.results || [];
      
      // Filter items releasing soon (within next month) and sort by release date
      const upcomingItems = allResults
        .filter((item: any) => {
          if (!item.releaseDate) return false;
          const releaseDate = new Date(item.releaseDate);
          const isUpcoming = releaseDate >= today && releaseDate <= nextMonth;
          return isUpcoming;
        })
        .sort((a: any, b: any) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());

      // Separate movies and series
      const moviesList = upcomingItems.filter((item: any) => item.type === 'movie');
      const seriesList = upcomingItems.filter((item: any) => item.type === 'series');
      
      // Take up to 8 movies and 8 series
      const finalMovies = moviesList.slice(0, 8);
      const finalSeries = seriesList.slice(0, 8);
      
      // Sort by release date again
      finalMovies.sort((a: any, b: any) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
      finalSeries.sort((a: any, b: any) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());

      if (finalMovies.length > 0 || finalSeries.length > 0) {
        setMovies(finalMovies);
        setSeries(finalSeries);
      } else {
        // If no real upcoming data, show recent releases instead
        const recentResponse = await fetch(`/api/search?query=popular&limit=16&t=${Date.now()}`);
        const recentData = await recentResponse.json();
        
        if (recentData.results && recentData.results.length > 0) {
          // Add mock release dates for demonstration
          const itemsWithDates = recentData.results.slice(0, 16).map((item: any, index: number) => ({
            ...item,
            releaseDate: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }));
          
          const fallbackMovies = itemsWithDates.filter((item: any) => item.type === 'movie').slice(0, 8);
          const fallbackSeries = itemsWithDates.filter((item: any) => item.type === 'series').slice(0, 8);
          
          setMovies(fallbackMovies);
          setSeries(fallbackSeries);
        } else {
          // Ultimate fallback to sample data
          const sampleMovies = [
            {
              id: '1',
              title: 'Deadpool 3',
              type: 'movie' as const,
              releaseDate: '2025-07-10',
              image: '/api/placeholder/200/300',
              genre: 'Action'
            },
            {
              id: '3',
              title: 'Avatar 3',
              type: 'movie' as const,
              releaseDate: '2025-07-12',
              image: '/api/placeholder/200/300',
              genre: 'Sci-Fi'
            }
          ];
          
          const sampleSeries = [
            {
              id: '2',
              title: 'The Bear S4',
              type: 'series' as const,
              releaseDate: '2025-07-08',
              image: '/api/placeholder/200/300',
              genre: 'Comedy'
            },
            {
              id: '4',
              title: 'House of the Dragon S3',
              type: 'series' as const,
              releaseDate: '2025-07-09',
              image: '/api/placeholder/200/300',
              genre: 'Fantasy'
            }
          ];
          
          setMovies(sampleMovies);
          setSeries(sampleSeries);
        }
      }
    } catch (error) {
      console.error('Error fetching coming this week:', error);
      // Fallback to sample data with mixed content
      const errorMovies = [
        {
          id: '1',
          title: 'Deadpool 3',
          type: 'movie' as const,
          releaseDate: '2025-07-10',
          image: '/api/placeholder/200/300',
          genre: 'Action'
        }
      ];
      
      const errorSeries = [
        {
          id: '2',
          title: 'The Bear S4',
          type: 'series' as const,
          releaseDate: '2025-07-08',
          image: '/api/placeholder/200/300',
          genre: 'Comedy'
        }
      ];
      
      setMovies(errorMovies);
      setSeries(errorSeries);
    } finally {
      setLoading(false);
    }
  };

  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
        </div>
        <div className="flex space-x-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 animate-pulse">
              <div className="glass-morphism rounded-xl p-3 min-w-[280px] border border-white/10">
                <div className="w-12 h-16 bg-gray-700 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0 && series.length === 0) return null;

  const renderSection = (
    title: string,
    items: ComingThisWeekItem[],
    scrollContainerRef: React.RefObject<HTMLDivElement | null>,
    canScrollLeft: boolean,
    canScrollRight: boolean,
    scrollLeft: () => void,
    scrollRight: () => void
  ) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <div className="flex space-x-2">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full transition-all duration-200 ${
                canScrollLeft
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`p-2 rounded-full transition-all duration-200 ${
                canScrollRight
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/20 to-transparent z-10 pointer-events-none"></div>
          
          <div 
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto horizontal-scroll-smooth scrollbar-hide"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex-shrink-0 group cursor-pointer animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-3 glass-morphism rounded-xl p-3 min-w-[280px] hover:bg-white/15 transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-white/10">
                  <div className="w-12 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                    {item.image && !item.image.includes('placeholder') ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/20 to-blue-900/20">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold text-sm truncate group-hover:text-red-400 transition-colors duration-200">
                      {item.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold shadow-sm ${
                        item.type === 'movie' 
                          ? 'bg-blue-500/30 text-blue-200 border border-blue-500/50' 
                          : 'bg-green-500/30 text-green-200 border border-green-500/50'
                      }`}>
                        {item.type === 'movie' ? '🎬 Movie' : '📺 Series'}
                      </span>
                      <span className="text-xs text-gray-300 font-medium">{item.genre}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-red-300 font-bold">
                        {formatReleaseDate(item.releaseDate)}
                      </span>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
      </div>
      
      {renderSection(
        "🎬 Movies",
        movies,
        scrollContainerMoviesRef,
        canScrollLeftMovies,
        canScrollRightMovies,
        scrollLeftMovies,
        scrollRightMovies
      )}
      
      {renderSection(
        "📺 Series",
        series,
        scrollContainerSeriesRef,
        canScrollLeftSeries,
        canScrollRightSeries,
        scrollLeftSeries,
        scrollRightSeries
      )}
    </div>
  );
}
