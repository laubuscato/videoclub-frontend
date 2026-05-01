import { useNavigate } from "react-router-dom"
import "./paymentSuccess.css"

function PaymentSuccess() {

    const navigate = useNavigate()

    return (
        <div className="success-container">
            <div className="success-box">

                {/* icono de confirmación */}
                <div className="success-icon">✓</div>

                {/* título */}
                <h1 className="success-title">¡Pago realizado!</h1>

                {/* mensaje informativo */}
                <p className="success-text">Tus películas ya están disponibles en "Mis películas".</p>

                {/* botón ir a mis películas */}
                <button className="success-button" onClick={() => navigate("/my-movies")}>
                    Ver mis películas
                </button>

                {/* botón volver al home */}
                <button className="success-button-secondary" onClick={() => navigate("/")}>
                    Volver al inicio
                </button>

            </div>
        </div>
    )
}

export default PaymentSuccess