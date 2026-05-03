import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { FiArrowLeft, FiTrash2, FiEdit, FiPlus, FiUser, FiFilm, FiSearch, FiClock } from "react-icons/fi"
import { getUsers, getUserDetail, getUserRentals, deleteUser, getMovies, createMovie, updateMovie, deleteMovie } from "../services/api"
import "./admin.css"

function Admin() {

    const navigate = useNavigate()

    // pestaña activa: "usuarios" o "peliculas"
    const [tab, setTab] = useState("usuarios")

    // estado de usuarios
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [userRentals, setUserRentals] = useState([])
    const [loadingRentals, setLoadingRentals] = useState(false)
    const [userSearch, setUserSearch] = useState("")

    // estado de películas
    const [movies, setMovies] = useState([])
    const [movieForm, setMovieForm] = useState({ movieTitle: "", desc: "", year: "", director: "", genero: "", actores: "", duracion: "", posterUrl: "" })
    const [editingMovie, setEditingMovie] = useState(null)
    const [showMovieForm, setShowMovieForm] = useState(false)
    const [movieSearch, setMovieSearch] = useState("")

    // estado general
    const [toast, setToast] = useState({ show: false, message: "", type: "success" })
    const [loading, setLoading] = useState(true)

    // carga usuarios y películas en paralelo al montar el componente
    useEffect(() => {
        loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const [usersData, moviesData] = await Promise.all([getUsers(), getMovies()])
            setUsers(usersData)
            setMovies(moviesData)
        } catch (error) {
            showToast(error.message || "Error al cargar datos", "error")
        } finally {
            setLoading(false)
        }
    }

    // muestra un toast de notificación y lo oculta tras 2.5s
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type })
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2500)
    }

    // elimina un usuario tras confirmación del administrador
    const handleDeleteUser = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return
        try {
            await deleteUser(id)
            // actualiza la lista local sin recargar desde el backend
            setUsers(prev => prev.filter(u => u.id !== id))
            setSelectedUser(null)
            setUserRentals([])
            showToast("Usuario eliminado correctamente")
        } catch (error) {
            showToast(error.message || "Error al eliminar usuario", "error")
        }
    }

    // carga el detalle y el historial de alquileres de un usuario al hacer click
    const handleSelectUser = async (id) => {
        try {
            const detail = await getUserDetail(id)
            setSelectedUser(detail)
            setLoadingRentals(true)
            setUserRentals([])
            try {
                const rentals = await getUserRentals(id)
                setUserRentals(rentals)
            } catch {
                // si el endpoint no existe aún, no mostramos error
                setUserRentals([])
            } finally {
                setLoadingRentals(false)
            }
        } catch (error) {
            showToast(error.message || "Error al obtener usuario", "error")
        }
    }

    // crea una nueva película con los datos del formulario
    const handleCreateMovie = async () => {
        try {
            await createMovie({
                movieTitle: movieForm.movieTitle,
                desc: movieForm.desc,
                year: parseInt(movieForm.year),
                director: movieForm.director,
                genero: movieForm.genero,
                actores: movieForm.actores,
                duracion: movieForm.duracion ? parseInt(movieForm.duracion) : undefined,
                posterUrl: movieForm.posterUrl
            })
            showToast("Película creada correctamente")
            resetMovieForm()
            setMovies(await getMovies())
        } catch (error) {
            showToast(error.message || "Error al crear película", "error")
        }
    }

    // actualiza los datos de una película existente
    const handleUpdateMovie = async () => {
        try {
            await updateMovie({
                id: editingMovie.id,
                movieTitle: movieForm.movieTitle,
                desc: movieForm.desc,
                year: parseInt(movieForm.year),
                director: movieForm.director,
                genero: movieForm.genero,
                actores: movieForm.actores,
                duracion: movieForm.duracion ? parseInt(movieForm.duracion) : undefined,
                posterUrl: movieForm.posterUrl
            })
            showToast("Película actualizada correctamente")
            resetMovieForm()
            setMovies(await getMovies())
        } catch (error) {
            showToast(error.message || "Error al actualizar película", "error")
        }
    }

    // elimina una película del catálogo tras confirmación
    const handleDeleteMovie = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta película?")) return
        try {
            await deleteMovie(id)
            setMovies(prev => prev.filter(m => m.id !== id))
            showToast("Película eliminada correctamente")
        } catch (error) {
            showToast(error.message || "Error al eliminar película", "error")
        }
    }

    // abre el formulario en modo edición con los datos de la película seleccionada
    const openEditMovie = (movie) => {
        setEditingMovie(movie)
        setMovieForm({
            movieTitle: movie.movieTitle || "",
            desc: movie.desc || "",
            year: movie.year || "",
            director: movie.director || "",
            genero: movie.genero || "",
            actores: movie.actores || "",
            duracion: movie.duracion || "",
            posterUrl: movie.posterUrl || ""
        })
        setShowMovieForm(true)
    }

    // abre el formulario en modo creación con campos vacíos
    const openCreateMovie = () => {
        setEditingMovie(null)
        resetMovieForm()
        setShowMovieForm(true)
    }

    // resetea y cierra el formulario de película
    const resetMovieForm = () => {
        setMovieForm({ movieTitle: "", desc: "", year: "", director: "", genero: "", actores: "", duracion: "", posterUrl: "" })
        setShowMovieForm(false)
        setEditingMovie(null)
    }

    // filtra usuarios por nombre, apellido o email
    const filteredUsers = users.filter(u =>
        `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase())
    )

    // filtra películas por título
    const filteredMovies = movies.filter(m =>
        m.movieTitle.toLowerCase().includes(movieSearch.toLowerCase())
    )

    return (
        <div className="admin-container">

            <div className="admin-box">

                {/* botón volver al home */}
                <div className="back-button" onClick={() => navigate("/")}>
                    <FiArrowLeft />
                </div>

                <h1 className="admin-title">Panel de Administración</h1>

                {/* pestañas de navegación */}
                <div className="admin-tabs">
                    <button
                        className={`admin-tab ${tab === "usuarios" ? "active" : ""}`}
                        onClick={() => setTab("usuarios")}
                    >
                        <FiUser /> Usuarios
                    </button>
                    <button
                        className={`admin-tab ${tab === "peliculas" ? "active" : ""}`}
                        onClick={() => setTab("peliculas")}
                    >
                        <FiFilm /> Películas
                    </button>
                </div>

                {loading && <p className="admin-empty">Cargando...</p>}

                {/* pestaña usuarios */}
                {!loading && tab === "usuarios" && (
                    <div className="admin-layout">

                        {/* columna izquierda: lista de usuarios */}
                        <div className="admin-list">
                            <div className="admin-search-wrapper">
                                <FiSearch className="admin-search-icon" />
                                <input
                                    className="admin-search"
                                    placeholder="Buscar usuario..."
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                />
                            </div>

                            <h2 className="admin-subtitle">Usuarios ({filteredUsers.length})</h2>

                            {filteredUsers.length === 0 && <p className="admin-empty">No hay usuarios.</p>}

                            {filteredUsers.map(user => (
                                <div
                                    key={user.id}
                                    className={`admin-item ${selectedUser?.id === user.id ? "selected" : ""}`}
                                    onClick={() => handleSelectUser(user.id)}
                                >
                                    <div className="admin-item-info">
                                        <p className="admin-item-name">{user.firstName} {user.lastName}</p>
                                        <p className="admin-item-sub">{user.email}</p>
                                    </div>
                                    {/* stopPropagation evita que se seleccione el usuario al eliminar */}
                                    <button
                                        className="admin-delete-btn"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id) }}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* columna derecha: detalle del usuario seleccionado */}
                        <div className="admin-detail">
                            {!selectedUser && (
                                <p className="admin-empty">Selecciona un usuario para ver su detalle.</p>
                            )}
                            {selectedUser && (
                                <>
                                    <h2 className="admin-subtitle">Detalle</h2>
                                    <div className="admin-detail-grid">
                                        <span className="admin-detail-label">Nombre</span>
                                        <span className="admin-detail-value">{selectedUser.firstName} {selectedUser.lastName}</span>
                                        <span className="admin-detail-label">Email</span>
                                        <span className="admin-detail-value">{selectedUser.email}</span>
                                        <span className="admin-detail-label">DNI</span>
                                        <span className="admin-detail-value">{selectedUser.dni}</span>
                                        <span className="admin-detail-label">Teléfono</span>
                                        <span className="admin-detail-value">{selectedUser.phone}</span>
                                        <span className="admin-detail-label">Dirección</span>
                                        <span className="admin-detail-value">{selectedUser.address}</span>
                                        <span className="admin-detail-label">Rol</span>
                                        <span className="admin-detail-value">{selectedUser.role || "USER"}</span>
                                        <span className="admin-detail-label">Verificado</span>
                                        <span className="admin-detail-value">{selectedUser.isEmailVerified ? "✓ Sí" : "✗ No"}</span>
                                    </div>

                                    {/* historial de alquileres del usuario seleccionado */}
                                    <div className="admin-rentals-section">
                                        <h3 className="admin-rentals-title">
                                            <FiClock /> Historial de alquileres
                                        </h3>

                                        {loadingRentals && <p className="admin-empty">Cargando historial...</p>}

                                        {!loadingRentals && userRentals.length === 0 && (
                                            <p className="admin-empty">Sin alquileres registrados.</p>
                                        )}

                                        {!loadingRentals && userRentals.length > 0 && (
                                            <div className="admin-rentals-list">
                                                {userRentals.map(rental => (
                                                    <div key={rental.id} className={`admin-rental-item ${rental.returnedAt ? "returned" : "active"}`}>
                                                        <div className="admin-rental-info">
                                                            <p className="admin-rental-title">{rental.movieTitle}</p>
                                                            <p className="admin-rental-date">
                                                                Alquilada: {new Date(rental.rentedAt).toLocaleDateString()}
                                                            </p>
                                                            {rental.returnedAt && (
                                                                <p className="admin-rental-date">
                                                                    Devuelta: {new Date(rental.returnedAt).toLocaleDateString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className={`admin-rental-badge ${rental.returnedAt ? "returned" : "active"}`}>
                                                            {rental.returnedAt ? "Devuelta" : "Activa"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* botón eliminar usuario desde el panel de detalle */}
                                    <button
                                        className="admin-delete-full-btn"
                                        onClick={() => handleDeleteUser(selectedUser.id)}
                                    >
                                        <FiTrash2 /> Eliminar usuario
                                    </button>
                                </>
                            )}
                        </div>

                    </div>
                )}

                {/* pestaña películas */}
                {!loading && tab === "peliculas" && (
                    <div className="admin-movies-section">

                        <div className="admin-movies-header">
                            <h2 className="admin-subtitle">Películas ({filteredMovies.length})</h2>
                            <button className="admin-create-btn" onClick={openCreateMovie}>
                                <FiPlus /> Nueva película
                            </button>
                        </div>

                        {/* buscador de películas */}
                        <div className="admin-search-wrapper">
                            <FiSearch className="admin-search-icon" />
                            <input
                                className="admin-search"
                                placeholder="Buscar película..."
                                value={movieSearch}
                                onChange={(e) => setMovieSearch(e.target.value)}
                            />
                        </div>

                        {/* formulario de creación — solo visible cuando no se está editando */}
                        {showMovieForm && !editingMovie && (
                            <div className="admin-form">
                                <h3 className="admin-form-title">Nueva película</h3>
                                <div className="admin-form-row">
                                    <input className="admin-input" placeholder="Título *" value={movieForm.movieTitle} onChange={(e) => setMovieForm(prev => ({ ...prev, movieTitle: e.target.value }))} />
                                    <input className="admin-input" placeholder="Año *" type="number" value={movieForm.year} onChange={(e) => setMovieForm(prev => ({ ...prev, year: e.target.value }))} />
                                </div>
                                <div className="admin-form-row">
                                    <input className="admin-input" placeholder="Director" value={movieForm.director} onChange={(e) => setMovieForm(prev => ({ ...prev, director: e.target.value }))} />
                                    <input className="admin-input" placeholder="Género" value={movieForm.genero} onChange={(e) => setMovieForm(prev => ({ ...prev, genero: e.target.value }))} />
                                </div>
                                <div className="admin-form-row">
                                    <input className="admin-input" placeholder="Actores" value={movieForm.actores} onChange={(e) => setMovieForm(prev => ({ ...prev, actores: e.target.value }))} />
                                    <input className="admin-input" placeholder="Duración (min)" type="number" value={movieForm.duracion} onChange={(e) => setMovieForm(prev => ({ ...prev, duracion: e.target.value }))} />
                                </div>
                                <textarea className="admin-input admin-textarea" placeholder="Descripción" value={movieForm.desc} onChange={(e) => setMovieForm(prev => ({ ...prev, desc: e.target.value }))} />
                                <input className="admin-input" placeholder="URL del poster (https://image.tmdb.org/t/p/w500/...)" value={movieForm.posterUrl} onChange={(e) => setMovieForm(prev => ({ ...prev, posterUrl: e.target.value }))} />
                                <div className="admin-form-buttons">
                                    <button className="admin-save-btn" onClick={handleCreateMovie}>Crear película</button>
                                    <button className="admin-cancel-btn" onClick={resetMovieForm}>Cancelar</button>
                                </div>
                            </div>
                        )}

                        {/* lista de películas con formulario de edición inline */}
                        <div className="admin-movies-list">
                            {filteredMovies.map(movie => (
                                <div key={movie.id}>
                                    <div className={`admin-movie-item ${editingMovie?.id === movie.id ? "editing" : ""}`}>
                                        <div className="admin-movie-info">
                                            <p className="admin-item-name">{movie.movieTitle}</p>
                                            <p className="admin-item-sub">
                                                {movie.year}
                                                {movie.genero && ` · ${movie.genero}`}
                                                {movie.director && ` · ${movie.director}`}
                                                {movie.desc && ` · ${movie.desc.substring(0, 50)}...`}
                                            </p>
                                        </div>
                                        <div className="admin-movie-actions">
                                            <button className="admin-edit-btn" onClick={() => openEditMovie(movie)}>
                                                <FiEdit />
                                            </button>
                                            <button className="admin-delete-btn" onClick={() => handleDeleteMovie(movie.id)}>
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>

                                    {/* formulario de edición inline — aparece debajo de la película seleccionada */}
                                    {editingMovie?.id === movie.id && (
                                        <div className="admin-form admin-form-inline">
                                            <h3 className="admin-form-title">Editar película</h3>
                                            <div className="admin-form-row">
                                                <input className="admin-input" placeholder="Título *" value={movieForm.movieTitle} onChange={(e) => setMovieForm(prev => ({ ...prev, movieTitle: e.target.value }))} />
                                                <input className="admin-input" placeholder="Año *" type="number" value={movieForm.year} onChange={(e) => setMovieForm(prev => ({ ...prev, year: e.target.value }))} />
                                            </div>
                                            <div className="admin-form-row">
                                                <input className="admin-input" placeholder="Director" value={movieForm.director} onChange={(e) => setMovieForm(prev => ({ ...prev, director: e.target.value }))} />
                                                <input className="admin-input" placeholder="Género" value={movieForm.genero} onChange={(e) => setMovieForm(prev => ({ ...prev, genero: e.target.value }))} />
                                            </div>
                                            <div className="admin-form-row">
                                                <input className="admin-input" placeholder="Actores" value={movieForm.actores} onChange={(e) => setMovieForm(prev => ({ ...prev, actores: e.target.value }))} />
                                                <input className="admin-input" placeholder="Duración (min)" type="number" value={movieForm.duracion} onChange={(e) => setMovieForm(prev => ({ ...prev, duracion: e.target.value }))} />
                                            </div>
                                            <textarea className="admin-input admin-textarea" placeholder="Descripción" value={movieForm.desc} onChange={(e) => setMovieForm(prev => ({ ...prev, desc: e.target.value }))} />
                                            <input className="admin-input" placeholder="URL del poster (https://image.tmdb.org/t/p/w500/...)" value={movieForm.posterUrl} onChange={(e) => setMovieForm(prev => ({ ...prev, posterUrl: e.target.value }))} />
                                            <div className="admin-form-buttons">
                                                <button className="admin-save-btn" onClick={handleUpdateMovie}>Guardar cambios</button>
                                                <button className="admin-cancel-btn" onClick={resetMovieForm}>Cancelar</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                )}

            </div>

            {/* toast de notificación */}
            {toast.show && (
                <div className={`admin-toast ${toast.type}`}>{toast.message}</div>
            )}

        </div>
    )
}

export default Admin