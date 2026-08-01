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

// 2. Large Scale Cyberpunk Animated Motion Toolbar Icon Engine
function renderLargeCyberpunkMotionIcon() {
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
      // SCENE 1: Large Floating Modern Gray-Black Skip Button (⏭️)
      const floatY = Math.sin(time * 4) * 1.5;
      ctx.save();
      ctx.translate(16, 16 + floatY);

      // Large Modern Gray-Black Pill Container (29x18)
      ctx.fillStyle = "#161b26";
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-14.5, -9, 29, 18, 5);
      } else {
        ctx.rect(-14.5, -9, 29, 18);
      }
      ctx.fill();
      ctx.stroke();

      // Large Crisp White Skip Arrows (⏭)
      ctx.fillStyle = "#FFFFFF";

      ctx.beginPath();
      ctx.moveTo(-8, -5);
      ctx.lineTo(-1, 0);
      ctx.lineTo(-8, 5);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-1, -5);
      ctx.lineTo(6, 0);
      ctx.lineTo(-1, 5);
      ctx.closePath();
      ctx.fill();

      ctx.fillRect(6, -5, 2.5, 10);

      ctx.restore();
    } else if (cycle === 1) {
      // SCENE 2: Cyber Hand Tapping Large Gray-Black Skip Button 👆⏭️
      const tapOffset = Math.sin(time * 8) > 0 ? 2 : 0;
      ctx.save();
      ctx.translate(16, 16);

      // Large Modern Gray-Black Skip Button Base
      ctx.fillStyle = "#161b26";
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-14, -11, 28, 16, 5);
      } else {
        ctx.rect(-14, -11, 28, 16);
      }
      ctx.fill();
      ctx.stroke();

      // Skip Arrow Icon
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.moveTo(-4, -8);
      ctx.lineTo(3, -3);
      ctx.lineTo(-4, 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(3, -8, 2.5, 10);

      // Enlarged Cyber Metallic Hand Finger Tapping
      ctx.fillStyle = "#00F2FE"; // Neon Cyan cyber finger
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-2.5, -3 + tapOffset, 5, 14, 2.5);
      } else {
        ctx.rect(-2.5, -3 + tapOffset, 5, 14);
      }
      ctx.fill();

      // Click Shockwave Ripple Ring
      if (tapOffset > 0) {
        ctx.strokeStyle = "rgba(0, 242, 254, 0.9)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, -3, 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    } else {
      // SCENE 3: Large Cyberpunk Vibing Emoji with Visor & Headphones (Maximized size) 🎧😎
      const headBob = Math.sin(time * 5) * 1.2;
      ctx.save();
      ctx.translate(16, 16 + headBob);

      // Large Dark Obsidian Emoji Face Base (Radius 12, filling bounds)
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Large Neon Cyan Visor Glasses 😎
      ctx.fillStyle = "#00F2FE";
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-9, -4, 18, 7, 2.5);
      } else {
        ctx.rect(-9, -4, 18, 7);
      }
      ctx.fill();

      // Glowing Neon Magenta Smile Mouth
      ctx.strokeStyle = "#FF007F";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 2, 5, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      // Large Neon Magenta Cyber Headphones Arc
      ctx.strokeStyle = "#FF007F";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, -1, 14, Math.PI * 0.9, Math.PI * 2.1);
      ctx.stroke();

      // Enlarged Cyber Ear Cups
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

    // Output Frame to Extension Bar Icon
    const imageData = ctx.getImageData(0, 0, 32, 32);
    chrome.action.setIcon({ imageData: imageData }, () => {
      if (chrome.runtime.lastError) {}
    });

    frame++;
  } catch (e) {}
}

// 90ms Refresh Rate for smooth cyberpunk scene transitions
setInterval(renderLargeCyberpunkMotionIcon, 90);
