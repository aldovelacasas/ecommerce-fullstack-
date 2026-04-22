import { useState } from "react";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const { login } = useAuth();
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
      const data = await loginUser(formData);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth-page login-shell">
      <article className="login-card">
        <header className="login-card__header">
          <p className="login-kicker">Acceso seguro</p>
          <h1>Iniciar sesión</h1>
          <p>Ingresa con tu correo y contraseña para continuar con tu compra.</p>
        </header>

        <form className="auth-form login-form" onSubmit={handleSubmit}>
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
            Entrar
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <footer className="login-card__footer">
          <span>¿Aún no tienes cuenta?</span>
          <Link to="/register">Crear cuenta</Link>
        </footer>
      </article>
    </section>
  );
}

export default Login;

