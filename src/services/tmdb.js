const API_KEY = import.meta.env.VITE_API_KEY;

export const getPopularMovies = async () => {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES`
    );

    const data = await response.json();
    return data.results;
};

export const getMovieDetails = async (id) => {
    const API_KEY = import.meta.env.VITE_API_KEY;

    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=es-ES`
    );

    const data = await response.json();
    return data;
};

export const getMovieCredits = async (id) => {
    const API_KEY = import.meta.env.VITE_API_KEY;

    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
    );

    const data = await response.json();
    return data;
};


 //BUSCADOR 
export const searchMovies = async (query) => {
    const response = await fetch (
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.results;
};