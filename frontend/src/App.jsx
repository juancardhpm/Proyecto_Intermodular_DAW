// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// IMPORTA LOS COMPONENTES NECESARIOS
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ProductDetail from "./components/ProductDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";

// IMPORTA LOS ESTILOS (SASS O CSS)
import './App.sass';

function App() {
  return (
    <Router>
      {/* Barra de navegación que siempre se muestra */}
      <Navbar />

      <main className="main-content">
        {/* Rutas para los diferentes componentes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>

      {/* Pie de página que siempre se muestra */}
      <Footer />
    </Router>
  );
}

export default App;