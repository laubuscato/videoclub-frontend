import { useState } from "react"
import { register } from "../services/api"
import { useNavigate } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import "./register.css"

function Register() {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [dni, setDni] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    async function handleRegister(e) {

        e.preventDefault()

        const data = await register({
            firstName,
            lastName,
            dni,
            phone,
            address,
            cardNumber,
            email,
            password
        })

        console.log(data)
        navigate("/login")
    }

    return (
        <div className="register-container">
            <div className="register-box">

                <div className="back-button" onClick={() => navigate("/login")}>
                    <FiArrowLeft />
                </div>

                <form className="register-content" onSubmit={handleRegister}>

                    <h1>Regístrate</h1>

                    <p className="register-subtitle">
                        Crea tu cuenta para empezar
                    </p>

                    <div className="form-row">
                        <input
                            placeholder="Nombre"
                            required
                            onChange={(e)=>setFirstName(e.target.value)}
                        />
                        <input
                            placeholder="Apellido"
                            required
                            onChange={(e)=>setLastName(e.target.value)}
                        />
                    </div>

                    <div className="form-row">
                        <input
                            placeholder="DNI"
                            required
                            onChange={(e)=>setDni(e.target.value)}
                        />
                        <input
                            placeholder="Teléfono"
                            required
                            onChange={(e)=>setPhone(e.target.value)}
                        />
                    </div>

                    <div className="form-row">
                        <input
                            placeholder="Dirección"
                            required
                            onChange={(e)=>setAddress(e.target.value)}
                        />
                        <input
                            placeholder="Tarjeta"
                            required
                            onChange={(e)=>setCardNumber(e.target.value)}
                        />
                    </div>

                    <div className="form-row">
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            minLength={4}
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit">
                        Crear cuenta
                    </button>

                </form>

            </div>
        </div>
    )
}

export default Register