'use client';

import { useState, useEffect, useCallback } from 'react';
import { StarRating } from './StarRating';
import { DetailModal } from './DetailModal';
import { StreamingNavigation, streamingServices } from './StreamingNavigation';
import { GenreTabs } from './GenreTabs';
import { ComingThisWeek } from './ComingThisWeek';

interface StreamingItem {
  id: string;
  title: string;
  description: string;
  rating: number;
  genre: string;
  year: number;
  image: string;
  type: 'movie' | 'series';
  releaseDate?: string;
}

export default function StreamingDashboard() {
  const [items, setItems] = useState<StreamingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<StreamingItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'movie' | 'series'>('all');
  const [activeService, setActiveService] = useState('all');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentLimit, setCurrentLimit] = useState(40);
  const [activeGenre, setActiveGenre] = useState('0');
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(async (isAutoRefresh = false) => {
    if (!isAutoRefresh) {
      setLoading(true);
    }
    try {
      const selectedService = streamingServices.find(s => s.id === activeService);
      const providerParam = selectedService?.tmdbId ? `&provider=${selectedService.tmdbId}` : '';
      const genreParam = activeGenre !== '0' ? `&genre=${activeGenre}` : '';
      
      const response = await fetch(`/api/search?query=${searchTerm || 'popular'}${providerParam}${genreParam}&limit=${currentLimit}&t=${Date.now()}`);
      const data = await response.json();
      setItems(data.results || []);
      setHasMore(data.results?.length >= currentLimit);
      
      if (isAutoRefresh) {
        setLastRefreshTime(Date.now());
        console.log('Auto-refreshed content at:', new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to sample data if API fails
      const sampleData: StreamingItem[] = [
          {
            id: '1',
            title: 'The Matrix',
            description: 'A computer hacker learns about the true nature of reality.',
            rating: 4.5,
            genre: 'Sci-Fi',
            year: 1999,
            image: '/api/placeholder/300/400',
            type: 'movie',
            releaseDate: '1999-03-31'
          },
          {
            id: '2',
            title: 'Breaking Bad',
            description: 'A high school chemistry teacher turned methamphetamine manufacturer.',
            rating: 5.0,
            genre: 'Drama',
            year: 2008,
            image: '/api/placeholder/300/400',
            type: 'series',
            releaseDate: '2008-01-20'
          },
          {
            id: '3',
            title: 'Inception',
            description: 'A thief who enters people\'s dreams to steal secrets.',
            rating: 4.8,
            genre: 'Sci-Fi',
            year: 2010,
            image: '/api/placeholder/300/400',
            type: 'movie',
            releaseDate: '2010-07-16'
          },
          {
            id: '4',
            title: 'Stranger Things',
            description: 'A group of kids uncover supernatural mysteries in their small town.',
            rating: 4.3,
            genre: 'Horror',
            year: 2016,
            image: '/api/placeholder/300/400',
            type: 'series',
            releaseDate: '2016-07-15'
          }
        ];
        setItems(sampleData);
        setHasMore(false);
      } finally {
        if (!isAutoRefresh) {
          setLoading(false);
        }
      }
    }, [activeService, searchTerm, activeGenre, currentLimit]);

  // Auto-refresh effect - runs every hour (3600000ms)
  useEffect(() => {
    const autoRefreshInterval = setInterval(() => {
      fetchData(true);
    }, 3600000); // 1 hour in milliseconds

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(autoRefreshInterval);
  }, [fetchData]);

  // Initial data fetch and when dependencies change
  useEffect(() => {
    // Reset limit when service or search changes
    setCurrentLimit(40);
    setActiveGenre('0'); // Reset genre when switching services
    fetchData();
    setLastRefreshTime(Date.now()); // Update timestamp on manual refresh
  }, [activeService, searchTerm]);

  // Fetch data when genre changes
  useEffect(() => {
    if (activeGenre !== '0' || activeService !== 'all') {
      fetchData();
    }
  }, [activeGenre, fetchData]);

  // Fetch more data when limit increases
  useEffect(() => {
    if (currentLimit > 40) {
      fetchData();
    }
  }, [currentLimit, fetchData]);

  const loadMore = () => {
    setCurrentLimit(prev => prev + 40);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black bg-pattern text-white custom-scrollbar">
      {/* Header */}
      <header className="glass-morphism p-3 md:p-4 shadow-2xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Top row with logo and search */}
          <div className="flex items-center justify-between mb-3 md:mb-0">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl md:text-3xl font-bold gradient-text neon-glow animate-float">
                TVSHIZ
              </h1>
              <div className="hidden md:block text-xs text-gray-300 glass-morphism px-2 py-1 rounded-full">
                <span className="text-green-400">●</span> Last updated: {new Date(lastRefreshTime).toLocaleTimeString()}
              </div>
            </div>
            <div className="md:hidden">
              <button 
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Search and filter row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-end space-y-2 md:space-y-0 md:space-x-4">
            <button
              onClick={() => fetchData()}
              className="hidden md:flex items-center space-x-2 px-4 py-2 btn-primary rounded-lg text-white text-sm font-medium"
              title="Refresh content"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search shows and movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 px-4 py-2 glass-morphism rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm transition-all duration-200"
              />
              <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'movie' | 'series')}
              className="w-full md:w-auto px-4 py-2 glass-morphism rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm transition-all duration-200"
            >
              <option value="all">All Types</option>
              <option value="movie">Movies</option>
              <option value="series">TV Series</option>
            </select>
          </div>
        </div>
      </header>

      {/* Coming This Week Banner */}
      <ComingThisWeek />

      {/* Streaming Service Navigation */}
      <StreamingNavigation 
        activeService={activeService}
        onServiceChange={setActiveService}
      />

      {/* Genre Tabs (only shown when a specific service is selected) */}
      <GenreTabs 
        activeGenre={activeGenre}
        onGenreChange={setActiveGenre}
        activeService={activeService}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-3 md:p-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg animate-pulse">Loading amazing content...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="card-hover-effect glass-morphism rounded-xl overflow-hidden shadow-2xl cursor-pointer animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden relative">
                    {item.image && !item.image.includes('placeholder') ? (
                      <>
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full animate-shimmer">
                        <svg className="w-12 h-12 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9zM6 7v12h12V7H6z"/>
                        </svg>
                        <span className="text-gray-500 text-xs font-medium">No Image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold shadow-lg">
                        {item.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="text-sm md:text-base font-bold mb-2 line-clamp-2 text-white hover:text-red-400 transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm mb-2 font-medium">
                      {item.genre} • {item.year}
                    </p>
                    <p className="text-gray-300 text-xs md:text-sm mb-3 line-clamp-2 hidden md:block leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="scale-75 md:scale-100 origin-left">
                        <StarRating rating={item.rating} size="sm" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="animate-float mb-4">
                  <svg className="w-16 h-16 text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-xl mb-2">No content found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or filter settings</p>
              </div>
            )}

            {/* Load More Button */}
            {hasMore && filteredItems.length > 0 && (
              <div className="text-center mt-8 md:mt-12">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 md:px-12 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base shadow-2xl transition-all duration-300 w-full md:w-auto"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Load More</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal */}
      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}