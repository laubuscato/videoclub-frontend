import "./home.css";
import { movies } from "../data/movies";


function Home() {
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
                    <span className="account">
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
                    {movies.slice(0, 8).map((movie)=> (  //coge las primeras 8 del array
                        <div className="movie" key={movie.id}>
                            <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
                            <h3>{movie.title}</h3>
                            <p>{movie.year}</p>
                            <p>{movie.genres.join(", ")}</p>
                        </div>
                    ))}
                </div>

            </main>

        </div>
    );
}

export default Home;