import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <h4>Mi Ecommerce</h4>
          <p>
            Compra segura, entregas rapidas y productos seleccionados para tu dia a dia.
          </p>
        </div>

        <div>
          <h4>Navegacion</h4>
          <div className="site-footer__links">
            <Link to="/">Inicio</Link>
            <Link to="/products">Productos</Link>
            <Link to="/cart">Carrito</Link>
            <Link to="/orders">Mis compras</Link>
          </div>
        </div>

        <div>
          <h4>Contacto</h4>
          <p>Av. Reforma 123, CDMX</p>
          <p>ventas@miecommerce.com</p>
          <p>+52 55 1234 5678</p>
        </div>
      </div>
      <p className="site-footer__copy">
        © {new Date().getFullYear()} Mi Ecommerce. Todos los derechos reservados.
      </p>
    </footer>
  );
}

export default Footer;
