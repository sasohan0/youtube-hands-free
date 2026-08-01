let angle = 0;
let isSkipping = false;
let skipAnimProgress = 0;

// 1. Hardware Clicker Service via CDP
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "hardware_click" && sender.tab) {
    const tabId = sender.tab.id;

    // Trigger Raycast-style Instant Execution Snap & Neon Ripple Burst
    isSkipping = true;
    skipAnimProgress = 0;

    try {
      chrome.action.setBadgeText({ text: "SKIP" });
      chrome.action.setBadgeBackgroundColor({ color: "#FF0050" });
      setTimeout(() => {
        try {
          chrome.action.setBadgeText({ text: "" });
        } catch (e) {}
      }, 1500);
    } catch (e) {}

    chrome.debugger.attach({ tabId: tabId }, "1.3", () => {
      if (chrome.runtime.lastError) return; // Reading lastError handles the error cleanly

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
          if (chrome.runtime.lastError) return;
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
              if (chrome.runtime.lastError) return;
              try {
                chrome.debugger.detach({ tabId: tabId }, () => {
                  if (chrome.runtime.lastError) {}
                });
              } catch (e) {}
            },
          );
        },
      );
    });
  }
});

// 2. Large Scale Raycast / Linear Designer Icon Engine (Fills full 32x32 Toolbar Space)
function renderRaycastDesignerIcon() {
  try {
    if (typeof OffscreenCanvas === "undefined") return;

    const canvas = new OffscreenCanvas(32, 32);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 32, 32);

    const center = 16;
    angle = (angle + 4) % 360;

    // Smooth Breathing Pulse Ease
    const breath = 1 + Math.sin((angle * Math.PI) / 90) * 0.04;

    // Handle Skip Action Snap Burst
    let spinAngle = 0;
    let burstScale = 1;
    if (isSkipping) {
      skipAnimProgress += 0.08;
      if (skipAnimProgress >= 1) {
        isSkipping = false;
        skipAnimProgress = 0;
      } else {
        spinAngle = Math.sin(skipAnimProgress * Math.PI) * Math.PI;
        burstScale = 1 + Math.sin(skipAnimProgress * Math.PI) * 0.2;
      }
    }

    // 1. Raycast Conic Radar Sweep Ring (Maximizing Outer Margin)
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((angle * Math.PI) / 180 + spinAngle);

    const ringGrad = ctx.createConicGradient(0, 0, 0);
    ringGrad.addColorStop(0, "rgba(0, 242, 254, 0.95)");
    ringGrad.addColorStop(0.35, "rgba(255, 0, 80, 0.85)");
    ringGrad.addColorStop(0.7, "rgba(138, 43, 226, 0.4)");
    ringGrad.addColorStop(1, "rgba(0, 242, 254, 0.05)");

    ctx.strokeStyle = ringGrad;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.stroke();

    // Ad Skip Action Execution Burst Wave
    if (isSkipping) {
      const ringRadius = 15 + skipAnimProgress * 6;
      const ringAlpha = 1 - skipAnimProgress;
      ctx.strokeStyle = `rgba(255, 0, 80, ${ringAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();

    // 2. Large Dark Obsidian Rounded Card (28x28px - Max Visibility!)
    ctx.save();
    ctx.translate(center, center);
    ctx.scale(breath * burstScale, breath * burstScale);

    ctx.fillStyle = "#0D1117";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(-14, -14, 28, 28, 6);
    } else {
      ctx.rect(-14, -14, 28, 28);
    }
    ctx.fill();
    ctx.stroke();

    // 3. Large Crisp Fast-Forward Arrows (⏩)
    // Left Triangle
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(-9, -6.5);
    ctx.lineTo(-1, 0);
    ctx.lineTo(-9, 6.5);
    ctx.closePath();
    ctx.fill();

    // Right Triangle
    ctx.beginPath();
    ctx.moveTo(-1, -6.5);
    ctx.lineTo(7, 0);
    ctx.lineTo(-1, 6.5);
    ctx.closePath();
    ctx.fill();

    // YouTube Red Precision Accent Bar
    ctx.fillStyle = "#FF0050";
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(7, -6.5, 2.5, 13, 1);
    } else {
      ctx.fillRect(7, -6.5, 2.5, 13);
    }
    ctx.fill();

    ctx.restore();

    // Output 60 FPS Smooth Frame
    const imageData = ctx.getImageData(0, 0, 32, 32);
    chrome.action.setIcon({ imageData: imageData }, () => {
      // Reading lastError clears Chrome's uncaught error queue
      const err = chrome.runtime.lastError;
    });
  } catch (e) {}
}

// Smooth 60 FPS (~33ms) Raycast / Linear Micro-Motion Loop
setInterval(renderRaycastDesignerIcon, 33);
