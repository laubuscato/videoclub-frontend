import "./MovieDetail.css";
import { useParams, Link } from "react-router-dom"
import { movies } from "../data/movies"

function MovieDetail() {

    // obtiene el id de la URL (ej: /movie/5 → id = "5")
    const { id } = useParams()

    // busca la película en los datos locales por id numérico
    const movie = movies.find((movie) => movie.id === Number(id))

    // si no existe muestra un mensaje de error con enlace al home
    if (!movie) {
        return (
            <div>
                <h2>Película no encontrada</h2>
                <Link to="/home">Volver al home</Link>
            </div>
        )
    }

    return (
        <div className="movie-detail">

            {/* enlace volver al home */}
            <Link to="/home" className="back-link">← Volver</Link>

            <div className="movie-detail-card">

                {/* poster de la película */}
                <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="movie-detail-poster"
                />

                {/* información detallada de la película */}
                <div className="movie-detail-info">
                    <h1>{movie.title}</h1>
                    <p><strong>Año:</strong> {movie.year}</p>
                    <p><strong>Duración:</strong> {movie.runtime} min</p>
                    <p><strong>Géneros:</strong> {movie.genres.join(", ")}</p>
                    <p><strong>Director:</strong> {movie.director}</p>
                    <p><strong>Actores:</strong> {movie.actors}</p>
                    <p><strong>Sinopsis:</strong> {movie.plot}</p>
                </div>

            </div>

        </div>
    )
}

export default MovieDetail