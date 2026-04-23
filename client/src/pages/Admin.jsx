import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../services/productService";

function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmitProduct = async (productData) => {
    try {
      setError("");

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        setEditingProduct(null);
      } else {
        await createProduct(productData);
      }

      await loadProducts();
    } catch (err) {
      setError(err.message || "Error al guardar el producto");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Seguro que quieres eliminar este producto?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      await deleteProduct(id);

      if (editingProduct && editingProduct.id === id) {
        setEditingProduct(null);
      }

      await loadProducts();
    } catch (err) {
      setError(err.message || "Error al eliminar el producto");
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <section>
      <h1>Panel de administracion</h1>
      <p>Aqui puedes crear, editar y eliminar productos.</p>

      <ProductForm
        onSubmit={handleSubmitProduct}
        editingProduct={editingProduct}
        onCancelEdit={handleCancelEdit}
      />

      {loading && <p>Cargando productos...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>No hay productos todavia.</p>
      )}

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        ))}
      </div>
    </section>
  );
}

export default Admin;
