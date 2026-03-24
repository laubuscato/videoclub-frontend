import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/login"
import Home from "./pages/home"
import Register from "./pages/register"
import MovieDetail from "./pages/MovieDetail"
import Cart from "./pages/cart"
import Checkout from "./pages/checkout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App