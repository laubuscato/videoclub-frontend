import { useState } from "react"
import { login } from "../services/api"
import { useNavigate } from "react-router-dom"

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    async function handleLogin() {

        try {

            const data = await login(email, password)

            console.log(data)

            navigate("/home")

        } catch (error) {

            console.log(error)

        }

    }

    return (
        <div>

        <h1>Login</h1>

        <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
        />

        <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
            Login
        </button>

        </div>
    ) 
}

export default Login