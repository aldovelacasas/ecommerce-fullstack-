import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/productService";

const FALLBACK_IMAGE = "https://via.placeholder.com/700x420?text=Producto";

function Home() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = useMemo(() => products.slice(0, 6), [products]);

  useEffect(() => {
    if (featuredProducts.length <= 1) return undefined;

    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featuredProducts.length);
    }, 4200);

    return () => clearInterval(intervalId);
  }, [featuredProducts.length]);

  const goToPrevious = () => {
    if (featuredProducts.length === 0) return;
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? featuredProducts.length - 1 : prevSlide - 1
    );
  };

  const goToNext = () => {
    if (featuredProducts.length === 0) return;
    setCurrentSlide((prevSlide) => (prevSlide + 1) % featuredProducts.length);
  };

  const activeProduct = featuredProducts[currentSlide];

  return (
    <section className="home-layout">
      <article className="home-hero">
        <p className="home-hero__eyebrow">Tienda online</p>
        <h1>Compra facil, rapido y con confianza</h1>
        <p>
          Descubre productos seleccionados, seguimiento claro de pedidos y una experiencia
          disenada para que termines tu compra en minutos.
        </p>
        <div className="home-hero__actions">
          <Link className="btn btn-primary" to="/products">Ver catalogo</Link>
          <Link className="btn btn-ghost" to="/register">Crear cuenta</Link>
        </div>
      </article>

      <article id="quienes-somos" className="home-info-card">
        <h2>Quienes somos</h2>
        <p>
          Somos un ecommerce enfocado en calidad, entregas confiables y una experiencia de compra
          clara. Trabajamos con proveedores verificados para ofrecer productos utiles y precios
          competitivos.
        </p>
        <div className="home-info-card__metrics">
          <div>
            <strong>+1200</strong>
            <span>Clientes activos</span>
          </div>
          <div>
            <strong>24h</strong>
            <span>Tiempo medio de envio</span>
          </div>
          <div>
            <strong>98%</strong>
            <span>Satisfaccion de clientes</span>
          </div>
        </div>
      </article>

      <article className="home-carousel">
        <div className="home-carousel__head">
          <h2>Productos destacados</h2>
          <Link className="nav-link nav-link--pill" to="/products">Ver todos</Link>
        </div>

        {loading && <p>Cargando productos destacados...</p>}

        {!loading && featuredProducts.length === 0 && (
          <p>No hay productos disponibles por ahora.</p>
        )}

        {!loading && activeProduct && (
          <div className="home-carousel__track">
            <button
              type="button"
              className="carousel-btn"
              onClick={goToPrevious}
              aria-label="Producto anterior"
            >
              {"<"}
            </button>

            <article className="carousel-card">
              <img
                src={activeProduct.imageUrl || FALLBACK_IMAGE}
                alt={activeProduct.name}
              />
              <div className="carousel-card__content">
                <h3>{activeProduct.name}</h3>
                <p>{activeProduct.description}</p>
                <p className="product-card__price">${Number(activeProduct.price ?? 0).toFixed(2)}</p>
              </div>
            </article>

            <button
              type="button"
              className="carousel-btn"
              onClick={goToNext}
              aria-label="Siguiente producto"
            >
              {">"}
            </button>
          </div>
        )}

        {!loading && featuredProducts.length > 1 && (
          <div className="carousel-dots">
            {featuredProducts.map((product, index) => (
              <button
                key={product.id}
                type="button"
                aria-label={`Ir al producto ${index + 1}`}
                className={index === currentSlide ? "is-active" : ""}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        )}
      </article>

      <article className="home-location">
        <div className="home-location__content">
          <h2>Ubicacion y atencion</h2>
          <p>
            Encuentranos en Av. Reforma 123, Ciudad de Mexico. Atendemos de lunes a sabado
            de 9:00 a 19:00.
          </p>
          <a
            href="https://maps.google.com/?q=Av.+Paseo+de+la+Reforma+123,+Ciudad+de+Mexico"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
          >
            Abrir en Google Maps
          </a>
          <a
            href="mailto:ventas@miecommerce.com?subject=Consulta%20sobre%20mi%20pedido"
            className="btn btn-primary"
          >
            Contactanos por correo
          </a>
        </div>

        <iframe
          title="Ubicacion de la tienda"
          src="https://www.google.com/maps?q=Av.+Paseo+de+la+Reforma+123,+Ciudad+de+Mexico&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </article>
    </section>
  );
}

export default Home;
