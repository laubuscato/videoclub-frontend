import "./MovieDetail.css";
import { useParams, Link } from "react-router-dom"
import { movies } from "../data/movies"

function MovieDetail() {
  const { id } = useParams()

  const movie = movies.find((movie) => movie.id === Number(id))

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
      <Link to="/home" className="back-link">← Volver</Link>

      <div className="movie-detail-card">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="movie-detail-poster"
        />

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