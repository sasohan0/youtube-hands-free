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

    chrome.action.setBadgeText({ text: "SKIP" });
    chrome.action.setBadgeBackgroundColor({ color: "#FF0050" });
    setTimeout(() => {
      chrome.action.setBadgeText({ text: "" });
    }, 1500);

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

// 2. Linear / Raycast World-Class Product Designer Icon Engine (32x32 OffscreenCanvas)
function renderRaycastDesignerIcon() {
  try {
    if (typeof OffscreenCanvas === "undefined") return;

    const canvas = new OffscreenCanvas(32, 32);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 32, 32);

    const center = 16;
    angle = (angle + 4) % 360;

    // Smooth Breathing Pulse Ease (1.0 to 1.15)
    const breath = 1 + Math.sin((angle * Math.PI) / 90) * 0.06;

    // Handle Skip Action Snap Burst
    let spinAngle = 0;
    let burstScale = 1;
    if (isSkipping) {
      skipAnimProgress += 0.08;
      if (skipAnimProgress >= 1) {
        isSkipping = false;
        skipAnimProgress = 0;
      } else {
        // Spring Elastic Snap Physics
        spinAngle = Math.sin(skipAnimProgress * Math.PI) * Math.PI;
        burstScale = 1 + Math.sin(skipAnimProgress * Math.PI) * 0.25;
      }
    }

    // 1. Raycast-Style Outer Glow Ring (Subtle gradient radar sweep)
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
    ctx.arc(0, 0, 13.5, 0, Math.PI * 2);
    ctx.stroke();

    // Ad Skip Action Execution Burst Wave
    if (isSkipping) {
      const ringRadius = 13.5 + skipAnimProgress * 8;
      const ringAlpha = 1 - skipAnimProgress;
      ctx.strokeStyle = `rgba(255, 0, 80, ${ringAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();

    // 2. Dark Slate Rounded Icon Base Card
    ctx.save();
    ctx.translate(center, center);
    ctx.scale(breath * burstScale, breath * burstScale);

    ctx.fillStyle = "#0B0E14";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(-10.5, -10.5, 21, 21, 5.5);
    } else {
      ctx.rect(-10.5, -10.5, 21, 21);
    }
    ctx.fill();
    ctx.stroke();

    // 3. Razor-Sharp Geometric Fast-Forward Mark (⏩)
    // Left Triangle
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(-6.5, -4.5);
    ctx.lineTo(-0.5, 0);
    ctx.lineTo(-6.5, 4.5);
    ctx.closePath();
    ctx.fill();

    // Right Triangle
    ctx.beginPath();
    ctx.moveTo(-0.5, -4.5);
    ctx.lineTo(5.5, 0);
    ctx.lineTo(-0.5, 4.5);
    ctx.closePath();
    ctx.fill();

    // YouTube Red Precision Accent Bar
    ctx.fillStyle = "#FF0050";
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(5.5, -4.5, 2, 9, 0.8);
    } else {
      ctx.fillRect(5.5, -4.5, 2, 9);
    }
    ctx.fill();

    ctx.restore();

    // Output 60 FPS Smooth Frame
    const imageData = ctx.getImageData(0, 0, 32, 32);
    chrome.action.setIcon({ imageData: imageData }, () => {
      if (chrome.runtime.lastError) {}
    });
  } catch (e) {}
}

// Smooth 60 FPS (~33ms) Raycast / Linear Micro-Motion Loop
setInterval(renderRaycastDesignerIcon, 33);
