// url base del backend
const API_URL = "http://localhost:4000/api"


// login con email y contraseña
export async function login(email, password) {

    const res = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    })

    const data = await res.json()

    if (!res.ok) {
        console.log("ERROR LOGIN:", data)
        throw new Error(data.error || "Error en login")
    }

    console.log("OK LOGIN:", data)

    return data
}


// registro de nuevo usuario
export async function register(data) {

    const res = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const response = await res.json()

    if (!res.ok) {
        console.log("ERROR REGISTER:", response)
        throw new Error(response.error || "Error en register")
    }

    console.log("OK REGISTER:", response)

    return response
}


// historial de alquileres del usuario
export const getCart = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/product/history`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()

    if (!res.ok) {
        console.log("ERROR GET CART:", data)
        throw new Error(data.error || "Error al obtener carrito")
    }

    console.log("OK CART:", data)

    return data
}


// alquila una película en el backend
export const addToCart = async (movie) => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/product/rent`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            movieId: String(movie.id),
            movieTitle: movie.title,
            dias: movie.dias || 3
        })
    })

    const data = await res.json()

    if (!res.ok) {
        console.log("ERROR BACKEND RENT:", data)
        throw new Error(data.error || "Error al alquilar")
    }

    console.log("OK BACKEND RENT:", data)

    return data
}


// marca una película como devuelta
export const returnMovie = async (id) => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/product/${id}/return`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()

    if (!res.ok) {
        console.log("ERROR RETURN:", data)
        throw new Error(data.error || "Error al devolver")
    }

    console.log("OK RETURN:", data)

    return data
}


// obtiene todas las películas de la base de datos
export const getMovies = async () => {

    const res = await fetch(`${API_URL}/movie/all-movies`)

    const data = await res.json()

    if (!res.ok) {
        console.log("ERROR GET MOVIES:", data)
        throw new Error("Error al obtener películas")
    }

    console.log("OK MOVIES:", data)

    return data.movieList
}


// obtiene películas filtradas por año
export const getMoviesByYear = async (year) => {

    const res = await fetch(`${API_URL}/movie/movies-by-year?year=${year}`)

    const data = await res.json()

    if (!res.ok) {
        console.log("ERROR GET MOVIES BY YEAR:", data)
        throw new Error("Error al obtener películas por año")
    }

    return data.movieList
}


// crea una nueva película (solo admin)
export const createMovie = async ({ movieTitle, desc, year }) => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/movie/create-a-new-movie`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ movieTitle, desc, year })
    })

    const data = await res.json()

    if (!res.ok) {
        console.log("ERROR CREATE MOVIE:", data)
        throw new Error(data.error || "Error al crear película")
    }

    console.log("OK CREATE MOVIE:", data)

    return data
}


// edita una película existente (solo admin)
export const updateMovie = async ({ id, movieTitle, desc, year }) => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/movie/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ movieTitle, desc, year })
    })

    const data = await res.json()

    if (!res.ok) {
        console.log("ERROR UPDATE MOVIE:", data)
        throw new Error(data.error || "Error al editar película")
    }

    console.log("OK UPDATE MOVIE:", data)

    return data
}


// obtiene la lista de todos los usuarios (solo admin)
export const getUsers = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/admin/lista-de-usuarios`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()

    if (!res.ok) {
        console.log("ERROR GET USERS:", data)
        throw new Error(data.error || "Error al obtener usuarios")
    }

    console.log("OK GET USERS:", data)

    // compatible con respuesta { users: [] } o array directo
    return data.users || data
}


// obtiene el detalle de un usuario por id (solo admin)
export const getUserDetail = async (id) => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/admin/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()

    if (!res.ok) {
        console.log("ERROR GET USER DETAIL:", data)
        throw new Error(data.error || "Error al obtener usuario")
    }

    console.log("OK GET USER DETAIL:", data)

    return data
}


// elimina un usuario por id (solo admin)
export const deleteUser = async (id) => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/admin/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()

    if (!res.ok) {
        console.log("ERROR DELETE USER:", data)
        throw new Error(data.error || "Error al eliminar usuario")
    }

    console.log("OK DELETE USER:", data)

    return data
}


// obtiene los datos del usuario logueado
export const getMe = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_URL}/user/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.error || "Error al obtener usuario")
    }

    return data
}