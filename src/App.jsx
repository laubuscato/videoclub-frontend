import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/login"
import Home from "./pages/home"
import Register from "./pages/register"
import MovieDetail from "./pages/MovieDetail"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App