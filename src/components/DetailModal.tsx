'use client';

import { StarRating } from './StarRating';
import { useEffect } from 'react';

interface StreamingItem {
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

interface DetailModalProps {
  item: StreamingItem;
  onClose: () => void;
}

export function DetailModal({ item, onClose }: DetailModalProps) {
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Check if this is an upcoming release
  const isUpcoming = item.releaseDate && new Date(item.releaseDate) > new Date();
  
  // Format release date for upcoming content
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
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 30) {
        return `In ${diffDays} days`;
      } else {
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-6 modal-backdrop"
      onClick={handleOverlayClick}
    >
      <div className="glass-morphism rounded-2xl max-w-4xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto shadow-2xl modal-content">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 md:top-4 right-3 md:right-4 text-gray-400 hover:text-white z-10 glass-morphism rounded-full p-2 hover:bg-red-500/20 transition-all duration-200"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header with image */}
          <div className="aspect-[16/9] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden rounded-t-2xl relative">
            {item.image && !item.image.includes('placeholder') ? (
              <>
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full animate-shimmer">
                <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9zM6 7v12h12V7H6z"/>
                </svg>
                <span className="text-gray-400 text-lg font-medium">Image Placeholder</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-4 md:mb-6">
              <h2 className="text-2xl md:text-3xl font-bold pr-4 gradient-text">{item.title}</h2>
              <div className="flex flex-col items-end space-y-2">
                <span className="text-xs md:text-sm bg-red-500 text-white px-3 py-1.5 rounded-full font-bold shadow-lg whitespace-nowrap">
                  {item.type.toUpperCase()}
                </span>
                {isUpcoming && (
                  <span className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-full font-bold shadow-lg whitespace-nowrap coming-soon-badge">
                    COMING SOON
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-6 md:mb-8">
              {item.rating > 0 && (
                <>
                  <div className="flex items-center space-x-2">
                    <StarRating rating={item.rating} size="md" />
                    <span className="text-sm md:text-base text-gray-300 font-medium">{item.rating}/5</span>
                  </div>
                  <span className="text-gray-500">•</span>
                </>
              )}
              <span className="text-gray-300 text-sm md:text-base font-medium px-3 py-1 glass-morphism rounded-full">{item.genre}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-300 text-sm md:text-base font-medium px-3 py-1 glass-morphism rounded-full">{item.year}</span>
              {item.releaseDate && (
                <>
                  <span className="text-gray-500">•</span>
                  <div className="flex items-center space-x-2 px-3 py-1 glass-morphism rounded-full">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-400 text-xs md:text-sm font-medium">
                      {isUpcoming ? 'Releases:' : 'Released:'}
                    </span>
                    <span className="text-gray-300 text-sm md:text-base font-medium">
                      {isUpcoming ? formatReleaseDate(item.releaseDate) : new Date(item.releaseDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </>
              )}
            </div>

            <p className="text-gray-300 mb-6 md:mb-8 leading-relaxed text-base md:text-lg">{item.description}</p>

            {/* Action buttons */}
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
              {isUpcoming ? (
                <>
                  <button className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 px-6 md:px-8 rounded-xl font-bold text-base md:text-lg flex items-center justify-center space-x-3 shadow-2xl transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.829 2.829L5.657 12l2.829 2.829L4.828 17H1l4-5-4-5h3.828zM21 12l-4-4v3h-7v2h7v3l4-4z" />
                    </svg>
                    <span>Set Reminder</span>
                  </button>
                  <button className="flex-1 glass-morphism hover:bg-white/10 text-white py-4 px-6 md:px-8 rounded-xl font-bold text-base md:text-lg transition-all duration-300 flex items-center justify-center space-x-3 border border-white/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Add to Wishlist</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="flex-1 btn-primary text-white py-4 px-6 md:px-8 rounded-xl font-bold text-base md:text-lg flex items-center justify-center space-x-3 shadow-2xl">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span>Watch Now</span>
                  </button>
                  <button className="flex-1 glass-morphism hover:bg-white/10 text-white py-4 px-6 md:px-8 rounded-xl font-bold text-base md:text-lg transition-all duration-300 flex items-center justify-center space-x-3 border border-white/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add to List</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
