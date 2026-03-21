import { useState } from "react"
import { login } from "../services/api"
import { useNavigate, Link } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import "./login.css"

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})

    const navigate = useNavigate()

    function validate() {
        let newErrors = {}

        if (!email.includes("@")) {
            newErrors.email = "El email no es válido"
        }

        if (password.length < 4) {
            newErrors.password = "Mínimo 4 caracteres"
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    async function handleLogin(e) {

        e.preventDefault()

        if (!validate()) return

        try {
            const data = await login(email, password)
            console.log(data)
            navigate("/")
        } catch {
            setErrors({ general: "Email o contraseña incorrectos" })
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">

                <div className="back-button" onClick={() => navigate("/")}>
                    <FiArrowLeft />
                </div>

                <form className="login-content" onSubmit={handleLogin}>

                    <h1>Inicia sesión</h1>

                    <p className="login-subtitle">
                        Descubre y alquila tus películas favoritas
                    </p>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={errors.email ? "input-error" : ""}
                    />
                    {errors.email && (
                        <p className="error-text">{errors.email}</p>
                    )}

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={errors.password ? "input-error" : ""}
                    />
                    {errors.password && (
                        <p className="error-text">{errors.password}</p>
                    )}

                    {errors.general && (
                        <p className="error-text">{errors.general}</p>
                    )}

                    <button type="submit">
                        Continuar
                    </button>

                    <p className="register-text">
                        ¿No tienes una cuenta?{" "}
                        <Link to="/register" className="register-link">
                            Regístrate
                        </Link>
                    </p>

                </form>

            </div>
        </div>
    )
}

export default Login