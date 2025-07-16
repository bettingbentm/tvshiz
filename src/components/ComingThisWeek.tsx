'use client';

import { useState, useEffect, useRef } from 'react';
import { DetailModal } from './DetailModal';

interface ComingThisWeekItem {
  id: string;
  title: string;
  type: 'movie' | 'series';
  releaseDate: string;
  image: string;
  genre: string;
  description?: string;
  rating?: number;
  year?: number | string;
}

interface DetailedItem {
  id: string;
  title: string;
  description: string;
  rating: number;
  genre: string;
  year: number | string;
  image: string;
  type: 'movie' | 'series';
  releaseDate?: string;
}

export function ComingThisWeek() {
  const [movies, setMovies] = useState<ComingThisWeekItem[]>([]);
  const [series, setSeries] = useState<ComingThisWeekItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<DetailedItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        left: -400,
        behavior: 'smooth'
      });
      setTimeout(() => setIsPaused(false), 2000);
    }
  };

  const scrollRightMovies = () => {
    if (scrollContainerMoviesRef.current) {
      setIsPaused(true);
      scrollContainerMoviesRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      });
      setTimeout(() => setIsPaused(false), 2000);
    }
  };

  const scrollLeftSeries = () => {
    if (scrollContainerSeriesRef.current) {
      setIsPaused(true);
      scrollContainerSeriesRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      });
      setTimeout(() => setIsPaused(false), 2000);
    }
  };

  const scrollRightSeries = () => {
    if (scrollContainerSeriesRef.current) {
      setIsPaused(true);
      scrollContainerSeriesRef.current.scrollBy({
        left: 400,
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

  // Function to handle item click and show detailed modal
  const handleItemClick = async (item: ComingThisWeekItem) => {
    try {
      // First, show modal with basic info
      const basicDetailedItem: DetailedItem = {
        id: item.id,
        title: item.title,
        description: item.description || 'No description available for this upcoming title.',
        rating: item.rating || 0,
        genre: item.genre,
        year: item.year || new Date(item.releaseDate).getFullYear(),
        image: item.image,
        type: item.type,
        releaseDate: item.releaseDate
      };

      setSelectedItem(basicDetailedItem);
      setIsModalOpen(true);

      // Try to fetch more detailed information
      const response = await fetch(`/api/search?query=${encodeURIComponent(item.title)}&type=${item.type}&detailed=true&limit=1`);
      if (response.ok) {
        const data = await response.json();
        const detailedResult = data.results?.[0];
        
        if (detailedResult) {
          const enhancedItem: DetailedItem = {
            id: item.id,
            title: detailedResult.title || item.title,
            description: detailedResult.description || detailedResult.plot || detailedResult.overview || 'This upcoming title will be available soon. Stay tuned for more details!',
            rating: detailedResult.rating || detailedResult.imdbRating || detailedResult.vote_average || 0,
            genre: detailedResult.genre || detailedResult.genres?.[0] || item.genre,
            year: detailedResult.year || detailedResult.release_date?.split('-')[0] || detailedResult.first_air_date?.split('-')[0] || new Date(item.releaseDate).getFullYear(),
            image: detailedResult.image || detailedResult.poster_path || detailedResult.backdrop_path || item.image,
            type: item.type,
            releaseDate: item.releaseDate
          };
          
          setSelectedItem(enhancedItem);
        }
      }
    } catch (error) {
      console.error('Error fetching detailed info:', error);
      // Modal will still show with basic info
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Helper function to check if content is English/American
  const isEnglishAmericanContent = (item: any) => {
    const title = item.title.toLowerCase();
    
    // Check if title contains mostly English characters (basic check)
    const hasEnglishChars = /^[a-zA-Z0-9\s\-\:\.\'\"!?&,()]+$/.test(item.title);
    
    // Exclude obvious non-English content indicators
    const hasNonEnglishChars = item.title.match(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u0400-\u04ff\u0590-\u05ff\u0600-\u06ff\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/g);
    
    // Filter out common non-English patterns and keywords
    const nonEnglishPatterns = [
      'anime', 'manga', 'k-pop', 'bollywood', 'telugu', 'tamil', 'hindi', 'korean',
      'japanese', 'chinese', 'thai', 'vietnamese', 'spanish', 'french', 'german',
      'italian', 'portuguese', 'russian', 'arabic', 'vocaloid', 'j-pop', 'k-drama'
    ];
    
    const hasNonEnglishKeywords = nonEnglishPatterns.some(pattern => title.includes(pattern));
    
    return hasEnglishChars && !hasNonEnglishChars && !hasNonEnglishKeywords;
  };

  const fetchComingThisWeek = async () => {
    try {
      // Get date range for this week (extend to next month for better results)
      const today = new Date();
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      // Fetch all upcoming content (both movies and TV shows) in a single call
      const response = await fetch(`/api/search?query=upcoming&type=all&limit=120&t=${Date.now()}`);
      const data = await response.json();
      
      // Get all results
      const allResults = data.results || [];
      
      // Filter items releasing soon (within next month), English/American content, and sort by release date
      const upcomingItems = allResults
        .filter((item: any) => {
          if (!item.releaseDate) return false;
          const releaseDate = new Date(item.releaseDate);
          const isUpcoming = releaseDate >= today && releaseDate <= nextMonth;
          
          // Filter for English/American content
          const isEnglishContent = isEnglishAmericanContent(item);
          
          return isUpcoming && isEnglishContent;
        })
        .sort((a: any, b: any) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());

      // Separate movies and series
      const moviesList = upcomingItems.filter((item: any) => item.type === 'movie');
      const seriesList = upcomingItems.filter((item: any) => item.type === 'series');
      
      // Take up to 20 movies and 20 series
      const finalMovies = moviesList.slice(0, 20);
      const finalSeries = seriesList.slice(0, 20);
      
      // Sort by release date again
      finalMovies.sort((a: any, b: any) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
      finalSeries.sort((a: any, b: any) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());

      if (finalMovies.length > 0 || finalSeries.length > 0) {
        setMovies(finalMovies);
        setSeries(finalSeries);
      } else {
        // If no real upcoming data, show recent releases instead
        const recentResponse = await fetch(`/api/search?query=popular&limit=40&t=${Date.now()}`);
        const recentData = await recentResponse.json();
        
        if (recentData.results && recentData.results.length > 0) {
          // Add mock release dates for demonstration and filter for English content
          const itemsWithDates = recentData.results.slice(0, 64).map((item: any, index: number) => ({
            ...item,
            releaseDate: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }))
          .filter((item: any) => isEnglishAmericanContent(item));
          
          const fallbackMovies = itemsWithDates.filter((item: any) => item.type === 'movie').slice(0, 20);
          const fallbackSeries = itemsWithDates.filter((item: any) => item.type === 'series').slice(0, 20);
          
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
              genre: 'Action',
              description: 'The merc with a mouth returns for another wild adventure in this highly anticipated sequel.',
              rating: 4.5,
              year: 2025
            },
            {
              id: '3',
              title: 'Avatar 3',
              type: 'movie' as const,
              releaseDate: '2025-07-12',
              image: '/api/placeholder/200/300',
              genre: 'Sci-Fi',
              description: 'The next chapter in the epic Avatar saga continues the story of the Na\'vi and their fight for survival.',
              rating: 4.8,
              year: 2025
            },
            {
              id: '5',
              title: 'Mission: Impossible 8',
              type: 'movie' as const,
              releaseDate: '2025-07-15',
              image: '/api/placeholder/200/300',
              genre: 'Action',
              description: 'Ethan Hunt faces his most dangerous mission yet in this thrilling conclusion.',
              rating: 4.4,
              year: 2025
            },
            {
              id: '7',
              title: 'Fantastic Four',
              type: 'movie' as const,
              releaseDate: '2025-07-18',
              image: '/api/placeholder/200/300',
              genre: 'Superhero',
              description: 'Marvel\'s first family returns to the big screen in this exciting reboot.',
              rating: 4.2,
              year: 2025
            },
            {
              id: '9',
              title: 'Jurassic World 4',
              type: 'movie' as const,
              releaseDate: '2025-07-20',
              image: '/api/placeholder/200/300',
              genre: 'Adventure',
              description: 'Dinosaurs return in this thrilling new chapter of the Jurassic franchise.',
              rating: 4.1,
              year: 2025
            }
          ];
          
          const sampleSeries = [
            {
              id: '2',
              title: 'The Bear S4',
              type: 'series' as const,
              releaseDate: '2025-07-08',
              image: '/api/placeholder/200/300',
              genre: 'Comedy',
              description: 'The critically acclaimed kitchen comedy returns with more chaos, heart, and incredible performances.',
              rating: 4.7,
              year: 2025
            },
            {
              id: '4',
              title: 'House of the Dragon S3',
              type: 'series' as const,
              releaseDate: '2025-07-09',
              image: '/api/placeholder/200/300',
              genre: 'Fantasy',
              description: 'The Targaryen civil war continues to rage in this epic fantasy drama series.',
              rating: 4.3,
              year: 2025
            },
            {
              id: '6',
              title: 'Stranger Things S5',
              type: 'series' as const,
              releaseDate: '2025-07-14',
              image: '/api/placeholder/200/300',
              genre: 'Horror',
              description: 'The final season of the beloved supernatural thriller series.',
              rating: 4.6,
              year: 2025
            },
            {
              id: '8',
              title: 'The Mandalorian S4',
              type: 'series' as const,
              releaseDate: '2025-07-16',
              image: '/api/placeholder/200/300',
              genre: 'Sci-Fi',
              description: 'Din Djarin continues his adventures in a galaxy far, far away.',
              rating: 4.4,
              year: 2025
            },
            {
              id: '10',
              title: 'Wednesday S2',
              type: 'series' as const,
              releaseDate: '2025-07-22',
              image: '/api/placeholder/200/300',
              genre: 'Horror',
              description: 'Wednesday Addams returns for more supernatural mysteries at Nevermore Academy.',
              rating: 4.2,
              year: 2025
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
          genre: 'Action',
          description: 'The merc with a mouth returns for another wild adventure in this highly anticipated sequel.',
          rating: 4.5,
          year: 2025
        }
      ];
      
      const errorSeries = [
        {
          id: '2',
          title: 'The Bear S4',
          type: 'series' as const,
          releaseDate: '2025-07-08',
          image: '/api/placeholder/200/300',
          genre: 'Comedy',
          description: 'The critically acclaimed kitchen comedy returns with more chaos, heart, and incredible performances.',
          rating: 4.7,
          year: 2025
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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Coming Soon
            </h2>
            <div className="h-px bg-gradient-to-r from-red-500/50 to-transparent flex-1 ml-2"></div>
          </div>
        </div>
        
        {/* Loading Skeletons */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-20 h-5 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-red-500/20 to-transparent flex-1"></div>
          </div>
          <div className="flex space-x-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex-shrink-0 animate-pulse w-20 sm:w-24 md:w-28">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-lg overflow-hidden w-full">
                  <div className="aspect-[2/3] w-full bg-gradient-to-br from-gray-700 to-gray-600"></div>
                  <div className="p-2 space-y-1 h-16 flex flex-col justify-between">
                    <div className="space-y-1 flex-grow">
                      <div className="h-2 bg-gray-600 rounded w-full"></div>
                      <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                    </div>
                    <div className="flex justify-between mt-auto">
                      <div className="h-2 bg-gray-600 rounded w-1/3"></div>
                      <div className="h-2 bg-gray-600 rounded w-1/4"></div>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-0.5 mt-1">
                      <div className="bg-gradient-to-r from-red-500/50 to-red-600/50 h-0.5 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-16 h-5 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-red-500/20 to-transparent flex-1"></div>
          </div>
          <div className="flex space-x-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex-shrink-0 animate-pulse w-20 sm:w-24 md:w-28">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-lg overflow-hidden w-full">
                  <div className="aspect-[2/3] w-full bg-gradient-to-br from-gray-700 to-gray-600"></div>
                  <div className="p-2 space-y-1 h-16 flex flex-col justify-between">
                    <div className="space-y-1 flex-grow">
                      <div className="h-2 bg-gray-600 rounded w-full"></div>
                      <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                    </div>
                    <div className="flex justify-between mt-auto">
                      <div className="h-2 bg-gray-600 rounded w-1/3"></div>
                      <div className="h-2 bg-gray-600 rounded w-1/4"></div>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-0.5 mt-1">
                      <div className="bg-gradient-to-r from-red-500/50 to-red-600/50 h-0.5 rounded-full w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold netflix-gradient-text">
              {title}
            </h3>
            <div className="h-px bg-gradient-to-r from-red-500/50 to-transparent flex-1 ml-2"></div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`group relative p-2 rounded-full transition-all duration-300 ${
                canScrollLeft
                  ? 'netflix-red-bg hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`group relative p-2 rounded-full transition-all duration-300 ${
                canScrollRight
                  ? 'netflix-red-bg hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-black/60 via-black/20 to-transparent z-10 pointer-events-none"></div>
          
          <div 
            ref={scrollContainerRef}
            className="flex space-x-3 sm:space-x-4 overflow-x-auto horizontal-scroll-smooth scrollbar-hide pb-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex-shrink-0 group cursor-pointer animate-fadeInUp w-20 sm:w-24 md:w-28 relative"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleItemClick(item)}
                title={`Click to see more details about ${item.title}`}
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-xl hover:shadow-red-500/10 group-hover:scale-105 h-auto w-full">
                  {/* Poster Section */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden">
                    {item.image && !item.image.includes('placeholder') ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/20 to-blue-900/20">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                      </div>
                    )}
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Type Badge */}
                    <div className="absolute top-1 right-1">
                      <span className={`px-1.5 py-0.5 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm ${
                        item.type === 'movie' 
                          ? 'bg-blue-500/80 text-blue-100 border border-blue-400/50' 
                          : 'bg-green-500/80 text-green-100 border border-green-400/50'
                      }`}>
                        {item.type === 'movie' ? '🎬' : '📺'}
                      </span>
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-red-500/90 backdrop-blur-sm rounded-full p-2 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Info Section */}
                  <div className="p-2 space-y-1 h-16 flex flex-col justify-between">
                    <h4 className="font-bold text-white text-xs leading-tight line-clamp-2 group-hover:text-red-400 transition-colors duration-200 flex-grow overflow-hidden">
                      {item.title}
                    </h4>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-gray-400 font-medium bg-white/5 px-1 py-0.5 rounded text-[10px] truncate max-w-[50%]">
                        {item.genre}
                      </span>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <svg className="w-2 h-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-red-300 font-bold text-[10px] whitespace-nowrap">
                          {formatReleaseDate(item.releaseDate)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar for "Coming Soon" */}
                    <div className="w-full bg-gray-700/50 rounded-full h-0.5 overflow-hidden mt-1">
                      <div 
                        className="shimmer h-0.5 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.min(85, 25 + (new Date().getTime() % 60000) / 1000)}%`
                        }}
                      ></div>
                    </div>
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
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold netflix-gradient-text">
            Coming Soon
          </h2>
          <div className="h-px bg-gradient-to-r from-red-500/50 to-transparent flex-1 ml-2"></div>
        </div>
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

      {/* Detail Modal */}
      {isModalOpen && selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
