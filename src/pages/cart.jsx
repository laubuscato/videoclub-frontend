import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { FiArrowLeft } from "react-icons/fi"
import "./cart.css"

function Cart() {

    const navigate = useNavigate()

    const [cartItems, setCartItems] = useState(() => {
        return JSON.parse(localStorage.getItem("cart")) || []
    })

    const removeFromCart = (id) => {
        const updatedCart = cartItems.filter(movie => movie.id !== id)
        setCartItems(updatedCart)
        localStorage.setItem("cart", JSON.stringify(updatedCart))
        window.dispatchEvent(new Event("cartUpdated"))
    }

    const clearCart = () => {
        localStorage.removeItem("cart")
        setCartItems([])
        window.dispatchEvent(new Event("cartUpdated"))
    }

    const totalPrice = cartItems.length * 9.99

    return (
        <div className="cart-container">

            <div className="cart-box">

                <div className="back-button" onClick={() => navigate("/")}>
                    <FiArrowLeft />
                </div>

                <div className="cart-content">

                    <h1 className="cart-title">Cesta</h1>

                    {cartItems.length === 0 && (
                        <p className="cart-empty">
                            <strong>Tu cesta está vacía.</strong> ¡Es momento de descubrir tu próxima película favorita!
                        </p>
                    )}

                    {cartItems.length > 0 && (
                        <>
                            <div className="cart-footer">

                                <p className="cart-total">
                                    Total de películas en la cesta: {cartItems.length}
                                </p>

                                <button 
                                    className="cart-clear"
                                    onClick={clearCart}
                                >
                                    Vaciar carrito
                                </button>

                            </div>

                            <div className="cart-list">

                                {cartItems.map((movie) => (

                                    <div key={movie.id} className="cart-item">

                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                            alt={movie.title}
                                            className="cart-img"
                                        />

                                        <h3 className="cart-movie-title">
                                            {movie.title}
                                        </h3>

                                        <button
                                            className="cart-remove"
                                            onClick={() => removeFromCart(movie.id)}
                                        >
                                            Eliminar
                                        </button>

                                    </div>

                                ))}

                            </div>
                        </>
                    )}

                </div>

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