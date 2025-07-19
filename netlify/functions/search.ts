import { Handler } from '@netlify/functions';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

interface StreamingItem {
  id: string;
  title: string;
  description: string;
  rating: number;
  genre: string;
  year: number | string;
  image: string;
  type: 'movie' | 'series';
  releaseDate: string;
}

export const handler: Handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const queryParams = new URLSearchParams(event.queryStringParameters || {});
    const query = queryParams.get('query') || 'popular';
    const type = queryParams.get('type') || 'all';
    const provider = queryParams.get('provider') || 'all';
    const genre = queryParams.get('genre') || '0';
    const page = parseInt(queryParams.get('page') || '1');
    const limit = parseInt(queryParams.get('limit') || '40');
    
    let results: StreamingItem[] = [];
    
    if (type === 'all' || type === 'movie') {
      const moviePromises = [];
      const maxPages = Math.min(page + 1, 5);
      
      for (let currentPage = page; currentPage <= maxPages; currentPage++) {
        let movieUrl = '';
        if (query === 'popular') {
          if (provider === 'all') {
            movieUrl = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${currentPage}`;
          } else if (provider === '-1') {
            movieUrl = `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&page=${currentPage}`;
          } else {
            let discoverUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_watch_providers=${provider}&watch_region=US&sort_by=release_date.desc&page=${currentPage}&with_original_language=en&region=US`;
            if (genre !== '0') {
              discoverUrl += `&with_genres=${genre}`;
            }
            movieUrl = discoverUrl;
          }
        } else if (query === 'upcoming') {
          const today = new Date().toISOString().split('T')[0];
          const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          movieUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&primary_release_date.gte=${today}&primary_release_date.lte=${nextMonth}&sort_by=primary_release_date.asc&page=${currentPage}&with_original_language=en&region=US`;
        } else {
          movieUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${currentPage}`;
        }
        
        moviePromises.push(fetch(movieUrl).then(res => res.json()));
      }
      
      const movieResponses = await Promise.all(moviePromises);
      const allMovies = movieResponses.flatMap(movieData => 
        movieData.results?.map((item: any) => ({
          id: item.id.toString(),
          title: item.title,
          description: item.overview,
          rating: item.vote_average / 2,
          genre: item.genre_ids?.[0] ? getGenreName(item.genre_ids[0]) : 'Unknown',
          year: item.release_date ? new Date(item.release_date).getFullYear() : 'Unknown',
          image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/api/placeholder/300/400',
          type: 'movie' as const,
          releaseDate: item.release_date || '1900-01-01'
        })) || []
      );
      
      results = [...results, ...allMovies];
    }
    
    if (type === 'all' || type === 'series' || type === 'tv') {
      const tvPromises = [];
      const maxPages = Math.min(page + 1, 5);
      
      for (let currentPage = page; currentPage <= maxPages; currentPage++) {
        let tvUrl = '';
        if (query === 'popular') {
          if (provider === 'all') {
            tvUrl = `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${currentPage}`;
          } else if (provider === '-1') {
            tvUrl = `${TMDB_BASE_URL}/tv/airing_today?api_key=${TMDB_API_KEY}&page=${currentPage}`;
          } else {
            let discoverUrl = `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_watch_providers=${provider}&watch_region=US&sort_by=first_air_date.desc&page=${currentPage}&with_original_language=en&region=US`;
            if (genre !== '0') {
              discoverUrl += `&with_genres=${genre}`;
            }
            tvUrl = discoverUrl;
          }
        } else if (query === 'upcoming') {
          const today = new Date().toISOString().split('T')[0];
          const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          tvUrl = `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&first_air_date.gte=${today}&first_air_date.lte=${nextMonth}&sort_by=first_air_date.asc&page=${currentPage}&with_original_language=en&region=US`;
        } else {
          tvUrl = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${currentPage}`;
        }
        
        tvPromises.push(fetch(tvUrl).then(res => res.json()));
      }
      
      const tvResponses = await Promise.all(tvPromises);
      const allTvShows = tvResponses.flatMap(tvData => 
        tvData.results?.map((item: any) => ({
          id: item.id.toString(),
          title: item.name,
          description: item.overview,
          rating: item.vote_average / 2,
          genre: item.genre_ids?.[0] ? getGenreName(item.genre_ids[0]) : 'Unknown',
          year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : 'Unknown',
          image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/api/placeholder/300/400',
          type: 'series' as const,
          releaseDate: item.first_air_date || '1900-01-01'
        })) || []
      );
      
      results = [...results, ...allTvShows];
    }
    
    const uniqueResults = results.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    );
    
    if (query === 'popular') {
      uniqueResults.sort((a, b) => {
        const dateA = new Date(a.releaseDate);
        const dateB = new Date(b.releaseDate);
        return dateB.getTime() - dateA.getTime();
      });
    }
    
    const finalResults = uniqueResults.slice(0, limit);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        results: finalResults,
        totalResults: uniqueResults.length,
        page: page,
        limit: limit
      }),
    };
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
};

function getGenreName(genreId: number): string {
  const genreMap: { [key: number]: string } = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
    10759: 'Action & Adventure',
    10762: 'Kids',
    10763: 'News',
    10764: 'Reality',
    10765: 'Sci-Fi & Fantasy',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'War & Politics'
  };
  
  return genreMap[genreId] || 'Unknown';
}
