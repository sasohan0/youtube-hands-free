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

// 2. Clean Minimal Vector Animated Toolbar Icon Engine
function renderCleanVectorMotionIcon() {
  try {
    if (typeof OffscreenCanvas === "undefined") return;

    const canvas = new OffscreenCanvas(32, 32);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Transparent Background
    ctx.clearRect(0, 0, 32, 32);

    const time = frame * 0.12;
    const cycle = Math.floor(frame / 30) % 3;

    if (cycle === 0) {
      // SCENE 1: Clean Minimal Vector Skip Icon (⏩)
      const floatY = Math.sin(time * 3.5) * 1.2;
      ctx.save();
      ctx.translate(16, 16 + floatY);

      // Dark Slate Rounded Card Base
      ctx.fillStyle = "#0D1117";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-14, -14, 28, 28, 7);
      } else {
        ctx.rect(-14, -14, 28, 28);
      }
      ctx.fill();
      ctx.stroke();

      // Clean White Triangle 1
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.moveTo(-9, -6);
      ctx.lineTo(-1, 0);
      ctx.lineTo(-9, 6);
      ctx.closePath();
      ctx.fill();

      // Clean White Triangle 2
      ctx.beginPath();
      ctx.moveTo(-1, -6);
      ctx.lineTo(7, 0);
      ctx.lineTo(-1, 6);
      ctx.closePath();
      ctx.fill();

      // YouTube Red Accent Bar
      ctx.fillStyle = "#FF0050";
      ctx.fillRect(7, -6, 2.5, 12);

      // Electric Cyan Minimal Arc Accent
      ctx.strokeStyle = "#00F2FE";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, 11, -Math.PI / 4, Math.PI / 4);
      ctx.stroke();

      ctx.restore();
    } else if (cycle === 1) {
      // SCENE 2: Cyber Metallic Hand Tapping Skip Icon 👆⏩
      const tapOffset = Math.sin(time * 8) > 0 ? 2 : 0;
      ctx.save();
      ctx.translate(16, 16);

      // Card Base
      ctx.fillStyle = "#0D1117";
      ctx.strokeStyle = "#00F2FE";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-14, -14, 28, 28, 7);
      } else {
        ctx.rect(-14, -14, 28, 28);
      }
      ctx.fill();
      ctx.stroke();

      // Skip Arrow
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.moveTo(-5, -6);
      ctx.lineTo(2, 0);
      ctx.lineTo(-5, 6);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#FF0050";
      ctx.fillRect(2, -6, 2.5, 12);

      // Cyber Tapping Finger
      ctx.fillStyle = "#00F2FE";
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-2.5, -4 + tapOffset, 5, 14, 2.5);
      } else {
        ctx.rect(-2.5, -4 + tapOffset, 5, 14);
      }
      ctx.fill();

      // Tap Shockwave Ring
      if (tapOffset > 0) {
        ctx.strokeStyle = "rgba(0, 242, 254, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -4, 7, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    } else {
      // SCENE 3: Minimal Clean Cyberpunk Visor Emoji 🎧😎
      const headBob = Math.sin(time * 5) * 1.2;
      ctx.save();
      ctx.translate(16, 16 + headBob);

      // Dark Slate Head Base
      ctx.fillStyle = "#0D1117";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Clean Neon Cyan Visor Glasses 😎
      ctx.fillStyle = "#00F2FE";
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-9, -4, 18, 6, 2);
      } else {
        ctx.rect(-9, -4, 18, 6);
      }
      ctx.fill();

      // YouTube Red Smile Mouth
      ctx.strokeStyle = "#FF0050";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 2, 5, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      // Neon Magenta Headphones Arc
      ctx.strokeStyle = "#FF0050";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, -1, 14, Math.PI * 0.9, Math.PI * 2.1);
      ctx.stroke();

      // Cyber Ear Cups
      ctx.fillStyle = "#00F2FE";
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-15, -4, 3.5, 9, 1.5);
        ctx.roundRect(11.5, -4, 3.5, 9, 1.5);
      } else {
        ctx.rect(-15, -4, 3.5, 9);
        ctx.rect(11.5, -4, 3.5, 9);
      }
      ctx.fill();

      ctx.restore();
    }

    // Output Frame
    const imageData = ctx.getImageData(0, 0, 32, 32);
    chrome.action.setIcon({ imageData: imageData }, () => {
      if (chrome.runtime.lastError) {}
    });

    frame++;
  } catch (e) {}
}

setInterval(renderCleanVectorMotionIcon, 90);
