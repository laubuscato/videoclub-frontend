import "./home.css";
import { movies } from "../data/movies";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {

    const navigate = useNavigate();
    const [selectedMovie, setSelectedMovie] = useState(null);

    return (
        <div className="home">

            <aside className="sidebar">

                <div className="logo">VIDEOCLUB</div>

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

                    <input
                        className="search"
                        placeholder="Search"
                    />
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

                    {movies
                        .filter((movie) => movie.year === "2012")
                        .slice(0, 8)
                        .map((movie) => (

                        <div 
                            key={movie.id}
                            className="movie"
                            onClick={() => setSelectedMovie(movie)}
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="movie-poster"
                            />
                            <h3>{movie.title}</h3>
                            <p>{movie.year}</p>
                            <p>{movie.genres.join(", ")}</p>
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
                                    src={selectedMovie.posterUrl} 
                                    alt={selectedMovie.title}
                                    className="modal-banner"
                                />

                                <div className="modal-gradient"></div>

                                <h2 className="modal-title">
                                    {selectedMovie.title}
                                </h2>

                            </div>

                            <div className="modal-info">

                                <p><strong>Año:</strong> {selectedMovie.year}</p>
                                <p><strong>Duración:</strong> {selectedMovie.runtime} min</p>
                                <p><strong>Géneros:</strong> {selectedMovie.genres.join(", ")}</p>
                                <p><strong>Director:</strong> {selectedMovie.director}</p>
                                <p><strong>Actores:</strong> {selectedMovie.actors}</p>
                                <p><strong>Sinopsis:</strong> {selectedMovie.plot}</p>

                                <button className="modal-add-button">
                                    Añadir a la cesta
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            </main>

        </div>
    );
}

export default Home;