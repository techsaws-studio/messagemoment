export const getDeviceFingerprint = () => {
  const STORAGE_KEY = "mm_device_fingerprint";

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      console.log("📱 Using stored fingerprint");
      return stored;
    }

    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
      navigator.maxTouchPoints || 0,
      navigator.platform,
      generateCanvasFingerprint(),
    ].join("|");

    let hash = 0;
    for (let i = 0; i < components.length; i++) {
      const char = components.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    const fingerprint = Math.abs(hash)
      .toString(16)
      .padStart(8, "0")
      .substring(0, 16);

    localStorage.setItem(STORAGE_KEY, fingerprint);
    console.log("🆕 Generated new fingerprint:", fingerprint);

    return fingerprint;
  } catch (error) {
    console.warn("Fingerprint generation failed:", error);
    const fallback = "fallback_" + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEY, fallback);
    return fallback;
  }
};

const generateCanvasFingerprint = () => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no-canvas";

    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillStyle = "#f60";
    ctx.fillRect(10, 10, 100, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("MM Device ID", 15, 15);

    return canvas.toDataURL().slice(-20);
  } catch (error) {
    return "canvas-error";
  }
};
