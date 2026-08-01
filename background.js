let frame = 0;

// 1. Hardware Clicker Service via CDP
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "hardware_click" && sender.tab) {
    const tabId = sender.tab.id;

    // Show temporary SKIP badge on animated extension icon
    chrome.action.setBadgeText({ text: "SKIP" });
    chrome.action.setBadgeBackgroundColor({ color: "#00F2FE" });
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

// 2. Cyberpunk Animated Motion Toolbar Icon Engine
function renderCyberpunkMotionIcon() {
  try {
    if (typeof OffscreenCanvas === "undefined") return;

    const canvas = new OffscreenCanvas(32, 32);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 100% Transparent Background (No background fill)
    ctx.clearRect(0, 0, 32, 32);

    const time = frame * 0.12;
    const cycle = Math.floor(frame / 30) % 3; // Morph between 3 custom scenes

    if (cycle === 0) {
      // SCENE 1: Floating Modern Gray-Black Skip Button (⏭️)
      const floatY = Math.sin(time * 4) * 2;
      ctx.save();
      ctx.translate(16, 16 + floatY);

      // Modern Gray-Black Pill Container
      ctx.fillStyle = "#161b26";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-13, -8, 26, 16, 5);
      } else {
        ctx.rect(-13, -8, 26, 16);
      }
      ctx.fill();
      ctx.stroke();

      // Crisp White Skip Arrows (⏭)
      ctx.fillStyle = "#FFFFFF";

      ctx.beginPath();
      ctx.moveTo(-7, -4);
      ctx.lineTo(-1, 0);
      ctx.lineTo(-7, 4);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-1, -4);
      ctx.lineTo(5, 0);
      ctx.lineTo(-1, 4);
      ctx.closePath();
      ctx.fill();

      ctx.fillRect(5, -4, 2, 8);

      ctx.restore();
    } else if (cycle === 1) {
      // SCENE 2: Cyber Hand Tapping Modern Gray-Black Skip Button 👆⏭️
      const tapOffset = Math.sin(time * 8) > 0 ? 2 : 0;
      ctx.save();
      ctx.translate(16, 16);

      // Modern Gray-Black Skip Button Base
      ctx.fillStyle = "#161b26";
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-12, -10, 24, 14, 4);
      } else {
        ctx.rect(-12, -10, 24, 14);
      }
      ctx.fill();
      ctx.stroke();

      // Skip Arrow Icon
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.moveTo(-3, -7);
      ctx.lineTo(3, -3);
      ctx.lineTo(-3, 1);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(3, -7, 2, 8);

      // Cyber Metallic Hand Finger Tapping
      ctx.fillStyle = "#00F2FE"; // Neon Cyan cyber finger
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-2, -3 + tapOffset, 4, 12, 2);
      } else {
        ctx.rect(-2, -3 + tapOffset, 4, 12);
      }
      ctx.fill();

      // Click Shockwave Ripple Ring
      if (tapOffset > 0) {
        ctx.strokeStyle = "rgba(0, 242, 254, 0.85)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -3, 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    } else {
      // SCENE 3: Cyberpunk Vibing Emoji with Neon Visor & Headphones 🎧😎
      const headBob = Math.sin(time * 5) * 1.5;
      ctx.save();
      ctx.translate(16, 16 + headBob);

      // Dark Obsidian Emoji Face Base
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 1, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Neon Cyan Visor Glasses 😎
      ctx.fillStyle = "#00F2FE";
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-7, -3, 14, 5, 2);
      } else {
        ctx.rect(-7, -3, 14, 5);
      }
      ctx.fill();

      // Glowing Neon Magenta Smile Mouth
      ctx.strokeStyle = "#FF007F";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 2, 4, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      // Neon Magenta Cyber Headphones Arc
      ctx.strokeStyle = "#FF007F";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, 11, Math.PI * 0.9, Math.PI * 2.1);
      ctx.stroke();

      // Cyber Ear Cups
      ctx.fillStyle = "#00F2FE";
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-12, -2, 3, 7, 1);
        ctx.roundRect(9, -2, 3, 7, 1);
      } else {
        ctx.rect(-12, -2, 3, 7);
        ctx.rect(9, -2, 3, 7);
      }
      ctx.fill();

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

// 90ms Refresh Rate for smooth cyberpunk scene transitions
setInterval(renderCyberpunkMotionIcon, 90);
