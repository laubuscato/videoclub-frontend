import "./home.css";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMovies, getMe } from "../services/api";
import { movies as moviesData } from "../data/movies.js";

function Home() {

    const navigate = useNavigate();

    // estado de la película seleccionada para el modal
    const [selectedMovie, setSelectedMovie] = useState(null);

    // lista de películas cargadas desde el backend
    const [movies, setMovies] = useState([]);

    // número de items en el carrito para el badge
    const [cartCount, setCartCount] = useState(0);

    // toast de notificación
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // término de búsqueda
    const [searchTerm, setSearchTerm] = useState("");

    // filtros de año y género
    const [year, setYear] = useState("");
    const [genre, setGenre] = useState("");

    // datos del usuario logueado
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // visibilidad del dropdown de usuario
    const [showUserMenu, setShowUserMenu] = useState(false);

    // días seleccionados en el modal
    const [dias, setDias] = useState(1);

    // mapa de título en minúsculas → url del poster
    const posters = Object.fromEntries(
        moviesData.map(movie => [movie.title.toLowerCase(), movie.posterUrl])
    );

    // lista de años para el filtro (últimos 40)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

    // géneros disponibles para el filtro
    const genres = [
        { id: 28, name: "Acción" },
        { id: 35, name: "Comedia" },
        { id: 18, name: "Drama" },
        { id: 27, name: "Terror" },
        { id: 878, name: "Ciencia ficción" },
        { id: 12, name: "Aventura" },
        { id: 16, name: "Animación" },
        { id: 10749, name: "Romance" }
    ];

    // carga películas y datos del usuario al montar
    useEffect(() => {
        const loadMovies = async () => {
            try {
                const data = await getMovies();
                setMovies(data);
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
                // carga el carrito del usuario desde localStorage
                const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
                setCartCount(cart.length);
            } catch (error) {
                console.log("ERROR CARGANDO USUARIO:", error);
            }
        };

        loadMovies();
        loadUser();
    }, []);

    // escucha el evento cartUpdated para actualizar el badge
    useEffect(() => {
        if (!userId) return;
        const updateCart = () => {
            const cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
            setCartCount(cart.length);
        };

        window.addEventListener("cartUpdated", updateCart);
        return () => window.removeEventListener("cartUpdated", updateCart);
    }, [userId]);

    // filtra películas por término de búsqueda
    useEffect(() => {
        const loadFiltered = async () => {
            try {
                const data = await getMovies();
                const filtered = data.filter(movie =>
                    movie.movieTitle.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setMovies(filtered);
            } catch (error) {
                console.log("ERROR BUSCADOR:", error);
            }
        };
        loadFiltered();
    }, [searchTerm]);

    // añade una película al carrito si no está ya
    const addToCart = (movie) => {
        if (!userId) return;
        const cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        const yaEnCarrito = cart.find(m => m.id === movie.id);

        if (yaEnCarrito) {
            setToast({ show: true, message: "Esta película ya está en tu cesta", type: "error" });
        } else {
            // precio = días × 2€
            const price = (dias * 2).toFixed(2)
            cart.push({ id: movie.id, title: movie.movieTitle, price, dias });
            localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
            setCartCount(cart.length);
            window.dispatchEvent(new Event("cartUpdated"));
            setToast({ show: true, message: "Película añadida a la cesta", type: "success" });
            setDias(1);
            setSelectedMovie(null);
        }

        setTimeout(() => {
            setToast({ show: false, message: "", type: "success" });
        }, 2000);
    };

    // cierra sesión y limpia el estado
    const handleLogout = () => {
        localStorage.removeItem("token");
        setUserName("");
        setCartCount(0);
        setIsAdmin(false);
        setUserId(null);
        setShowUserMenu(false);
        navigate("/login");
    };

    return (
        // cierra el dropdown al hacer click fuera
        <div className="home" onClick={() => setShowUserMenu(false)}>

            {/* sidebar con logo, menú y filtros */}
            <aside className="sidebar">
                <div className="logo">LUMI</div>
                <div className="menu-item">Home</div>
                <div className="menu-item">Filtrar</div>

                <div className="filters">

                    {/* filtro por género */}
                    <label className="filter-label">Género</label>
                    <select
                        className="filter-select"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                    >
                        <option value="">Todos</option>
                        {genres.map(g => (
                            <option key={g.id} value={g.id}>
                                {g.name}
                            </option>
                        ))}
                    </select>

                    {/* filtro por año */}
                    <label className="filter-label">Año</label>
                    <select
                        className="filter-select"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    >
                        <option value="">Todos</option>
                        {years.map(y => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>

                </div>
            </aside>

            {/* header con buscador y acciones */}
            <header className="header">

                <div className="search-container">
                    <FiSearch className="search-icon" />
                    <input
                        className="search"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="header-actions">

                    {/* menú desplegable del usuario */}
                    <div
                        className="user-menu-wrapper"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowUserMenu(prev => !prev);
                        }}
                    >
                        <span className="user-trigger">
                            <FiUser />
                            {userName ? userName : "Mi cuenta"}
                        </span>

                        {showUserMenu && (
                            <div className="user-dropdown">
                                <div
                                    className="user-dropdown-item"
                                    onClick={() => {
                                        setShowUserMenu(false);
                                        navigate("/login");
                                    }}
                                >
                                    Mi cuenta
                                </div>
                                <div
                                    className="user-dropdown-item"
                                    onClick={() => {
                                        setShowUserMenu(false);
                                        navigate("/my-movies");
                                    }}
                                >
                                    Mis películas
                                </div>
                                {/* solo visible si el usuario es admin */}
                                {isAdmin && (
                                    <div
                                        className="user-dropdown-item"
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            navigate("/admin");
                                        }}
                                    >
                                        Panel Admin
                                    </div>
                                )}
                                <div
                                    className="user-dropdown-item logout"
                                    onClick={handleLogout}
                                >
                                    Cerrar sesión
                                </div>
                            </div>
                        )}
                    </div>

                    {/* icono del carrito con badge */}
                    <span className="cart" onClick={() => navigate("/cart")}>
                        <div className="cart-wrapper">
                            <FiShoppingCart className="cart-icon" />
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </div>
                        <span className="cart-text">Mi cesta</span>
                    </span>

                </div>
            </header>

            <main className="content">

                <h2 className="section-title">LO MÁS VENDIDO</h2>

                {/* grid de películas filtradas y limitadas a 9 */}
                <div className="movies">
                    {movies
                        .filter(movie => {
                            if (year && String(movie.year) !== year) return false;
                            return true;
                        })
                        .slice(0, 9)
                        .map((movie) => {
                            const poster = posters[movie.movieTitle?.toLowerCase()];
                            return (
                                <div
                                    key={movie.id}
                                    className="movie"
                                    onClick={() => {
                                        setSelectedMovie(movie)
                                        setDias(1)
                                    }}
                                >
                                    <img
                                        src={poster || "https://via.placeholder.com/300x450?text=No+Image"}
                                        alt={movie.movieTitle}
                                    />
                                    {/* overlay con título y año */}
                                    <div className="movie-overlay">
                                        <h3>{movie.movieTitle}</h3>
                                        <p>{movie.year}</p>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* modal de detalle de película */}
                {selectedMovie && (
                    // click fuera cierra el modal
                    <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                            {/* botón cerrar */}
                            <span className="modal-close" onClick={() => setSelectedMovie(null)}>
                                ✕
                            </span>

                            {/* imagen con degradado y título */}
                            <div className="modal-banner-container">
                                <img
                                    src={posters[selectedMovie.movieTitle?.toLowerCase()]}
                                    alt={selectedMovie.movieTitle}
                                />
                                <div className="modal-gradient"></div>
                                <h2 className="modal-title">{selectedMovie.movieTitle}</h2>
                            </div>

                            {/* info: año, días, precio y botón añadir */}
                            <div className="modal-info">
                                <p><strong>Año:</strong> {selectedMovie.year}</p>

                                {/* selector de días de alquiler */}
                                <div className="modal-dias">
                                    <label><strong>Días de alquiler:</strong></label>
                                    <div className="dias-selector">
                                        <button
                                            className="dias-btn"
                                            onClick={() => setDias(prev => Math.max(1, prev - 1))}
                                        >
                                            −
                                        </button>
                                        <span className="dias-count">{dias}</span>
                                        <button
                                            className="dias-btn"
                                            onClick={() => setDias(prev => Math.min(30, prev + 1))}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* precio calculado: días × 2€ */}
                                <p className="modal-price">
                                    <strong>Precio:</strong> {(dias * 2).toFixed(2)} €
                                </p>

                                <button
                                    className="modal-add-button"
                                    onClick={() => addToCart(selectedMovie)}
                                >
                                    Añadir a la cesta
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                {/* toast de notificación */}
                {toast.show && (
                    <div className={`toast ${toast.type}`}>
                        {toast.message}
                    </div>
                )}

            </main>

        </div>
    );
}

export default Home;