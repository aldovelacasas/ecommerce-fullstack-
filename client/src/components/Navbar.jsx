import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="navbar">
      <Link className="navbar__logo" to="/">
        Mi Ecommerce
      </Link>

      <button
        type="button"
        className="hamburger-btn"
        onClick={() => setIsMenuOpen((previous) => !previous)}
        aria-label="Abrir menu de navegacion"
        aria-expanded={isMenuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`navbar__nav ${isMenuOpen ? "navbar__nav--open" : ""}`}>
        <Link className="nav-link" to="/" onClick={closeMenu}>Inicio</Link>
        <Link className="nav-link" to="/#quienes-somos" onClick={closeMenu}>Quienes somos</Link>
        <Link className="nav-link" to="/products" onClick={closeMenu}>Productos</Link>

        {user && (
          <Link
            className="cart-icon-btn"
            to="/cart"
            onClick={closeMenu}
            aria-label={`Carrito con ${totalItems} productos`}
            title="Ir al carrito"
          >
            <span className="cart-icon-btn__icon" aria-hidden="true">🛒</span>
            <span className="cart-count-badge" aria-hidden="true">{totalItems}</span>
          </Link>
        )}

        {user?.role === "admin" && (
          <Link className="nav-link nav-link--pill" to="/admin" onClick={closeMenu}>
            Admin
          </Link>
        )}

        <button
          type="button"
          className="theme-toggle theme-toggle--icon"
          onClick={() => {
            toggleTheme();
            closeMenu();
          }}
          aria-label={theme === "light" ? "Activar tema oscuro" : "Activar tema claro"}
          title={theme === "light" ? "Tema oscuro" : "Tema claro"}
        >
          🌙
        </button>

        {!user ? (
          <div className="nav-auth">
            <Link className="btn btn-ghost" to="/login" onClick={closeMenu}>Login</Link>
            <Link className="btn btn-primary" to="/register" onClick={closeMenu}>Registro</Link>
          </div>
        ) : (
          <div className="nav-auth nav-auth--logged">
            <span className="nav-greeting">Hola, {user.name}</span>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                logout();
              }}
              className="logout-btn"
            >
              Cerrar sesion
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
