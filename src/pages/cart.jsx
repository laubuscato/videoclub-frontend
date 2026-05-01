import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { FiArrowLeft } from "react-icons/fi"
import { getMe } from "../services/api"
import { movies as moviesData } from "../data/movies.js"
import "./cart.css"

function Cart() {

    const navigate = useNavigate()
    const [cartItems, setCartItems] = useState([])
    const [userId, setUserId] = useState(null)

    // mapa de título en minúsculas → url del poster
    const posters = Object.fromEntries(
        moviesData.map(movie => [movie.title.toLowerCase(), movie.posterUrl])
    )

    // al montar, carga el usuario y su carrito desde localStorage
    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await getMe()
                setUserId(user.id)
                const cart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || []
                setCartItems(cart)
            } catch (error) {
                console.log("ERROR:", error)
            }
        }
        loadUser()
    }, [])

    // elimina una película del carrito por id
    const removeFromCart = (id) => {
        const updated = cartItems.filter(movie => movie.id !== id)
        setCartItems(updated)
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updated))
        window.dispatchEvent(new Event("cartUpdated"))
    }

    // vacía el carrito completamente
    const clearCart = () => {
        setCartItems([])
        localStorage.removeItem(`cart_${userId}`)
        window.dispatchEvent(new Event("cartUpdated"))
    }

    // actualiza los días de alquiler y recalcula el precio
    const updateDias = (id, newDias) => {
        const updated = cartItems.map(movie =>
            movie.id === id
                ? { ...movie, dias: newDias, price: (newDias * 2).toFixed(2) }
                : movie
        )
        setCartItems(updated)
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updated))
    }

    // suma total de todos los precios
    const totalPrice = cartItems.reduce((acc, movie) => acc + parseFloat(movie.price || 0), 0)

    return (
        <div className="cart-container">

            <div className="cart-box">

                {/* botón volver al home */}
                <div className="back-button" onClick={() => navigate("/")}>
                    <FiArrowLeft />
                </div>

                <div className="cart-content">

                    <h1 className="cart-title">Cesta</h1>

                    {/* mensaje si la cesta está vacía */}
                    {cartItems.length === 0 && (
                        <p className="cart-empty">
                            <strong>Tu cesta está vacía.</strong>
                        </p>
                    )}

                    {cartItems.length > 0 && (
                        <>
                            {/* cabecera con total y botón vaciar */}
                            <div className="cart-footer">
                                <p className="cart-total">
                                    Total de películas: {cartItems.length}
                                </p>
                                <button
                                    className="cart-clear"
                                    onClick={clearCart}
                                >
                                    Vaciar carrito
                                </button>
                            </div>

                            {/* lista de películas */}
                            <div className="cart-list">
                                {cartItems.map((movie) => {
                                    const poster = posters[movie.title?.toLowerCase()]
                                    return (
                                        <div key={movie.id} className="cart-item">

                                            {/* portada de la película */}
                                            <img
                                                src={poster || "https://via.placeholder.com/70x100?text=N/A"}
                                                alt={movie.title}
                                                className="cart-img"
                                            />

                                            <div className="cart-movie-info">

                                                {/* título */}
                                                <h3 className="cart-movie-title">
                                                    {movie.title}
                                                </h3>

                                                {/* selector de días */}
                                                <div className="cart-dias-selector">
                                                    <button
                                                        className="cart-dias-btn"
                                                        onClick={() => updateDias(movie.id, Math.max(1, movie.dias - 1))}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="cart-dias-count">
                                                        {movie.dias} {movie.dias === 1 ? "día" : "días"}
                                                    </span>
                                                    <button
                                                        className="cart-dias-btn"
                                                        onClick={() => updateDias(movie.id, Math.min(30, movie.dias + 1))}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* precio calculado por días */}
                                                <p className="cart-movie-price">
                                                    {parseFloat(movie.price).toFixed(2)} €
                                                </p>

                                            </div>

                                            {/* botón eliminar */}
                                            <button
                                                className="cart-remove"
                                                onClick={() => removeFromCart(movie.id)}
                                            >
                                                Eliminar
                                            </button>

                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}

                </div>

                {/* precio total y botón pagar */}
                {cartItems.length > 0 && (
                    <>
                        <p className="cart-price bottom">
                            Total: {totalPrice.toFixed(2)} €
                        </p>

                        <button
                            className="checkout-button"
                            onClick={() => navigate("/checkout")}
                        >
                            Proceder a pagar
                        </button>
                    </>
                )}

            </div>

        </div>
    )
}

export default Cart