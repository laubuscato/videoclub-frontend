import { useState } from "react"
import { register } from "../services/api"

function Register() {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [dni, setDni] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [cardNumber, setCardNumber] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleRegister() {

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

    }

    return (
        <div>

        <h1>Register</h1>

        <input placeholder="Nombre" onChange={(e)=>setFirstName(e.target.value)} />
        <input placeholder="Apellido" onChange={(e)=>setLastName(e.target.value)} />
        <input placeholder="DNI" onChange={(e)=>setDni(e.target.value)} />
        <input placeholder="Teléfono" onChange={(e)=>setPhone(e.target.value)} />
        <input placeholder="Dirección" onChange={(e)=>setAddress(e.target.value)} />
        <input placeholder="Tarjeta" onChange={(e)=>setCardNumber(e.target.value)} />
        <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />

        <button onClick={handleRegister}>
            Register
        </button>

        </div>
    )
}

export default Register