const qrApiUrl = "https://api.qrserver.com/v1/create-qr-code/";

function renderQrPayload(payload, status) {
  const qrSvg = document.getElementById("qr-vector-svg");
  const qrContainer = document.getElementById("qr-graphic-container");
  const previousQrImage = document.getElementById("qr-code-image");

  if (!qrSvg || !qrContainer) {
    throw new Error("QR preview container not found");
  }
  if (previousQrImage) {
    previousQrImage.remove();
  }

  const qrImage = document.createElement("img");
  qrImage.id = "qr-code-image";
  qrImage.alt = "Generated QR code";
  qrImage.className = "w-full h-full object-contain";
  qrImage.src = `${qrApiUrl}?size=1024x1024&ecc=H&format=svg&data=${encodeURIComponent(payload)}`;
  qrImage.addEventListener("error", () => {
    qrImage.remove();
    qrSvg.classList.remove("hidden");
    console.error("Unable to generate the QR code from the web API");
  }, { once: true });

  qrSvg.classList.add("hidden");
  qrContainer.appendChild(qrImage);
  document.getElementById("preview-status-text").innerText = status;
}

function getUrlPayload() {
  const input = document.getElementById("input-url");
  if (!input) {
    throw new Error("URL input not found");
  }

  const value = input.value.trim();
  if (!value) {
    throw new Error("Enter a URL before generating the QR code");
  }

  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function generateQrCode() {
  const payload = getUrlPayload();
  renderQrPayload(payload, `Generated for ${payload}`);
}

function initializeQrGeneration() {
  const input = document.getElementById("input-url");
  if (!input) {
    throw new Error("URL input not found");
  }

  generateQrCode();
}
