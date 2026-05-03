import { Navigate } from "react-router-dom"

// componente que protege rutas privadas
// si no hay token en localStorage redirige al login automáticamente
function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token")
    if (!token) return <Navigate to="/login" replace />
    return children
}

export default ProtectedRoute
