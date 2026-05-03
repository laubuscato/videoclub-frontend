import "./home.css";
import { FiSearch, FiUser, FiShoppingCart, FiSliders, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { getMovies, getMe } from "../services/api";
import { movies as moviesData } from "../data/movies.js";

const genreTranslations = {
        "acción": ["action"],
        "comedia": ["comedy"],
        "drama": ["drama"],
        "terror": ["horror"],
        "ciencia ficción": ["sci-fi", "science fiction"],
        "aventura": ["adventure"],
        "animación": ["animation"],
        "romance": ["romance"],
        "thriller": ["thriller"],
        "crimen": ["crime"],
        "biografía": ["biography"],
        "historia": ["history"],
        "western": ["western"],
        "musical": ["music", "musical"],
        "misterio": ["mystery"]
    };

function Home() {

    const navigate = useNavigate();

    const [selectedMovie, setSelectedMovie] = useState(null);
    const [allMovies, setAllMovies] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [searchTerm, setSearchTerm] = useState("");
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [dias, setDias] = useState(1);

    const [year, setYear] = useState("");
    const [genre, setGenre] = useState("");
    const [director, setDirector] = useState("");
    const [actores, setActores] = useState("");
    const [duracion, setDuracion] = useState("");

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const posters = Object.fromEntries(
        moviesData.map(movie => [movie.title.toLowerCase(), movie.posterUrl])
    );

    const genres = [
        "Acción", "Comedia", "Drama", "Terror", "Ciencia ficción",
        "Aventura", "Animación", "Romance", "Thriller", "Crimen",
        "Biografía", "Historia", "Western", "Musical", "Misterio"
    ];



    const duraciones = [
        { label: "Menos de 90 min", value: "short" },
        { label: "90 - 120 min", value: "medium" },
        { label: "Más de 120 min", value: "long" }
    ];

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const data = await getMovies();
                setAllMovies(data);
            } catch (error) {
                console.log("ERROR CARGANDO PELÍCULAS:", error);
            }
        };

        const loadUser = async () => {
            try {
                const user = await getMe();
                setUserName(user.firstName);
                setUserId(user.id);
                setIsAdmin(user.role === "ADMIN");
                const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
                setCartCount(cart.length);
            } catch (error) {
                console.log("ERROR CARGANDO USUARIO:", error);
            }
        };

        loadMovies();
        loadUser();
    }, []);

    useEffect(() => {
        if (!userId) return;
        const updateCart = () => {
            const cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
            setCartCount(cart.length);
        };
        window.addEventListener("cartUpdated", updateCart);
        return () => window.removeEventListener("cartUpdated", updateCart);
    }, [userId]);

    const movies = useMemo(() => {
        let filtered = allMovies.map(movie => {
            const localData = moviesData.find(m => m.title.toLowerCase() === movie.movieTitle?.toLowerCase())
            return {
                ...movie,
                genero: movie.genero || localData?.genres?.join(", ") || "",
                director: movie.director || localData?.director || "",
                duracion: movie.duracion || localData?.runtime || null,
                actores: movie.actores || localData?.actors || "",
                desc: movie.desc || localData?.plot || "",
            }
        })

        if (searchTerm) {
            filtered = filtered.filter(m =>
                m.movieTitle.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (year) {
            filtered = filtered.filter(m => String(m.year) === year)
        }

        if (genre) {
            const genreLower = genre.toLowerCase()
            const translations = genreTranslations[genreLower] || []
            filtered = filtered.filter(m => {
                const generoLower = m.genero?.toLowerCase() || ""
                if (generoLower.includes(genreLower)) return true
                return translations.some(t => generoLower.includes(t))
            })
        }

        if (director) {
            filtered = filtered.filter(m =>
                m.director?.toLowerCase().includes(director.toLowerCase())
            )
        }

        if (actores) {
            filtered = filtered.filter(m =>
                m.actores?.toLowerCase().includes(actores.toLowerCase())
            )
        }

        if (duracion === "short") {
            filtered = filtered.filter(m => m.duracion && parseInt(m.duracion) < 90)
        } else if (duracion === "medium") {
            filtered = filtered.filter(m => m.duracion && parseInt(m.duracion) >= 90 && parseInt(m.duracion) <= 120)
        } else if (duracion === "long") {
            filtered = filtered.filter(m => m.duracion && parseInt(m.duracion) > 120)
        }

        return filtered
    }, [searchTerm, year, genre, director, actores, duracion, allMovies])

    const resetFilters = () => {
        setYear(""); setGenre(""); setDirector(""); setActores(""); setDuracion(""); setSearchTerm("")
    }

    const hasActiveFilters = year || genre || director || actores || duracion || searchTerm

    const addToCart = (movie) => {
        if (!userId) return;
        const cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        const yaEnCarrito = cart.find(m => m.id === movie.id);
        if (yaEnCarrito) {
            setToast({ show: true, message: "Esta película ya está en tu cesta", type: "error" });
        } else {
            const price = (dias * 2).toFixed(2);
            cart.push({ id: movie.id, title: movie.movieTitle, price, dias });
            localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
            setCartCount(cart.length);
            window.dispatchEvent(new Event("cartUpdated"));
            setToast({ show: true, message: "Película añadida a la cesta", type: "success" });
            setDias(1);
            setSelectedMovie(null);
        }
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2000);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUserName(""); setCartCount(0); setIsAdmin(false); setUserId(null); setShowUserMenu(false);
        navigate("/login");
    };

    return (
        <div className="home" onClick={() => setShowUserMenu(false)}>

            <aside className="sidebar">
                <div className="logo-wrapper">
                    <div className="logo">LUMI</div>
                    <div className="logo-sub">Videoclub</div>
                </div>
                <div className="sidebar-divider"></div>
                <div className="sidebar-section">
                    <div className="sidebar-section-title">
                        <FiSliders />
                        Filtros
                        {hasActiveFilters && (
                            <button className="reset-filters-btn" onClick={resetFilters}>
                                <FiX /> Limpiar
                            </button>
                        )}
                    </div>

                    <label className="filter-label">Género</label>
                    <select className="filter-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
                        <option value="">Todos</option>
                        {genres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>

                    <label className="filter-label">Año</label>
                    <select className="filter-select" value={year} onChange={(e) => setYear(e.target.value)}>
                        <option value="">Todos</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>

                    <label className="filter-label">Director</label>
                    <input className="filter-input" placeholder="Ej: Nolan" value={director} onChange={(e) => setDirector(e.target.value)} />

                    <label className="filter-label">Actores</label>
                    <input className="filter-input" placeholder="Ej: DiCaprio" value={actores} onChange={(e) => setActores(e.target.value)} />

                    <label className="filter-label">Duración</label>
                    <select className="filter-select" value={duracion} onChange={(e) => setDuracion(e.target.value)}>
                        <option value="">Todas</option>
                        {duraciones.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                </div>
            </aside>

            <header className="header">
                <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input className="search" placeholder="Buscar película..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="header-actions">
                    <div className="user-menu-wrapper" onClick={(e) => { e.stopPropagation(); setShowUserMenu(prev => !prev); }}>
                        <span className="user-trigger">
                            <FiUser />
                            {userName ? userName : "Mi cuenta"}
                        </span>
                        {showUserMenu && (
                            <div className="user-dropdown">
                                {userId ? (
                                    <>
                                        <div className="user-dropdown-item" onClick={() => { setShowUserMenu(false); navigate("/my-account"); }}>Mi cuenta</div>
                                        <div className="user-dropdown-item" onClick={() => { setShowUserMenu(false); navigate("/my-movies"); }}>Mis películas</div>
                                        {isAdmin && (
                                            <div className="user-dropdown-item" onClick={() => { setShowUserMenu(false); navigate("/admin"); }}>Panel Admin</div>
                                        )}
                                        <div className="user-dropdown-item logout" onClick={handleLogout}>Cerrar sesión</div>
                                    </>
                                ) : (
                                    <div className="user-dropdown-item" onClick={() => { setShowUserMenu(false); navigate("/login"); }}>Iniciar sesión</div>
                                )}
                            </div>
                        )}
                    </div>
                    <span className="cart" onClick={() => navigate("/cart")}>
                        <div className="cart-wrapper">
                            <FiShoppingCart className="cart-icon" />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </div>
                        <span className="cart-text">Mi cesta</span>
                    </span>
                </div>
            </header>

            <main className="content">
                <div className="section-header">
                    <h2 className="section-title">
                        {hasActiveFilters ? `Resultados (${movies.length})` : "LO MÁS VENDIDO"}
                    </h2>
                </div>

                {movies.length === 0 && <p className="no-results">No se encontraron películas con estos filtros.</p>}

                <div className="movies">
                    {movies.slice(0, hasActiveFilters ? movies.length : 9).map((movie) => (
                        <div key={movie.id} className="movie" onClick={() => { setSelectedMovie(movie); setDias(1); }}>
                            <img
                                src={posters[movie.movieTitle?.toLowerCase()] || movie.posterUrl || `https://via.placeholder.com/300x450/2a2a2a/f5a623?text=${encodeURIComponent(movie.movieTitle)}`}
                                alt={movie.movieTitle}
                            />
                            <div className="movie-overlay">
                                <h3>{movie.movieTitle}</h3>
                                <p>{movie.year}{movie.genero ? ` · ${movie.genero}` : ""}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedMovie && (
                    <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <span className="modal-close" onClick={() => setSelectedMovie(null)}>✕</span>
                            <div className="modal-banner-container">
                                <img
                                    src={posters[selectedMovie.movieTitle?.toLowerCase()] || selectedMovie.posterUrl || `https://via.placeholder.com/300x450/2a2a2a/f5a623?text=${encodeURIComponent(selectedMovie.movieTitle)}`}
                                    alt={selectedMovie.movieTitle}
                                />
                                <div className="modal-gradient"></div>
                                <h2 className="modal-title">{selectedMovie.movieTitle}</h2>
                            </div>
                            <div className="modal-info">
                                <p><strong>Año:</strong> {selectedMovie.year}</p>
                                {selectedMovie.director && <p><strong>Director:</strong> {selectedMovie.director}</p>}
                                {selectedMovie.genero && <p><strong>Género:</strong> {selectedMovie.genero}</p>}
                                {selectedMovie.actores && <p><strong>Actores:</strong> {selectedMovie.actores}</p>}
                                {selectedMovie.duracion && <p><strong>Duración:</strong> {selectedMovie.duracion} min</p>}
                                {selectedMovie.desc && <p><strong>Sinopsis:</strong> {selectedMovie.desc}</p>}
                                <div className="modal-dias">
                                    <label><strong>Días de alquiler:</strong></label>
                                    <div className="dias-selector">
                                        <button className="dias-btn" onClick={() => setDias(prev => Math.max(1, prev - 1))}>−</button>
                                        <span className="dias-count">{dias}</span>
                                        <button className="dias-btn" onClick={() => setDias(prev => Math.min(30, prev + 1))}>+</button>
                                    </div>
                                </div>
                                <p className="modal-price"><strong>Precio:</strong> {(dias * 2).toFixed(2)} €</p>
                                <button className="modal-add-button" onClick={() => addToCart(selectedMovie)}>Añadir a la cesta</button>
                            </div>
                        </div>
                    </div>
                )}

                {toast.show && <div className={`toast ${toast.type}`}>{toast.message}</div>}
            </main>
        </div>
    );
}

export default Home;