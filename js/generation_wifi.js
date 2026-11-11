function generateWifiQrCode() {
  const ssidInput = document.getElementById("wifi-ssid");
  const securityInput = document.getElementById("wifi-security");
  const passwordInput = document.getElementById("wifi-password");

  if (!ssidInput || !securityInput || !passwordInput) {
    throw new Error("Wi-Fi fields not found");
  }

  const ssid = ssidInput.value.trim();
  const security = securityInput.value.startsWith("Open")
    ? "nopass"
    : securityInput.value.startsWith("WEP")
      ? "WEP"
      : "WPA";
  const password = passwordInput.value;

  if (!ssid || (security !== "nopass" && !password)) {
    throw new Error("Complete the Wi-Fi network fields before generating");
  }

  const payload = `WIFI:T:${security};S:${escapeWifiValue(ssid)};P:${escapeWifiValue(password)};;`;
  renderQrPayload(payload, `Wi-Fi QR code generated for ${ssid}`);
}

function escapeWifiValue(value) {
  return value.replace(/[\\;,":]/g, "\\$&");
}
