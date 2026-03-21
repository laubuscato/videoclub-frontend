import { useNavigate } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import "./cart.css"

function Cart() {

    const cartItems = []
    const navigate = useNavigate()

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

                </div>

            </div>

        </div>
    );
}

export default Cart