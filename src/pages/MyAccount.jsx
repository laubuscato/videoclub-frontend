import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FiArrowLeft, FiEdit2, FiCheck, FiX } from "react-icons/fi"
import { getMe, getCart } from "../services/api"
import "./myAccount.css"

// URL base de la API
const API_URL = "http://localhost:4000/api"

// actualiza los datos personales del usuario via PATCH /user/me
async function updateUser({ firstName, lastName, phone, address }) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API_URL}/user/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ firstName, lastName, phone, address })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Error al actualizar")
    return data
}

// calcula la fecha de devolución sumando los días al rentedAt
function calcReturnDate(rentedAt, dias) {
    if (!rentedAt || !dias) return null
    const date = new Date(rentedAt)
    date.setDate(date.getDate() + parseInt(dias))
    return date.toLocaleDateString()
}

// componente reutilizable para campos editables inline
function EditableField({ label, value, onSave }) {
    const [editing, setEditing] = useState(false)
    const [tempValue, setTempValue] = useState(value)

    // guarda el nuevo valor y cierra el modo edición
    const handleSave = async () => {
        await onSave(tempValue)
        setEditing(false)
    }

    // descarta los cambios y cierra el modo edición
    const handleCancel = () => {
        setTempValue(value)
        setEditing(false)
    }

    return (
        <div className="account-field">
            <span className="account-field-label">{label}</span>
            {editing ? (
                <div className="account-field-edit">
                    <input
                        className="account-field-input"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        autoFocus
                    />
                    <button className="account-field-btn save" onClick={handleSave}><FiCheck /></button>
                    <button className="account-field-btn cancel" onClick={handleCancel}><FiX /></button>
                </div>
            ) : (
                <div className="account-field-value">
                    <span>{value}</span>
                    <button className="account-field-btn edit" onClick={() => { setTempValue(value); setEditing(true) }}>
                        <FiEdit2 />
                    </button>
                </div>
            )}
        </div>
    )
}

function MyAccount() {
    const navigate = useNavigate()

    // datos del usuario logueado
    const [user, setUser] = useState(null)
    // historial completo de alquileres
    const [rentals, setRentals] = useState([])
    const [loading, setLoading] = useState(true)
    // notificación temporal
    const [toast, setToast] = useState({ show: false, message: "", type: "success" })

    // carga el usuario y su historial al montar el componente
    useEffect(() => {
        const load = async () => {
            try {
                const userData = await getMe()
                setUser(userData)
                const rentalsData = await getCart()
                setRentals(rentalsData)
            } catch (error) {
                console.log("ERROR:", error)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    // muestra un toast de notificación y lo oculta tras 2.5s
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type })
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2500)
    }

    // actualiza un campo del usuario en el backend y en el estado local
    const handleUpdate = async (field, value) => {
        try {
            await updateUser({ ...user, [field]: value })
            setUser(prev => ({ ...prev, [field]: value }))
            showToast("Datos actualizados correctamente")
        } catch (error) {
            showToast(error.message || "Error al actualizar", "error")
        }
    }

    // separa alquileres activos y devueltos
    const active = rentals.filter(r => r.returnedAt === null)
    const returned = rentals.filter(r => r.returnedAt !== null)

    // muestra solo los últimos 4 dígitos de la tarjeta
    const maskedCard = user?.cardNumber
        ? "**** **** **** " + String(user.cardNumber).slice(-4)
        : "**** **** **** ****"

    if (loading) return (
        <div className="account-container">
            <div className="account-box">
                <p className="account-empty">Cargando...</p>
            </div>
        </div>
    )

    return (
        <div className="account-container">
            <div className="account-box">

                {/* botón volver al home */}
                <div className="back-button" onClick={() => navigate("/")}>
                    <FiArrowLeft />
                </div>

                <h1 className="account-title">Mi Cuenta</h1>
                {user && <p className="account-subtitle">Hola, {user.firstName}</p>}

                {/* datos personales editables */}
                <div className="account-section">
                    <h2 className="account-section-title">Datos personales</h2>
                    <div className="account-fields">
                        <EditableField label="Nombre" value={user?.firstName || ""} onSave={(v) => handleUpdate("firstName", v)} />
                        <EditableField label="Apellido" value={user?.lastName || ""} onSave={(v) => handleUpdate("lastName", v)} />
                        <EditableField label="Teléfono" value={user?.phone || ""} onSave={(v) => handleUpdate("phone", v)} />
                        <EditableField label="Dirección" value={user?.address || ""} onSave={(v) => handleUpdate("address", v)} />

                        {/* email y DNI son de solo lectura */}
                        <div className="account-field">
                            <span className="account-field-label">Email</span>
                            <div className="account-field-value readonly">
                                <span>{user?.email}</span>
                            </div>
                        </div>
                        <div className="account-field">
                            <span className="account-field-label">DNI</span>
                            <div className="account-field-value readonly">
                                <span>{user?.dni}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* datos bancarios: tarjeta enmascarada */}
                <div className="account-section">
                    <h2 className="account-section-title">Datos bancarios</h2>
                    <div className="account-fields">
                        <div className="account-field">
                            <span className="account-field-label">Tarjeta</span>
                            <div className="account-field-value readonly">
                                <span className="account-card">{maskedCard}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* historial de alquileres separado en activos y devueltos */}
                <div className="account-section">
                    <h2 className="account-section-title">Historial de alquileres</h2>

                    {rentals.length === 0 && (
                        <p className="account-empty">No tienes alquileres registrados.</p>
                    )}

                    {active.length > 0 && (
                        <>
                            <p className="account-rentals-label">Activos</p>
                            <div className="account-rentals">
                                {active.map(r => (
                                    <div key={r.id} className="account-rental active">
                                        <div className="account-rental-info">
                                            <p className="account-rental-title">{r.movieTitle}</p>
                                            <p className="account-rental-date">Alquilada el {new Date(r.rentedAt).toLocaleDateString()}</p>
                                            {/* fecha de devolución calculada: rentedAt + dias */}
                                            {r.dias && <p className="account-rental-date">Devolución el {calcReturnDate(r.rentedAt, r.dias)}</p>}
                                        </div>
                                        <span className="account-rental-badge active">Activa</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {returned.length > 0 && (
                        <>
                            <p className="account-rentals-label returned">Devueltas</p>
                            <div className="account-rentals">
                                {returned.map(r => (
                                    <div key={r.id} className="account-rental returned">
                                        <div className="account-rental-info">
                                            <p className="account-rental-title">{r.movieTitle}</p>
                                            <p className="account-rental-date">
                                                Alquilada el {new Date(r.rentedAt).toLocaleDateString()}
                                                {r.returnedAt && ` · Devuelta el ${new Date(r.returnedAt).toLocaleDateString()}`}
                                            </p>
                                        </div>
                                        <span className="account-rental-badge returned">Devuelta</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

            </div>

            {/* toast de notificación */}
            {toast.show && (
                <div className={`account-toast ${toast.type}`}>{toast.message}</div>
            )}
        </div>
    )
}

export default MyAccount
