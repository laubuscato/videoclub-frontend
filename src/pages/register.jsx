import { useState } from "react"
import { register } from "../services/api"
import { useNavigate } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import "./register.css"

function Register() {
    const [step, setStep] = useState(1)
    const navigate = useNavigate()

    // paso 1
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [dni, setDni] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // paso 2
    const [cardNumber, setCardNumber] = useState("")

    const [errors, setErrors] = useState({})

    function validateStep1() {
        const newErrors = {}
        if (!/^\d{8}[A-Za-z]$/.test(dni)) newErrors.dni = "Formato inválido (ej: 12345678A)"
        if (!/^\d{9}$/.test(phone)) newErrors.phone = "Debe tener 9 dígitos"
        if (password.length < 4) newErrors.password = "Mínimo 4 caracteres"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    function validateStep2() {
        const newErrors = {}
        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) newErrors.cardNumber = "Debe tener 16 dígitos"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    function handleNextStep(e) {
        e.preventDefault()
        if (validateStep1()) setStep(2)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!validateStep2()) return
        setErrors({})
        try {
            await register({ firstName, lastName, dni, phone, address, cardNumber, email, password })
            navigate("/register-success")
        } catch (err) {
            const msg = err.message || ""
            if (msg.includes("ya existe") || msg.includes("email")) {
                setErrors({ general: "Este email ya está registrado." })
            } else if (msg.includes("dni") || msg.includes("Unique") || msg.includes("unique")) {
                setErrors({ general: "Ya existe una cuenta con ese DNI." })
            } else {
                setErrors({ general: "Error al crear la cuenta. Inténtalo de nuevo." })
            }
        }
    }

    const handleCardNumber = (e) => setCardNumber(e.target.value.replace(/\D/g, "").substring(0, 16))
    const handlePhone = (e) => setPhone(e.target.value.replace(/\D/g, "").substring(0, 9))
    const handleDni = (e) => {
        let value = e.target.value.toUpperCase()
        // primeros 8 caracteres solo números, el 9º solo letra
        let numbers = value.replace(/[^0-9]/g, "").substring(0, 8)
        let letter = value.replace(/[^A-Z]/g, "").substring(0, 1)
        if (value.length <= 8) {
            setDni(numbers)
        } else {
            setDni(numbers + letter)
        }
    }

    return (
        <div className="register-container">
            <div className="register-box">

                <div className="back-button" onClick={() => step === 1 ? navigate("/login") : setStep(1)}>
                    <FiArrowLeft />
                </div>

                {/* indicador de pasos */}
                <div className="register-steps">
                    <div className={`register-step ${step >= 1 ? "active" : ""}`}>
                        <div className="register-step-circle">1</div>
                        <span>Datos personales</span>
                    </div>
                    <div className="register-step-line"></div>
                    <div className={`register-step ${step >= 2 ? "active" : ""}`}>
                        <div className="register-step-circle">2</div>
                        <span>Datos de pago</span>
                    </div>
                </div>

                {/* paso 1 */}
                {step === 1 && (
                    <form className="register-content" onSubmit={handleNextStep}>
                        <h1>Regístrate</h1>
                        <p className="register-subtitle">Crea tu cuenta para empezar</p>

                        <div className="form-row">
                            <div className="form-field">
                                <input placeholder="Nombre" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="form-field">
                                <input placeholder="Apellido" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <input placeholder="DNI" required value={dni} onChange={handleDni} className={errors.dni ? "input-error" : ""} />
                                {errors.dni && <span className="field-error">{errors.dni}</span>}
                            </div>
                            <div className="form-field">
                                <input placeholder="Teléfono" required value={phone} onChange={handlePhone} className={errors.phone ? "input-error" : ""} />
                                {errors.phone && <span className="field-error">{errors.phone}</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <input placeholder="Dirección" required value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="form-field">
                                <input type="password" placeholder="Contraseña" required minLength={4} value={password} onChange={(e) => setPassword(e.target.value)} className={errors.password ? "input-error" : ""} />
                                {errors.password && <span className="field-error">{errors.password}</span>}
                            </div>
                        </div>

                        <button type="submit">Siguiente →</button>
                    </form>
                )}

                {/* paso 2 */}
                {step === 2 && (
                    <form className="register-content" onSubmit={handleSubmit}>
                        <h1>Datos de pago</h1>
                        <p className="register-subtitle">Introduce tu tarjeta bancaria</p>

                        <div className="card-preview">
                            <div className="card-preview-number">
                                {cardNumber
                                    ? cardNumber.replace(/(.{4})/g, "$1 ").trim()
                                    : "**** **** **** ****"
                                }
                            </div>
                            <div className="card-preview-label">Tarjeta de crédito / débito</div>
                        </div>

                        <div className="form-row">
                            <div className="form-field" style={{ flex: 1 }}>
                                <input
                                    placeholder="Número de tarjeta (16 dígitos)"
                                    required
                                    value={cardNumber}
                                    onChange={handleCardNumber}
                                    className={errors.cardNumber ? "input-error" : ""}
                                />
                                {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
                            </div>
                        </div>

                        {errors.general && <p className="register-error">{errors.general}</p>}

                        <button type="submit">Crear cuenta</button>
                    </form>
                )}

            </div>
        </div>
    )
}

export default Register