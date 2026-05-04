import { useNavigate } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import { useState, useEffect } from "react"
import { addToCart as rentMovie, getMe } from "../services/api"
import "./checkout.css"

function Checkout() {

    const navigate = useNavigate()

    // campos del formulario de pago
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

    // formatea el número de tarjeta en grupos de 4 dígitos
    const handleCardNumber = (e) => {
        let value = e.target.value.replace(/\D/g, "").substring(0, 16)
        const formatted = value.match(/.{1,4}/g)?.join(" ") || ""
        setCardNumber(formatted)
    }

    // formatea la fecha de caducidad como MM/AA
    const handleExpiry = (e) => {
        let value = e.target.value.replace(/\D/g, "").substring(0, 4)
        if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2)
        setExpiry(value)
    }

    // solo permite números, máximo 3 dígitos para el CVV
    const handleCvv = (e) => setCvv(e.target.value.replace(/\D/g, "").substring(0, 3))

    // solo permite letras y espacios para el titular
    const handleName = (e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))

    // procesa el pago: registra cada película en el backend y limpia el carrito
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

                    // guarda el id real del alquiler devuelto por el backend
                    newMovies.push({
                        id: res.alquiler.id,
                        movieTitle: movie.title,
                        dias: movie.dias,
                        price: movie.price,
                        rentedAt: new Date().toISOString(),
                        returnedAt: null
                    })
                } catch (err) {
                    // si la película ya estaba alquilada, la omite silenciosamente
                    console.log("SKIP:", movie.title, err.message)
                }
            }

            // combina las nuevas compras con las anteriores evitando duplicados
            const merged = [...existing]
            newMovies.forEach(m => {
                if (!merged.find(e => e.id === m.id)) merged.push(m)
            })

            // persiste el historial y vacía el carrito
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

                    {/* columna izquierda: formulario de pago */}
                    <div className="checkout-left">

                        {/* iconos de métodos de pago aceptados */}
                        <div className="payment-method">
                            <span>Tarjeta</span>
                            <div className="card-icons">
                                <img src="/visa.svg" alt="visa" />
                                <img src="/mastercard.svg" alt="mc" />
                                <img src="/amex.svg" alt="amex" />
                            </div>
                        </div>

                        <form className="checkout-form" onSubmit={handleSubmit} noValidate>

                            <div className="field">
                                <label>Número de tarjeta</label>
                                <input value={cardNumber} onChange={handleCardNumber} placeholder="1234 5678 9012 3456" required />
                            </div>

                            {/* fecha y CVV en la misma fila */}
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

                            <div className="field">
                                <label>Titular</label>
                                <input value={name} onChange={handleName} placeholder="Nombre completo" required />
                            </div>

                            {/* error de pago */}
                            {error && <p className="checkout-error">{error}</p>}

                            {/* botón deshabilitado mientras procesa */}
                            <button type="submit" className="pay-button" disabled={paying}>
                                {paying ? "Procesando..." : "Pagar ahora"}
                            </button>

                        </form>
                    </div>

                    {/* columna derecha: resumen del pedido */}
                    <div className="checkout-summary">
                        <h2>Resumen</h2>

                        {/* desglose por película */}
                        {cart.map((movie, index) => (
                            <div key={index} className="summary-item">
                                <span>{movie.title}</span>
                                <span>{movie.dias} {movie.dias === 1 ? "día" : "días"}</span>
                                <span>{parseFloat(movie.price).toFixed(2)} €</span>
                            </div>
                        ))}

                        {/* total final */}
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