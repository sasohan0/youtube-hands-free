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

// 2. Custom Vibing & Hand-Tapping Animated Toolbar Icon Engine
function renderVibingHandsFreeIcon() {
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
      // SCENE 1: Floating Skip Button (⏭️)
      const floatY = Math.sin(time * 4) * 2;
      ctx.save();
      ctx.translate(16, 16 + floatY);

      // Skip Button Pill Container
      ctx.fillStyle = "#FF0050";
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-13, -8, 26, 16, 5);
      } else {
        ctx.rect(-13, -8, 26, 16);
      }
      ctx.fill();

      // Skip Icon Arrows (⏭)
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
      // SCENE 2: Hand Tapping the Skip Button 👆⏭️
      const tapOffset = Math.sin(time * 8) > 0 ? 2 : 0;
      ctx.save();
      ctx.translate(16, 16);

      // Skip Button Base
      ctx.fillStyle = "rgba(255, 0, 80, 0.9)";
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-12, -10, 24, 14, 4);
      } else {
        ctx.rect(-12, -10, 24, 14);
      }
      ctx.fill();

      // Skip Arrow Icon
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.moveTo(-3, -7);
      ctx.lineTo(3, -3);
      ctx.lineTo(-3, 1);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(3, -7, 2, 8);

      // Floating Hand Tapping Finger 👆
      ctx.fillStyle = "#F59E0B";
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(-2, -3 + tapOffset, 4, 12, 2);
      } else {
        ctx.rect(-2, -3 + tapOffset, 4, 12);
      }
      ctx.fill();

      // Click Shockwave Ripple Ring
      if (tapOffset > 0) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -3, 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    } else {
      // SCENE 3: Vibing Emoji with Headphones, Closed Eyes & Smile 🎧😌🎵
      const headBob = Math.sin(time * 5) * 1.5;
      ctx.save();
      ctx.translate(16, 16 + headBob);

      // Yellow Emoji Head
      ctx.fillStyle = "#F59E0B";
      ctx.beginPath();
      ctx.arc(0, 1, 9, 0, Math.PI * 2);
      ctx.fill();

      // Closed Smiling Eyes (Arcs ^ ^)
      ctx.strokeStyle = "#451a03";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(-4, -1, 2.5, Math.PI, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(4, -1, 2.5, Math.PI, 0);
      ctx.stroke();

      // Happy Smile Arc 😊
      ctx.beginPath();
      ctx.arc(0, 2, 4, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();

      // Neon Headphones Arc
      ctx.strokeStyle = "#00F2FE";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 11, Math.PI * 0.9, Math.PI * 2.1);
      ctx.stroke();

      // Headphone Ear Cups
      ctx.fillStyle = "#FF0050";
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

// 90ms Refresh Rate for smooth scene transitions
setInterval(renderVibingHandsFreeIcon, 90);
