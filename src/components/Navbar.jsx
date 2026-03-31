/**
 * Navbar.jsx
 * Barra de navegación principal con menú de secciones
 */
import { useState } from "react";
import "./Navbar.css";

const menuItems = [
  { id: "top", label: "Top Negocios", icon: "📈" },
  { id: "search", label: "Buscar Noticias", icon: "🔍" },
  { id: "headlines", label: "Titulares", icon: "📰" },
  { id: "similar", label: "Noticias Similares", icon: "🔗" },
  { id: "article", label: "Artículo por UUID", icon: "📄" },
  { id: "sources", label: "Fuentes", icon: "🌐" },
];

export default function Navbar({ activeSection, onSectionChange }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelect = (id) => {
    onSectionChange(id);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-flag">🇨🇴</span>
        <div className="navbar-title-group">
          <span className="navbar-title">Colombia Business News</span>
          <span className="navbar-subtitle">The News API Explorer</span>
        </div>
      </div>

      {/* Botón hamburguesa para móvil */}
      <button
        className={`navbar-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menú"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Menú de navegación */}
      <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              className={`navbar-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => handleSelect(item.id)}
            >
              <span className="navbar-item-icon">{item.icon}</span>
              <span className="navbar-item-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
