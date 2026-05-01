import { useNavigate } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import { useState, useEffect } from "react"
import { addToCart as rentMovie, getMe } from "../services/api"
import "./checkout.css"

function Checkout() {

    const navigate = useNavigate()

    // estado del formulario
    const [cardNumber, setCardNumber] = useState("")
    const [expiry, setExpiry] = useState("")
    const [cvv, setCvv] = useState("")
    const [name, setName] = useState("")

    // estado del proceso de pago
    const [paying, setPaying] = useState(false)
    const [error, setError] = useState("")

    // carrito y usuario
    const [cart, setCart] = useState([])
    const [userId, setUserId] = useState(null)

    // al montar, carga el usuario y su carrito desde localStorage
    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await getMe()
                setUserId(user.id)
                const cartData = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || []
                setCart(cartData)
            } catch (error) {
                console.log("ERROR:", error)
            }
        }
        loadUser()
    }, [])

    // suma total del carrito
    const total = cart.reduce((acc, item) => acc + parseFloat(item.price || 0), 0)

    // formatea el número de tarjeta en grupos de 4
    const handleCardNumber = (e) => {
        let value = e.target.value.replace(/\D/g, "")
        value = value.substring(0, 16)
        const formatted = value.match(/.{1,4}/g)?.join(" ") || ""
        setCardNumber(formatted)
    }

    // formatea la fecha como MM/AA
    const handleExpiry = (e) => {
        let value = e.target.value.replace(/\D/g, "")
        value = value.substring(0, 4)
        if (value.length >= 3) {
            value = value.slice(0, 2) + "/" + value.slice(2)
        }
        setExpiry(value)
    }

    // solo permite números, máximo 3 dígitos
    const handleCvv = (e) => {
        let value = e.target.value.replace(/\D/g, "")
        value = value.substring(0, 3)
        setCvv(value)
    }

    // solo permite letras y espacios
    const handleName = (e) => {
        let value = e.target.value.replace(/[^a-zA-Z\s]/g, "")
        setName(value)
    }

    // procesa el pago: llama al backend para alquilar cada película
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!e.target.checkValidity()) {
            e.target.reportValidity()
            return
        }

        setPaying(true)
        setError("")

        try {
            const existing = JSON.parse(localStorage.getItem(`purchasedMovies_${userId}`)) || []
            const newMovies = []

            // alquila cada película del carrito en el backend
            for (const movie of cart) {
                try {
                    const res = await rentMovie({
                        id: movie.id,
                        title: movie.title,
                        dias: movie.dias
                    })

                    // guarda el id real del producto devuelto por el backend
                    newMovies.push({
                        id: res.alquiler.id,
                        movieTitle: movie.title,
                        dias: movie.dias,
                        price: movie.price,
                        rentedAt: new Date().toISOString(),
                        returnedAt: null
                    })
                } catch (err) {
                    // si ya estaba alquilada la omite
                    console.log("SKIP:", movie.title, err.message)
                }
            }

            // combina las películas nuevas con las ya compradas sin duplicados
            const merged = [...existing]
            newMovies.forEach(m => {
                if (!merged.find(e => e.id === m.id)) {
                    merged.push(m)
                }
            })

            // guarda en localStorage y vacía el carrito
            localStorage.setItem(`purchasedMovies_${userId}`, JSON.stringify(merged))
            localStorage.removeItem(`cart_${userId}`)
            window.dispatchEvent(new Event("cartUpdated"))

            navigate("/payment-success")

        } catch {
            setError("Error al procesar el pago. Inténtalo de nuevo.")
        } finally {
            setPaying(false)
        }
    }

    return (
        <div className="checkout-container">

            <div className="checkout-box">

                {/* botón volver al carrito */}
                <div className="back-button" onClick={() => navigate("/cart")}>
                    <FiArrowLeft />
                </div>

                <h1 className="checkout-title">Pago con tarjeta</h1>

                <div className="checkout-layout">

                    {/* columna izquierda: formulario */}
                    <div className="checkout-left">

                        {/* métodos de pago aceptados */}
                        <div className="payment-method">
                            <span>Tarjeta</span>
                            <div className="card-icons">
                                <img src="/visa.svg" alt="visa" />
                                <img src="/mastercard.svg" alt="mc" />
                                <img src="/amex.svg" alt="amex" />
                            </div>
                        </div>

                        <form className="checkout-form" onSubmit={handleSubmit} noValidate>

                            {/* número de tarjeta */}
                            <div className="field">
                                <label>Número de tarjeta</label>
                                <input
                                    value={cardNumber}
                                    onChange={handleCardNumber}
                                    placeholder="1234 5678 9012 3456"
                                    required
                                />
                            </div>

                            {/* fecha y cvv en la misma fila */}
                            <div className="row">
                                <div className="field">
                                    <label>Fecha</label>
                                    <input value={expiry} onChange={handleExpiry} placeholder="MM/AA" required />
                                </div>
                                <div className="field">
                                    <label>CVV</label>
                                    <input value={cvv} onChange={handleCvv} placeholder="123" required />
                                </div>
                            </div>

                            {/* titular de la tarjeta */}
                            <div className="field">
                                <label>Titular</label>
                                <input value={name} onChange={handleName} placeholder="Nombre completo" required />
                            </div>

                            {/* mensaje de error si falla el pago */}
                            {error && <p className="checkout-error">{error}</p>}

                            {/* botón pagar, deshabilitado mientras procesa */}
                            <button type="submit" className="pay-button" disabled={paying}>
                                {paying ? "Procesando..." : "Pagar ahora"}
                            </button>

                        </form>

                    </div>

                    {/* columna derecha: resumen del pedido */}
                    <div className="checkout-summary">

                        <h2>Resumen</h2>

                        {/* lista de películas con días y precio */}
                        {cart.map((movie, index) => (
                            <div key={index} className="summary-item">
                                <span>{movie.title}</span>
                                <span className="summary-dias">{movie.dias} {movie.dias === 1 ? "día" : "días"}</span>
                                <span>{parseFloat(movie.price).toFixed(2)} €</span>
                            </div>
                        ))}

                        {/* total */}
                        <div className="summary-total">
                            <span>Total</span>
                            <span>{total.toFixed(2)} €</span>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Checkout