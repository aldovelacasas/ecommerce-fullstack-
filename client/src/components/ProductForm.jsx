import { useEffect, useState } from "react";

function ProductForm({ onSubmit, editingProduct, onCancelEdit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: ""
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        price: editingProduct.price || "",
        stock: editingProduct.stock || "",
        imageUrl: editingProduct.imageUrl || ""
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: ""
      });
    }
  }, [editingProduct]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{editingProduct ? "Editar producto" : "Crear producto"}</h2>

      <input
        type="text"
        name="name"
        placeholder="Nombre"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Descripcion"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="price"
        placeholder="Precio"
        value={formData.price}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="imageUrl"
        placeholder="URL de imagen"
        value={formData.imageUrl}
        onChange={handleChange}
      />

      <div className="product-form__actions">
        <button type="submit">
          {editingProduct ? "Actualizar producto" : "Guardar producto"}
        </button>

        {editingProduct && (
          <button type="button" className="secondary-btn" onClick={onCancelEdit}>
            Cancelar edicion
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
