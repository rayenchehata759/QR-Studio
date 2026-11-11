const componentFiles = [
  "header.html",
  "hero.html",
  "generator.html",
  "how-it-works.html",
  "benefits.html",
  "footer.html",
];

async function loadComponents() {
  const content = document.getElementById("app-content");

  try {
    const components = await Promise.all(
      componentFiles.map(async (fileName) => {
        const response = await fetch(`components/${fileName}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Unable to load component: ${fileName}`);
        }
        return response.text();
      }),
    );

    const [header, hero, generator, howItWorks, benefits, footer] = components;

    content.innerHTML = `
      ${header}
      <main class="w-full pt-16 bg-background min-h-screen">
        <div class="flex flex-col w-full relative">
          <div class="absolute inset-0 pointer-events-none -z-10 bg-[linear-gradient(to_right,#EFEBE5_1px,transparent_1px),linear-gradient(to_bottom,#EFEBE5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
          ${hero}
          ${generator}
          ${howItWorks}
          ${benefits}
        </div>
      </main>
      ${footer}
    `;
    if (typeof initializeQrGeneration === "function") {
      initializeQrGeneration();
    }
  } catch (error) {
    console.error(error);
    content.innerHTML =
      '<p class="component-error">Unable to load the application components.</p>';
  }
}

loadComponents();

let currentPayloadType = "url";
let currentExportFormat = "PNG";
window.qrExportFormat = currentExportFormat;

function switchPayloadTab(type) {
  currentPayloadType = type;

  const tabs = ["url", "text", "wifi", "whatsapp"];
  tabs.forEach((t) => {
    const btn = document.getElementById("tab-" + t);
    const panel = document.getElementById("form-panel-" + t);
    if (t === type) {
      btn.className =
        "payload-tab flex-1 py-2 px-3 rounded font-label-md text-xs text-on-surface bg-surface-container-lowest border border-[#DCD8D0] shadow-xs flex items-center justify-center gap-2 transition-all font-semibold";
      const icon = btn.querySelector(".material-symbols-outlined");
      if (icon)
        icon.className =
          "material-symbols-outlined text-[17px] text-primary-container";
      if (panel) panel.classList.remove("hidden");
    } else {
      btn.className =
        "payload-tab flex-1 py-2 px-3 rounded font-label-md text-xs text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-2 transition-all";
      const icon = btn.querySelector(".material-symbols-outlined");
      if (icon) icon.className = "material-symbols-outlined text-[17px]";
      if (panel) panel.classList.add("hidden");
    }
  });

  updatePreviewStatus();
}

function handleUrlInput(val) {
  const charCount = document.getElementById("char-count");
  const fullUrl = "https://" + (val || "");
  charCount.innerText = fullUrl.length + " chars";
  document.getElementById("preview-status-text").innerText =
    "Generated for " + fullUrl;
}

function clearUrlInput() {
  const input = document.getElementById("input-url");
  input.value = "";
  handleUrlInput("");
  input.focus();
}

function setExportFormat(fmt) {
  currentExportFormat = fmt;
  window.qrExportFormat = fmt;
  ["PNG", "SVG", "WEBP"].forEach((f) => {
    const btn = document.getElementById("fmt-" + f.toLowerCase());
    if (f === fmt) {
      btn.className =
        "px-2.5 py-1 rounded text-label-sm font-label-sm bg-surface-container-lowest text-on-surface shadow-xs font-semibold";
    } else {
      btn.className =
        "px-2.5 py-1 rounded text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface";
    }
  });
  document.getElementById("download-btn-label").innerText = "Download " + fmt;
}

function triggerGenerateEffect() {
  const qrBox = document.getElementById("qr-graphic-container");
  qrBox.classList.add("scale-98", "opacity-70");
  setTimeout(() => {
    qrBox.classList.remove("scale-98", "opacity-70");
  }, 180);
  const generators = {
    url: generateQrCode,
    text: generateTextQrCode,
    wifi: generateWifiQrCode,
    whatsapp: generateWhatsappQrCode,
  };
  if (generators[currentPayloadType]) {
    generators[currentPayloadType]();
  }
}

function resetParameters() {
  document.getElementById("input-url").value = "qrstudio.dev/launch";
  handleUrlInput("qrstudio.dev/launch");
  switchPayloadTab("url");
  setExportFormat("PNG");
}

function updatePreviewStatus() {
  const statusText = document.getElementById("preview-status-text");
  if (currentPayloadType === "url") {
    const val = document.getElementById("input-url").value;
    statusText.innerText = "Generated for https://" + val;
  } else if (currentPayloadType === "wifi") {
    const ssid = document.getElementById("wifi-ssid").value;
    statusText.innerText = "WIFI:S:" + ssid + ";T:WPA;P:********;;";
  } else if (currentPayloadType === "whatsapp") {
    statusText.innerText = "https://wa.me/14155552671?text=Hello";
  } else {
    statusText.innerText = "Plaintext encoded: 64 bytes";
  }
}
