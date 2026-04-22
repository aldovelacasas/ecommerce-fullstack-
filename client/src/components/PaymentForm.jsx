import { useState } from "react";

function PaymentForm({ onSubmit, isProcessing }) {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    paymentMethod: "credit"
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cardName.trim()) {
      newErrors.cardName = "Nombre en la tarjeta es requerido";
    }

    if (!formData.cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
      newErrors.cardNumber = "Numero de tarjeta debe tener 16 digitos";
    }

    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      newErrors.expiryDate = "Fecha de expiracion debe ser MM/YY";
    }

    if (!formData.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = "CVV debe tener 3 o 4 digitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formatCardNumber = (value) => {
    const numbersOnly = value.replace(/\s+/g, "").replace(/[^0-9]/g, "");
    const match = (numbersOnly.match(/\d{1,16}/) || [""])[0];
    const parts = [];

    for (let index = 0; index < match.length; index += 4) {
      parts.push(match.substring(index, index + 4));
    }

    return parts.join(" ");
  };

  const handleCardNumberChange = (event) => {
    const formatted = formatCardNumber(event.target.value);
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label>Metodo de pago</label>
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="credit">Tarjeta de credito</option>
          <option value="debit">Tarjeta de debito</option>
        </select>
      </div>

      <div className="form-group">
        <label>Numero de tarjeta</label>
        <input
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleCardNumberChange}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          className={errors.cardNumber ? "error" : ""}
        />
        {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
      </div>

      <div className="form-group">
        <label>Nombre en la tarjeta</label>
        <input
          type="text"
          name="cardName"
          value={formData.cardName}
          onChange={handleChange}
          placeholder="Juan Perez"
          className={errors.cardName ? "error" : ""}
        />
        {errors.cardName && <span className="error-text">{errors.cardName}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Fecha de expiracion</label>
          <input
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            maxLength="5"
            className={errors.expiryDate ? "error" : ""}
          />
          {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
        </div>

        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            maxLength="4"
            className={errors.cvv ? "error" : ""}
          />
          {errors.cvv && <span className="error-text">{errors.cvv}</span>}
        </div>
      </div>

      <button type="submit" className="payment-btn" disabled={isProcessing}>
        {isProcessing ? "Procesando..." : "Pagar ahora"}
      </button>
    </form>
  );
}

export default PaymentForm;
