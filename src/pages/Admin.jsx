import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { FiArrowLeft, FiTrash2, FiEdit, FiPlus, FiUser, FiFilm, FiSearch } from "react-icons/fi"
import { getUsers, getUserDetail, deleteUser, getMovies, createMovie, updateMovie } from "../services/api"
import "./admin.css"

function Admin() {

    const navigate = useNavigate()

    // pestaña activa: "usuarios" o "peliculas"
    const [tab, setTab] = useState("usuarios")

    // estado de usuarios
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [userSearch, setUserSearch] = useState("")

    // estado de películas
    const [movies, setMovies] = useState([])
    const [movieForm, setMovieForm] = useState({ movieTitle: "", desc: "", year: "" })
    const [editingMovie, setEditingMovie] = useState(null)
    const [showMovieForm, setShowMovieForm] = useState(false)
    const [movieSearch, setMovieSearch] = useState("")

    // estado general
    const [toast, setToast] = useState({ show: false, message: "", type: "success" })
    const [loading, setLoading] = useState(true)

    // cargar usuarios y películas al montar
    useEffect(() => {
        loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // carga usuarios y películas en paralelo
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

    // muestra un toast y lo oculta tras 2.5s
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type })
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2500)
    }

    // elimina un usuario tras confirmación
    const handleDeleteUser = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return
        try {
            await deleteUser(id)
            setUsers(prev => prev.filter(u => u.id !== id))
            setSelectedUser(null)
            showToast("Usuario eliminado correctamente")
        } catch (error) {
            showToast(error.message || "Error al eliminar usuario", "error")
        }
    }

    // carga el detalle de un usuario al hacer click
    const handleSelectUser = async (id) => {
        try {
            const detail = await getUserDetail(id)
            setSelectedUser(detail)
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
                year: parseInt(movieForm.year)
            })
            showToast("Película creada correctamente")
            setMovieForm({ movieTitle: "", desc: "", year: "" })
            setShowMovieForm(false)
            const data = await getMovies()
            setMovies(data)
        } catch (error) {
            showToast(error.message || "Error al crear película", "error")
        }
    }

    // actualiza una película existente
    const handleUpdateMovie = async () => {
        try {
            await updateMovie({
                id: editingMovie.id,
                movieTitle: movieForm.movieTitle,
                desc: movieForm.desc,
                year: parseInt(movieForm.year)
            })
            showToast("Película actualizada correctamente")
            setEditingMovie(null)
            setMovieForm({ movieTitle: "", desc: "", year: "" })
            setShowMovieForm(false)
            const data = await getMovies()
            setMovies(data)
        } catch (error) {
            showToast(error.message || "Error al actualizar película", "error")
        }
    }

    // abre el formulario en modo edición con los datos de la película
    const openEditMovie = (movie) => {
        setEditingMovie(movie)
        setMovieForm({
            movieTitle: movie.movieTitle,
            desc: movie.desc || "",
            year: movie.year || ""
        })
        setShowMovieForm(true)
    }

    // abre el formulario en modo creación
    const openCreateMovie = () => {
        setEditingMovie(null)
        setMovieForm({ movieTitle: "", desc: "", year: "" })
        setShowMovieForm(true)
    }

    // filtra usuarios por nombre o email
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

                {/* cargando */}
                {loading && <p className="admin-empty">Cargando...</p>}

                {/* pestaña usuarios */}
                {!loading && tab === "usuarios" && (
                    <div className="admin-layout">

                        <div className="admin-list">

                            {/* buscador de usuarios */}
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

                            {/* lista de usuarios */}
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
                                    {/* botón eliminar usuario */}
                                    <button
                                        className="admin-delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteUser(user.id)
                                        }}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* panel de detalle del usuario seleccionado */}
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
                                        <span className="admin-detail-label">Verificado</span>
                                        <span className="admin-detail-value">{selectedUser.isEmailVerified ? "✓ Sí" : "✗ No"}</span>
                                    </div>
                                    {/* botón eliminar usuario desde el detalle */}
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
                            {/* botón abrir formulario de creación */}
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

                        {/* formulario crear/editar película */}
                        {showMovieForm && (
                            <div className="admin-form">
                                <h3 className="admin-form-title">
                                    {editingMovie ? "Editar película" : "Nueva película"}
                                </h3>
                                <input
                                    className="admin-input"
                                    placeholder="Título"
                                    value={movieForm.movieTitle}
                                    onChange={(e) => setMovieForm(prev => ({ ...prev, movieTitle: e.target.value }))}
                                />
                                <textarea
                                    className="admin-input admin-textarea"
                                    placeholder="Descripción"
                                    value={movieForm.desc}
                                    onChange={(e) => setMovieForm(prev => ({ ...prev, desc: e.target.value }))}
                                />
                                <input
                                    className="admin-input"
                                    placeholder="Año"
                                    type="number"
                                    value={movieForm.year}
                                    onChange={(e) => setMovieForm(prev => ({ ...prev, year: e.target.value }))}
                                />
                                <div className="admin-form-buttons">
                                    {/* guardar o crear según el modo */}
                                    <button
                                        className="admin-save-btn"
                                        onClick={editingMovie ? handleUpdateMovie : handleCreateMovie}
                                    >
                                        {editingMovie ? "Guardar cambios" : "Crear película"}
                                    </button>
                                    {/* cancelar y cerrar formulario */}
                                    <button
                                        className="admin-cancel-btn"
                                        onClick={() => {
                                            setShowMovieForm(false)
                                            setEditingMovie(null)
                                            setMovieForm({ movieTitle: "", desc: "", year: "" })
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* lista de películas filtradas */}
                        <div className="admin-movies-list">
                            {filteredMovies.map(movie => (
                                <div key={movie.id} className="admin-movie-item">
                                    <div className="admin-movie-info">
                                        <p className="admin-item-name">{movie.movieTitle}</p>
                                        <p className="admin-item-sub">{movie.year} {movie.desc && `· ${movie.desc.substring(0, 60)}...`}</p>
                                    </div>
                                    <div className="admin-movie-actions">
                                        {/* botón editar película */}
                                        <button
                                            className="admin-edit-btn"
                                            onClick={() => openEditMovie(movie)}
                                        >
                                            <FiEdit />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                )}

            </div>

            {/* toast de notificación */}
            {toast.show && (
                <div className={`admin-toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}

        </div>
    )
}

export default Admin