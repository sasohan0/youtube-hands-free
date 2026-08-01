let frame = 0;

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

// 2. After Effects Motion Graphics Toolbar Icon Engine
function renderAfterEffectsIcon() {
  try {
    if (typeof OffscreenCanvas === "undefined") return;

    const canvas = new OffscreenCanvas(32, 32);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 32, 32);

    const time = frame * 0.12;
    const cycle = Math.floor(frame / 32) % 3; // Morph between 3 icon motion scenes

    // Dark Glass Container Background
    ctx.fillStyle = "#090b10";
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(0, 0, 32, 32, 7);
    } else {
      ctx.rect(0, 0, 32, 32);
    }
    ctx.fill();

    // After Effects Motion Graphic: Expanding Radial Shockwave Ring
    const waveRadius = 3 + ((frame * 0.7) % 13);
    const waveOpacity = 1 - waveRadius / 13;
    ctx.strokeStyle = `rgba(255, 0, 80, ${waveOpacity * 0.65})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(16, 16, waveRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Morphing Scene 1: Vibing Equalizer Spectrum Bars (Hands-Free Audio & Speech)
    if (cycle === 0) {
      const h1 = 6 + Math.sin(time * 3.5) * 4;
      const h2 = 11 + Math.cos(time * 4.5) * 5;
      const h3 = 8 + Math.sin(time * 5.5) * 4;
      const h4 = 5 + Math.cos(time * 3) * 3;

      ctx.fillStyle = "#00F2FE";
      ctx.fillRect(7, 16 - h1 / 2, 3, h1);
      ctx.fillStyle = "#FF0050";
      ctx.fillRect(12, 16 - h2 / 2, 3, h2);
      ctx.fillStyle = "#8A2BE2";
      ctx.fillRect(17, 16 - h3 / 2, 3, h3);
      ctx.fillStyle = "#10B981";
      ctx.fillRect(22, 16 - h4 / 2, 3, h4);
    }
    // Morphing Scene 2: Cyber Lightning Spark ⚡ (Fast-Forward Energy)
    else if (cycle === 1) {
      ctx.save();
      ctx.translate(16, 16);
      const boltScale = 1 + Math.sin(time * 5) * 0.15;
      ctx.scale(boltScale, boltScale);

      const grad = ctx.createLinearGradient(-8, -8, 8, 8);
      grad.addColorStop(0, "#FF0050");
      grad.addColorStop(1, "#F59E0B");
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(1, -9);
      ctx.lineTo(-7, 2);
      ctx.lineTo(-1, 2);
      ctx.lineTo(-3, 9);
      ctx.lineTo(7, -2);
      ctx.lineTo(1, -2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    // Morphing Scene 3: Pulsing Play Button & Soundwave Arcs 🎧▶️
    else {
      ctx.save();
      ctx.translate(16, 16);

      // Play Core Triangle
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.moveTo(-4, -6);
      ctx.lineTo(6, 0);
      ctx.lineTo(-4, 6);
      ctx.closePath();
      ctx.fill();

      // Pulsing Dual Soundwave Arcs
      const arcGlow = ctx.createLinearGradient(-12, -12, 12, 12);
      arcGlow.addColorStop(0, "#8A2BE2");
      arcGlow.addColorStop(1, "#00F2FE");
      ctx.strokeStyle = arcGlow;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(0, 0, 11, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 11, (2 * Math.PI) / 3, (4 * Math.PI) / 3);
      ctx.stroke();

      ctx.restore();
    }

    // Output Frame to Extension Bar Icon
    const imageData = ctx.getImageData(0, 0, 32, 32);
    chrome.action.setIcon({ imageData: imageData }, () => {
      if (chrome.runtime.lastError) {}
    });

    frame++;
  } catch (e) {}
}

// 80ms Refresh Rate (~12.5 FPS smooth morphing)
setInterval(renderAfterEffectsIcon, 80);
