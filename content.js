let settings = {
  isSkipperEnabled: true,
  isFastForwardEnabled: true,
  isVoiceControlEnabled: false,
  isUpcomingAlertEnabled: true,
};
let lastLogTime = 0;
let lastAlertTime = 0;
let recognition = null;

// 1. Sync Settings with UI Storage
chrome.storage.local.get(
  {
    isSkipperEnabled: true,
    isFastForwardEnabled: true,
    isVoiceControlEnabled: false,
    isUpcomingAlertEnabled: true,
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
  if (changes.isUpcomingAlertEnabled)
    settings.isUpcomingAlertEnabled = changes.isUpcomingAlertEnabled.newValue;
  if (changes.isVoiceControlEnabled) {
    settings.isVoiceControlEnabled = changes.isVoiceControlEnabled.newValue;
    toggleVoiceEngine(settings.isVoiceControlEnabled);
  }
});

// 2. History & Metrics Logger
function logSkipHistory() {
  if (Date.now() - lastLogTime > 3000) {
    lastLogTime = Date.now();
    const cleanTitle = (document.title || "Unknown")
      .replace(/^\(\d+\)\s*/, "")
      .replace(" - YouTube", "");
    chrome.storage.local.get(
      { skipCount: 0, skipHistory: [], timeSavedSeconds: 0 },
      (data) => {
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
          timeSavedSeconds: data.timeSavedSeconds + 15, // Approx 15s saved per ad
          skipHistory: history,
        });
      },
    );
  }
}

// 3. Ad Prediction Engine
function predictVideoAds() {
  const markers = document.querySelectorAll(
    ".ytp-ad-marker-container .ytp-ad-marker, .ytp-progress-bar .ytp-ad-marker",
  );
  let predictedCount = markers.length;

  // Fallback estimation if markers are not rendered yet based on video length
  const video = document.querySelector("video");
  if (
    predictedCount === 0 &&
    video &&
    isFinite(video.duration) &&
    video.duration > 0
  ) {
    const mins = video.duration / 60;
    if (mins > 20) predictedCount = Math.floor(mins / 7);
    else if (mins > 5) predictedCount = 2;
    else if (mins > 2) predictedCount = 1;
  }

  chrome.storage.local.set({ predictedAdCount: predictedCount });
  return markers;
}

// 4. Upcoming Ad Tooltip Announcement Engine
function checkUpcomingAds() {
  if (!settings.isUpcomingAlertEnabled || !settings.isSkipperEnabled) return;

  const video = document.querySelector("video");
  if (!video || !isFinite(video.duration) || video.paused) return;

  const markers = document.querySelectorAll(".ytp-ad-marker");
  const currentTime = video.currentTime;

  markers.forEach((marker) => {
    // Estimate marker position relative to video duration
    const styleLeft = parseFloat(marker.style.left);
    if (!isNaN(styleLeft)) {
      const markerTime = (styleLeft / 100) * video.duration;
      const diff = markerTime - currentTime;

      // Show alert if video is 1 to 5 seconds away from ad break
      if (diff > 0.5 && diff <= 5.5 && Date.now() - lastAlertTime > 12000) {
        lastAlertTime = Date.now();
        showUpcomingAdTooltip(Math.round(diff));
      }
    }
  });
}

// Glassmorphic Floating Tooltip Announcement for Upcoming Ads
function showUpcomingAdTooltip(secondsRemaining) {
  let tooltip = document.getElementById("yt-upcoming-ad-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "yt-upcoming-ad-tooltip";
    tooltip.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%) translateY(-15px);
      z-index: 99999;
      background: rgba(15, 17, 21, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(245, 158, 11, 0.5);
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 30px;
      font-family: 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      font-weight: 700;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(245, 158, 11, 0.35);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 10px;
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(tooltip);
  }

  tooltip.innerHTML = `
    <span style="color: #f59e0b; font-size: 16px;">⚡</span>
    <span>Upcoming Ad in ~${secondsRemaining}s</span>
    <span style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; padding: 2px 8px; border-radius: 12px; font-size: 11px;">Hands-Free Ready</span>
  `;

  tooltip.style.opacity = "1";
  tooltip.style.transform = "translateX(-50%) translateY(0)";

  clearTimeout(tooltip.timeout);
  tooltip.timeout = setTimeout(() => {
    tooltip.style.opacity = "0";
    tooltip.style.transform = "translateX(-50%) translateY(-15px)";
  }, 4000);
}

// 5. Main Execution Loop for Ad Skipping & Monitoring
setInterval(() => {
  predictVideoAds();
  checkUpcomingAds();

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

// 6. Voice Command Recognition Engine
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
