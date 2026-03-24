import "./home.css";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPopularMovies, getMovieDetails, getMovieCredits } from "../services/tmdb";

function Home() {

    const navigate = useNavigate();
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movies, setMovies] = useState([]);
    const [movieDetails, setMovieDetails] = useState(null);

    useEffect(() => {
        getPopularMovies().then(setMovies);
    }, []);

    return (
        <div className="home">

            <aside className="sidebar">

                <div className="logo">LUMI</div>

                <div className="menu-item">Home</div>

                <div className="menu-item">Géneros</div>

                <ul className="genres">
                    <li>Fantástico</li>
                    <li>Terror</li>
                    <li>Suspense</li>
                    <li>Drama</li>
                    <li>Comedia</li>
                    <li>Acción</li>
                    <li>Aventuras</li>
                    <li>Western</li>
                    <li>Bélico</li>
                    <li>Histórico</li>
                    <li>Anime</li>
                    <li>Musicales</li>
                    <li>Documentales</li>
                    <li>Cine infantil</li>
                </ul>

            </aside>

            <header className="header">

                <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input className="search" placeholder="Search" />
                </div>

                <div className="header-actions">

                    <span 
                        className="account" 
                        onClick={() => navigate("/login")}
                    >
                        <FiUser className="account-icon" />
                        Mi cuenta
                    </span>

                    <span 
                        className="cart"
                        onClick={() => navigate("/cart")}
                        style={{ cursor: "pointer" }}
                    >
                        <FiShoppingCart className="cart-icon" />
                        Mi cesta
                    </span>

                </div>

            </header>

            <main className="content">

                <h2 className="section-title">LO MÁS VENDIDO</h2>

                <div className="movies">

                    {movies.slice(0, 8).map((movie) => (

                        <div 
                            key={movie.id}
                            className="movie"
                            onClick={async () => {

                                setSelectedMovie(movie);
                                setMovieDetails(null);

                                const details = await getMovieDetails(movie.id);
                                const credits = await getMovieCredits(movie.id);

                                const director = credits.crew.find(p => p.job === "Director");
                                const actors = credits.cast.slice(0, 4);

                                setMovieDetails({
                                    ...details,
                                    director: director?.name,
                                    actors: actors.map(a => a.name).join(", ")
                                });
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="movie-poster"
                            />
                            <h3>{movie.title}</h3>
                            <p>{movie.release_date?.split("-")[0]}</p>
                        </div>

                    ))}

                </div>

                {selectedMovie && (
                    <div 
                        className="modal-overlay"
                        onClick={() => setSelectedMovie(null)}
                    >

                        <div 
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <span 
                                className="modal-close"
                                onClick={() => setSelectedMovie(null)}
                            >
                                ✕
                            </span>

                            <div className="modal-banner-container">

                                <img 
                                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} 
                                    alt={selectedMovie.title}
                                    className="modal-banner"
                                />

                                <div className="modal-gradient"></div>

                                <h2 className="modal-title">
                                    {selectedMovie.title}
                                </h2>

                            </div>

                            <div className="modal-info">

                                {!movieDetails ? (
                                    <p>Cargando...</p>
                                ) : (
                                    <>
                                        <p><strong>Año:</strong> {movieDetails.release_date?.split("-")[0]}</p>
                                        <p><strong>Duración:</strong> {movieDetails.runtime} min</p>
                                        <p><strong>Géneros:</strong> {movieDetails.genres?.map(g => g.name).join(", ")}</p>
                                        <p><strong>Director:</strong> {movieDetails.director}</p>
                                        <p><strong>Actores:</strong> {movieDetails.actors}</p>
                                        <p><strong>Sinopsis:</strong> {movieDetails.overview}</p>

                                        <button className="modal-add-button">
                                            Añadir a la cesta
                                        </button>
                                    </>
                                )}

                            </div>

                        </div>

                    </div>
                )}

            </main>

        </div>
    );
}

export default Home;