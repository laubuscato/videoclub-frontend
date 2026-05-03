import { useNavigate } from "react-router-dom"
import "./registerSuccess.css"

// pantalla de confirmación que se muestra tras completar el registro
function RegisterSuccess() {
    const navigate = useNavigate()

    return (
        <div className="regsuccess-container">
            <div className="regsuccess-box">

                {/* icono de confirmación */}
                <div className="regsuccess-icon">✓</div>

                {/* título */}
                <h1 className="regsuccess-title">¡Cuenta creada!</h1>

                {/* subtítulo */}
                <p className="regsuccess-text">
                    Tu cuenta ha sido creada correctamente. Ya puedes iniciar sesión y empezar a alquilar películas.
                </p>

                {/* botón ir al login */}
                <button className="regsuccess-button" onClick={() => navigate("/login")}>
                    Iniciar sesión
                </button>

            </div>
        </div>
    )
}

export default RegisterSuccess
