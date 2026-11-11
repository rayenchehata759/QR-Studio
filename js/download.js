function getQrDownloadUrl(format) {
  const qrImage = document.getElementById("qr-code-image");
  if (!qrImage || !qrImage.src) {
    throw new Error("Generate a QR code before downloading it");
  }

  const url = new URL(qrImage.src);
  url.searchParams.set("format", format === "WEBP" ? "png" : format.toLowerCase());
  return url.toString();
}

async function convertToWebp(blob) {
  const image = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  if (!context) {
    image.close();
    throw new Error("Unable to prepare the QR code for WEBP conversion");
  }
  context.drawImage(image, 0, 0);
  image.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob((webpBlob) => {
      if (!webpBlob) {
        reject(new Error("Unable to convert the QR code to WEBP"));
        return;
      }
      resolve(webpBlob);
    }, "image/webp");
  });
}

async function downloadQrCode() {
  const button = document.getElementById("btn-download");
  if (!button) {
    throw new Error("Download button not found");
  }

  const format = window.qrExportFormat || "PNG";
  const originalText = button.innerHTML;
  button.disabled = true;
  button.innerHTML =
    '<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span><span>Packaging ' +
    format +
    "...</span>";

  try {
    const response = await fetch(getQrDownloadUrl(format));
    if (!response.ok) {
      throw new Error(`QR download failed with status ${response.status}`);
    }

    let blob = await response.blob();
    if (format === "WEBP") {
      blob = await convertToWebp(blob);
    }
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `qr-code.${format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);

    button.innerHTML =
      '<span class="material-symbols-outlined text-[18px]">check</span><span>Saved to Downloads</span>';
    setTimeout(() => {
      button.innerHTML = originalText;
      button.disabled = false;
    }, 1800);
  } catch (error) {
    button.innerHTML = originalText;
    button.disabled = false;
    console.error(error);
    throw error;
  }
}
