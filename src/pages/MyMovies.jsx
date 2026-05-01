import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { FiArrowLeft } from "react-icons/fi"
import { getCart, returnMovie, getMe } from "../services/api"
import { movies as moviesData } from "../data/movies.js"
import "./myMovies.css"

function MyMovies() {

    const navigate = useNavigate()

    // lista de todas las películas del usuario
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)

    // toast de notificación
    const [toast, setToast] = useState({ show: false, message: "", type: "success" })

    // id del usuario logueado
    const [userId, setUserId] = useState(null)

    // mapa de título en minúsculas → url del poster
    const posters = Object.fromEntries(
        moviesData.map(movie => [movie.title.toLowerCase(), movie.posterUrl])
    )

    // al montar, carga el usuario y combina películas del backend con las compradas localmente
    useEffect(() => {
        const load = async () => {
            try {
                const user = await getMe()
                setUserId(user.id)

                // películas del backend
                const data = await getCart()

                // películas compradas guardadas en localStorage
                const purchased = JSON.parse(localStorage.getItem(`purchasedMovies_${user.id}`)) || []

                // añade solo las que no están ya en el backend
                const allIds = new Set(data.map(m => m.id))
                const extra = purchased.filter(m => !allIds.has(m.id))

                setMovies([...data, ...extra])
            } catch (error) {
                console.log("ERROR:", error)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    // devuelve una película llamando al backend y recarga la lista
    const handleReturn = async (id) => {
        try {
            await returnMovie(id)

            // recarga desde backend y localStorage
            const data = await getCart()
            const purchased = JSON.parse(localStorage.getItem(`purchasedMovies_${userId}`)) || []
            const allIds = new Set(data.map(m => m.id))
            const extra = purchased.filter(m => !allIds.has(m.id))
            setMovies([...data, ...extra])

            setToast({ show: true, message: "Película devuelta correctamente", type: "success" })
        } catch (error) {
            setToast({ show: true, message: error.message || "Error al devolver", type: "error" })
        }

        setTimeout(() => {
            setToast({ show: false, message: "", type: "success" })
        }, 2000)
    }

    // separa películas activas y devueltas
    const active = movies.filter(m => m.returnedAt === null)
    const returned = movies.filter(m => m.returnedAt !== null)

    return (
        <div className="mymovies-container">

            <div className="mymovies-box">

                {/* botón volver al home */}
                <div className="back-button" onClick={() => navigate("/")}>
                    <FiArrowLeft />
                </div>

                <h1 className="mymovies-title">Mis Películas</h1>

                {/* estado de carga */}
                {loading && (
                    <p className="mymovies-empty">Cargando...</p>
                )}

                {/* mensaje si no hay películas */}
                {!loading && movies.length === 0 && (
                    <p className="mymovies-empty">No tienes películas alquiladas.</p>
                )}

                {/* sección de películas alquiladas */}
                {!loading && active.length > 0 && (
                    <>
                        <h2 className="mymovies-subtitle">Alquiladas</h2>
                        <div className="mymovies-list">
                            {active.map(movie => {
                                const poster = posters[(movie.movieTitle || movie.title)?.toLowerCase()]
                                return (
                                    <div key={movie.id} className="mymovies-item">

                                        {/* poster */}
                                        <img
                                            src={poster || "https://via.placeholder.com/70x100?text=N/A"}
                                            alt={movie.movieTitle || movie.title}
                                            className="mymovies-img"
                                        />

                                        <div className="mymovies-info">
                                            {/* título */}
                                            <h3 className="mymovies-movie-title">{movie.movieTitle || movie.title}</h3>

                                            {/* fecha de alquiler */}
                                            <p className="mymovies-date">
                                                Alquilada el {new Date(movie.rentedAt).toLocaleDateString()}
                                            </p>

                                            {/* días y precio si están disponibles */}
                                            {movie.dias && (
                                                <p className="mymovies-dias">
                                                    {movie.dias} {movie.dias === 1 ? "día" : "días"} · {parseFloat(movie.price).toFixed(2)} €
                                                </p>
                                            )}
                                        </div>

                                        {/* botón devolver */}
                                        <button
                                            className="mymovies-return"
                                            onClick={() => handleReturn(movie.id)}
                                        >
                                            Devolver
                                        </button>

                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {/* sección de películas devueltas */}
                {!loading && returned.length > 0 && (
                    <>
                        <h2 className="mymovies-subtitle returned">Devueltas</h2>
                        <div className="mymovies-list">
                            {returned.map(movie => {
                                const poster = posters[(movie.movieTitle || movie.title)?.toLowerCase()]
                                return (
                                    <div key={movie.id} className="mymovies-item returned">

                                        {/* poster */}
                                        <img
                                            src={poster || "https://via.placeholder.com/70x100?text=N/A"}
                                            alt={movie.movieTitle || movie.title}
                                            className="mymovies-img"
                                        />

                                        <div className="mymovies-info">
                                            {/* título */}
                                            <h3 className="mymovies-movie-title">{movie.movieTitle || movie.title}</h3>

                                            {/* fecha de devolución */}
                                            <p className="mymovies-date">
                                                Devuelta el {new Date(movie.returnedAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

            </div>

            {/* toast de notificación */}
            {toast.show && (
                <div className={`mymovies-toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}

        </div>
    )
}

export default MyMovies