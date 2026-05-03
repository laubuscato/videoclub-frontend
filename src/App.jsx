import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/login"
import Home from "./pages/home"
import Register from "./pages/register"
import RegisterSuccess from "./pages/RegisterSuccess"
import MovieDetail from "./pages/MovieDetail"
import Cart from "./pages/cart"
import Checkout from "./pages/checkout"
import MyMovies from "./pages/MyMovies"
import MyAccount from "./pages/MyAccount"
import PaymentSuccess from "./pages/PaymentSuccess"
import Admin from "./pages/Admin"
// componente que protege rutas privadas redirigiendo al login si no hay sesión
import ProtectedRoute from "./pages/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* rutas públicas: accesibles sin estar logueado */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-success" element={<RegisterSuccess />} />
        <Route path="/movie/:id" element={<MovieDetail />} />

        {/* rutas protegidas: requieren token en localStorage */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/my-movies" element={<ProtectedRoute><MyMovies /></ProtectedRoute>} />
        <Route path="/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

        {/* cualquier ruta no definida redirige al home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App