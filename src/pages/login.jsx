import { useState } from "react"
import { login } from "../services/api"
import { useNavigate, Link } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import "./login.css"

function Login() {

    // estado del formulario
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // errores de validación
    const [errors, setErrors] = useState({})

    const navigate = useNavigate()

    // valida email y contraseña antes de enviar
    function validate() {
        let newErrors = {}

        if (!email.includes("@")) {
            newErrors.email = "El email no es válido"
        }

        if (password.length < 4) {
            newErrors.password = "Mínimo 4 caracteres"
        }

        setErrors(newErrors)

        // devuelve true si no hay errores
        return Object.keys(newErrors).length === 0
    }

    // maneja el envío del formulario
    async function handleLogin(e) {
        e.preventDefault()

        if (!validate()) return

        try {
            const data = await login(email, password)
            // guarda el token JWT en localStorage para autenticar futuras peticiones
            localStorage.setItem("token", data.token)
            navigate("/")
        } catch {
            setErrors({ general: "Email o contraseña incorrectos" })
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">

                {/* botón volver al home */}
                <div className="back-button" onClick={() => navigate("/")}>
                    <FiArrowLeft />
                </div>

                <form className="login-content" onSubmit={handleLogin}>

                    <h1>Inicia sesión</h1>

                    <p className="login-subtitle">
                        Descubre y alquila tus películas favoritas
                    </p>

                    {/* campo email */}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={errors.email ? "input-error" : ""}
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}

                    {/* campo contraseña */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={errors.password ? "input-error" : ""}
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}

                    {/* error general si las credenciales son incorrectas */}
                    {errors.general && <p className="error-text">{errors.general}</p>}

                    <button type="submit">Continuar</button>

                    {/* enlace a la página de registro */}
                    <p className="register-text">
                        ¿No tienes una cuenta?{" "}
                        <Link to="/register" className="register-link">Regístrate</Link>
                    </p>

                </form>

            </div>
        </div>
    )
}

export default Login