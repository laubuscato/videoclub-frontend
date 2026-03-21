import "./home.css";
import { movies } from "../data/movies";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

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

                    <span className="account" onClick={() => navigate("/login")}>
                        <FiUser className="account-icon" />
                        Mi cuenta
                    </span>

                    <span className="cart">
                        <FiShoppingCart className="cart-icon" />
                        Mi cesta
                    </span>

                </div>

            </header>

            <main className="content">

                <h2 className="section-title">LO MÁS VENDIDO</h2>

                <div className="movies">
                    {/**  {movies.slice(0, 8).map((movie) => (   */}   {/**Muestra las primeras 8 peliculas */}

                    {movies.filter((movie) => movie.year === "2012") 
                    .slice(0, 8)
                    .map((movie) =>(
                    
                        <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-link">
                            <div className="movie">
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="movie-poster"
                                />
                                <h3>{movie.title}</h3>
                                <p>{movie.year}</p>
                                <p>{movie.genres.join(", ")}</p>
                            </div>
                        </Link>
                    ))}
                </div>

            </main>

        </div>
    );
}

export default Home;