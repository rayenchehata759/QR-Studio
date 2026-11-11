function generateWhatsappQrCode() {
  const phoneInput = document.getElementById("whatsapp-phone");
  const messageInput = document.getElementById("whatsapp-message");

  if (!phoneInput || !messageInput) {
    throw new Error("WhatsApp fields not found");
  }

  const phone = phoneInput.value.replace(/\D/g, "");
  const message = messageInput.value.trim();

  if (!phone) {
    throw new Error("Enter a WhatsApp phone number before generating");
  }

  const payload = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  renderQrPayload(payload, `WhatsApp QR code generated for +${phone}`);
}
