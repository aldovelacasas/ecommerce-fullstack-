function WhatsAppFloat() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "525512345678";
  const message = encodeURIComponent("Hola, necesito ayuda con mi compra en Mi Ecommerce.");
  const href = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      className="whatsapp-float"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
    >
      WhatsApp
    </a>
  );
}

export default WhatsAppFloat;
