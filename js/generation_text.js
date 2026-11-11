function generateTextQrCode() {
  const input = document.getElementById("text-content");
  if (!input || !input.value.trim()) {
    throw new Error("Enter text before generating the QR code");
  }

  const payload = input.value.trim();
  renderQrPayload(payload, "Plain text QR code generated");
}
