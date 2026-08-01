let settings = {
  isSkipperEnabled: true,
  isFastForwardEnabled: true,
  isVoiceControlEnabled: false,
};
let lastLogTime = 0;
let recognition = null;

// 1. Sync Settings with UI Storage
chrome.storage.local.get(
  {
    isSkipperEnabled: true,
    isFastForwardEnabled: true,
    isVoiceControlEnabled: false,
  },
  (res) => {
    settings = res;
    toggleVoiceEngine(settings.isVoiceControlEnabled);
  },
);

chrome.storage.onChanged.addListener((changes) => {
  if (changes.isSkipperEnabled)
    settings.isSkipperEnabled = changes.isSkipperEnabled.newValue;
  if (changes.isFastForwardEnabled)
    settings.isFastForwardEnabled = changes.isFastForwardEnabled.newValue;
  if (changes.isVoiceControlEnabled) {
    settings.isVoiceControlEnabled = changes.isVoiceControlEnabled.newValue;
    toggleVoiceEngine(settings.isVoiceControlEnabled);
  }
});

// 2. History Logger
function logSkipHistory() {
  if (Date.now() - lastLogTime > 3000) {
    lastLogTime = Date.now();
    const cleanTitle = (document.title || "Unknown")
      .replace(/^\(\d+\)\s*/, "")
      .replace(" - YouTube", "");
    chrome.storage.local.get({ skipCount: 0, skipHistory: [] }, (data) => {
      const history = [
        {
          title: cleanTitle,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        },
        ...data.skipHistory,
      ].slice(0, 5);

      chrome.storage.local.set({
        skipCount: data.skipCount + 1,
        skipHistory: history,
      });
    });
  }
}

// 3. Execution Loop for Ad Skipping
setInterval(() => {
  if (!settings.isSkipperEnabled) return;

  const video = document.querySelector("video");
  const adPlaying = document.querySelector(".ad-showing, .ad-interrupting");
  const skipBtn = document.querySelector(
    ".ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-skip-button",
  );

  // --- FEATURE A: Unskippable Fast-Forward ---
  if (settings.isFastForwardEnabled && adPlaying && !skipBtn) {
    if (video && isFinite(video.duration) && video.duration > 0) {
      if (video.currentTime < video.duration - 0.5) {
        video.playbackRate = 16.0;
        video.muted = true;
      }
    }
  }

  // --- FEATURE B: Hardware Skip Button Clicker ---
  if (skipBtn && skipBtn.offsetParent !== null && !skipBtn.dataset.clicked) {
    skipBtn.dataset.clicked = "true";

    const rect = skipBtn.getBoundingClientRect();
    const clickX = Math.round(rect.left + rect.width / 2);
    const clickY = Math.round(rect.top + rect.height / 2);

    chrome.runtime.sendMessage({
      action: "hardware_click",
      x: clickX,
      y: clickY,
    });

    logSkipHistory();

    setTimeout(() => {
      if (skipBtn) skipBtn.dataset.clicked = "";
    }, 2000);
  }

  // --- FEATURE C: Standard Banner & Overlay Closer ---
  document.querySelectorAll(".ytp-ad-overlay-close-button").forEach((btn) => {
    if (btn.offsetParent !== null) btn.click();
  });
}, 300);

// 4. Voice Command Recognition Engine
function toggleVoiceEngine(enable) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  if (enable) {
    if (!recognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const lastResultIndex = event.results.length - 1;
        const command = event.results[lastResultIndex][0].transcript
          .trim()
          .toLowerCase();

        handleVoiceCommand(command);
      };

      recognition.onend = () => {
        if (settings.isVoiceControlEnabled && recognition) {
          try {
            recognition.start();
          } catch (e) {}
        }
      };

      recognition.onerror = () => {
        if (settings.isVoiceControlEnabled && recognition) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {}
          }, 1000);
        }
      };
    }

    try {
      recognition.start();
    } catch (e) {}
  } else {
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {}
      recognition = null;
    }
  }
}

// Handle Recognized Voice Commands
function handleVoiceCommand(command) {
  const video = document.querySelector("video");
  const skipBtn = document.querySelector(
    ".ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-skip-button",
  );

  if (
    command.includes("skip") ||
    command.includes("skip ad") ||
    command.includes("next ad")
  ) {
    if (skipBtn && skipBtn.offsetParent !== null) {
      skipBtn.click();
      showVoiceToast("Skipped Ad ⏭️");
    } else {
      showVoiceToast("No Skip Button Present 🔍");
    }
  } else if (command.includes("pause")) {
    if (video) {
      video.pause();
      showVoiceToast("Paused ⏸️");
    }
  } else if (command.includes("play") || command.includes("start")) {
    if (video) {
      video.play();
      showVoiceToast("Playing ▶️");
    }
  } else if (command.includes("mute")) {
    if (video) {
      video.muted = true;
      showVoiceToast("Muted 🔇");
    }
  } else if (command.includes("unmute")) {
    if (video) {
      video.muted = false;
      showVoiceToast("Unmuted 🔊");
    }
  } else if (command.includes("speed up") || command.includes("fast")) {
    if (video) {
      video.playbackRate = 2.0;
      showVoiceToast("Speed 2.0x ⚡");
    }
  } else if (command.includes("normal speed") || command.includes("normal")) {
    if (video) {
      video.playbackRate = 1.0;
      showVoiceToast("Speed 1.0x 🎵");
    }
  }
}

// Glassmorphic Voice Toast Notification on YouTube Player
function showVoiceToast(text) {
  let toast = document.getElementById("yt-handsfree-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "yt-handsfree-toast";
    toast.style.cssText = `
      position: fixed;
      top: 70px;
      right: 30px;
      z-index: 99999;
      background: rgba(15, 17, 21, 0.85);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 0, 80, 0.4);
      color: #ffffff;
      padding: 10px 18px;
      border-radius: 12px;
      font-family: 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      font-weight: 700;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 0, 80, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0;
      transform: translateY(-10px);
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>🎤 Voice Command:</span> <span style="color: #ff3377;">${text}</span>`;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
  }, 2500);
}
