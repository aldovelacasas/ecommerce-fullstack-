import { useState } from "react";
import { registerUser } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth-page login-shell">
      <article className="login-card">
        <header className="login-card__header">
          <p className="login-kicker">Cuenta nueva</p>
          <h1>Crear cuenta</h1>
          <p>Completa tus datos para comenzar a comprar y gestionar tus pedidos.</p>
        </header>

        <form className="auth-form login-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Nombre completo</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Tu nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="btn btn-primary login-submit" type="submit">
            Registrarme
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <footer className="login-card__footer">
          <span>¿Ya tienes cuenta?</span>
          <Link to="/login">Iniciar sesión</Link>
        </footer>
      </article>
    </section>
  );
}

export default Register;

