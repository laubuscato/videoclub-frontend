import { useState } from "react"
import { login } from "../services/api"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import "./login.css";

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    async function handleLogin() {
        try {
            const data = await login(email, password)

            console.log(data)

            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-content">

                    <h1>Inicia sesión</h1>

                    <p className="login-subtitle">
                        Descubre y alquila tus películas favoritas
                    </p>

                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button onClick={handleLogin}>
                        Continuar
                    </button>

                    <p className="register-text">
                        ¿No tienes una cuenta?{" "}
                        <Link to="/register" className="register-link">
                            Regístrate
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    )
}

export default Login