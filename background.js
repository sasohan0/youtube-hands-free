let angle = 0;

// 1. Hardware Clicker Service via CDP
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "hardware_click" && sender.tab) {
    const tabId = sender.tab.id;

    // Show temporary SKIP badge on animated extension icon
    chrome.action.setBadgeText({ text: "SKIP" });
    chrome.action.setBadgeBackgroundColor({ color: "#FF0050" });
    setTimeout(() => {
      chrome.action.setBadgeText({ text: "" });
    }, 1800);

    chrome.debugger.attach({ tabId: tabId }, "1.3", () => {
      if (chrome.runtime.lastError) return;

      // MOUSE DOWN
      chrome.debugger.sendCommand(
        { tabId: tabId },
        "Input.dispatchMouseEvent",
        {
          type: "mousePressed",
          x: message.x,
          y: message.y,
          button: "left",
          clickCount: 1,
        },
        () => {
          // MOUSE UP
          chrome.debugger.sendCommand(
            { tabId: tabId },
            "Input.dispatchMouseEvent",
            {
              type: "mouseReleased",
              x: message.x,
              y: message.y,
              button: "left",
              clickCount: 1,
            },
            () => {
              chrome.debugger.detach({ tabId: tabId });
            },
          );
        },
      );
    });
  }
});

// 2. Live Animated Extension Bar Icon Engine
function renderLiveIconFrame() {
  try {
    if (typeof OffscreenCanvas === "undefined") return;

    const canvas = new OffscreenCanvas(32, 32);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 32, 32);

    // Dark sleek background
    ctx.fillStyle = "#0b0d13";
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(1, 1, 30, 30, 7);
    } else {
      ctx.rect(1, 1, 30, 30);
    }
    ctx.fill();

    // Animated Rotating Gradient Arc Ring
    ctx.save();
    ctx.translate(16, 16);
    ctx.rotate((angle * Math.PI) / 180);

    const grad = ctx.createLinearGradient(-16, -16, 16, 16);
    grad.addColorStop(0, "#FF0050");
    grad.addColorStop(0.5, "#8A2BE2");
    grad.addColorStop(1, "#00F2FE");

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 1.55);
    ctx.stroke();
    ctx.restore();

    // Pulsing Central Play Triangle Icon
    const scale = 1 + Math.sin((angle * Math.PI) / 90) * 0.12;
    ctx.save();
    ctx.translate(16, 16);
    ctx.scale(scale, scale);

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(-3, -6);
    ctx.lineTo(6, 0);
    ctx.lineTo(-3, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    const imageData = ctx.getImageData(0, 0, 32, 32);
    chrome.action.setIcon({ imageData: imageData }, () => {
      if (chrome.runtime.lastError) {}
    });

    angle = (angle + 12) % 360;
  } catch (e) {}
}

// Animate frame every 120ms
setInterval(renderLiveIconFrame, 120);
