import { useNavigate } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import { useState } from "react"
import "./checkout.css"

function Checkout() {

    const navigate = useNavigate()

    const [cardNumber, setCardNumber] = useState("")
    const [expiry, setExpiry] = useState("")
    const [cvv, setCvv] = useState("")
    const [name, setName] = useState("")

    const cart = [
        { title: "Inception", price: 3.99 },
        { title: "Interstellar", price: 4.99 },
        { title: "Batman", price: 2.99 }
    ]

    const total = cart.reduce((acc, item) => acc + item.price, 0)

    const handleCardNumber = (e) => {
        let value = e.target.value.replace(/\D/g, "")
        value = value.substring(0, 16)
        const formatted = value.match(/.{1,4}/g)?.join(" ") || ""
        setCardNumber(formatted)
    }

    const handleExpiry = (e) => {
        let value = e.target.value.replace(/\D/g, "")
        value = value.substring(0, 4)

        if (value.length >= 3) {
            value = value.slice(0, 2) + "/" + value.slice(2)
        }

        setExpiry(value)
    }

    const handleCvv = (e) => {
        let value = e.target.value.replace(/\D/g, "")
        value = value.substring(0, 3)
        setCvv(value)
    }

    const handleName = (e) => {
        let value = e.target.value.replace(/[^a-zA-Z\s]/g, "")
        setName(value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!e.target.checkValidity()) {
            e.target.reportValidity()
            return
        }

        alert("Pago realizado correctamente")
    }

    return (
        <div className="checkout-container">

            <div className="checkout-box">

                <div className="back-button" onClick={() => navigate("/cart")}>
                    <FiArrowLeft />
                </div>

                <h1 className="checkout-title">Pago con tarjeta</h1>

                <div className="checkout-layout">

                    <div className="checkout-left">

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
                                <input 
                                    value={cardNumber}
                                    onChange={handleCardNumber}
                                    placeholder="1234 5678 9012 3456"
                                    required
                                />
                            </div>

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

                            <button type="submit" className="pay-button">
                                Pagar ahora
                            </button>

                        </form>

                    </div>

                    <div className="checkout-summary">

                        <h2>Resumen</h2>

                        {cart.map((movie, index) => (
                            <div key={index} className="summary-item">
                                <span>{movie.title}</span>
                                <span>{movie.price.toFixed(2)}€</span>
                            </div>
                        ))}

                        <div className="summary-total">
                            <span>Total</span>
                            <span>{total.toFixed(2)}€</span>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default Checkout