let settings = {
  isSkipperEnabled: true,
  isFairPlayEnabled: false,
  isFastForwardEnabled: true,
  isVoiceControlEnabled: false,
  isUpcomingAlertEnabled: true,
  isHighBitrateEnabled: true,
  isAudioBoostEnabled: false,
  isScreenshotEnabled: true,
  isPipEnabled: true,
  sleepTimerMinutes: 0,
  isAutoTheaterEnabled: false,
  isAntiDistractionEnabled: false,
  isSpeedScrollEnabled: true,
};
let lastLogTime = 0;
let lastAlertTime = 0;
let lastQualityCheck = 0;
let lastTheaterCheck = 0;
let recognition = null;
let audioCtx = null;
let audioSource = null;
let gainNode = null;
let vocalFilter = null;
let sleepTimerId = null;

// Helper: Safely check if Extension Context is active
function isContextValid() {
  try {
    return typeof chrome !== "undefined" && !!chrome.runtime && !!chrome.runtime.id;
  } catch (e) {
    return false;
  }
}

// 1. Sync Settings with Storage
function applyAllSettings() {
  toggleVoiceEngine(settings.isVoiceControlEnabled);
  toggleAntiDistractionCSS(settings.isAntiDistractionEnabled);
  toggleAudioBooster(settings.isAudioBoostEnabled);
  setupSleepTimer(settings.sleepTimerMinutes);
  injectScreenshotButton();
}

if (isContextValid()) {
  try {
    chrome.storage.local.get(null, (res) => {
      if (chrome.runtime.lastError) return;
      if (!isContextValid()) return;
      if (res) {
        settings = { ...settings, ...res };
        applyAllSettings();
      }
    });

    chrome.storage.onChanged.addListener((changes) => {
      if (!isContextValid()) return;
      try {
        for (let key in changes) {
          if (key in settings) {
            settings[key] = changes[key].newValue;
          }
        }
        applyAllSettings();
        if (changes.isAutoTheaterEnabled && settings.isAutoTheaterEnabled) {
          lastTheaterCheck = 0;
        }
      } catch (e) {}
    });
  } catch (e) {}
}

// 2. Web Audio Vocal Booster & EQ Engine (+6dB Vocal & Volume Boost)
function toggleAudioBooster(enable) {
  const video = document.querySelector("video");
  if (!video) return;

  try {
    if (enable) {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioSource = audioCtx.createMediaElementSource(video);
        gainNode = audioCtx.createGain();
        vocalFilter = audioCtx.createBiquadFilter();

        vocalFilter.type = "peaking";
        vocalFilter.frequency.value = 2000;
        vocalFilter.Q.value = 1.0;
        vocalFilter.gain.value = 6;

        gainNode.gain.value = 1.35;

        audioSource.connect(vocalFilter);
        vocalFilter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
    } else {
      if (audioCtx && gainNode) {
        gainNode.gain.value = 1.0;
        if (vocalFilter) vocalFilter.gain.value = 0;
      }
    }
  } catch (e) {}
}

// 3. Clean 4K Frame Screenshot Engine (Hotkey: Alt+S & Player Bar Button 📸)
function captureCleanScreenshot() {
  const video = document.querySelector("video");
  if (!video || video.readyState < 2) {
    showVoiceToast("Video not ready for screenshot 🔍");
    return;
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const cleanTitle = (document.title || "video")
      .replace(/^\(\d+\)\s*/, "")
      .replace(" - YouTube", "")
      .replace(/[^a-z0-9]/gi, "_");
    const timeStr = Math.floor(video.currentTime) + "s";

    const link = document.createElement("a");
    link.download = `YouTube_${cleanTitle}_${timeStr}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    showVoiceToast("Captured Clean 4K Frame Screenshot 📸");
  } catch (err) {
    showVoiceToast("Screenshot capture error ⚠️");
  }
}

function injectScreenshotButton() {
  if (!settings.isScreenshotEnabled) {
    const existing = document.getElementById("yt-handsfree-ss-btn");
    if (existing) existing.remove();
    return;
  }

  const rightControls = document.querySelector(".ytp-right-controls");
  if (!rightControls || document.getElementById("yt-handsfree-ss-btn")) return;

  const btn = document.createElement("button");
  btn.id = "yt-handsfree-ss-btn";
  btn.className = "ytp-button";
  btn.title = "Capture Clean 4K Frame Screenshot (Alt+S)";
  btn.style.cssText =
    "display: inline-flex; align-items: center; justify-content: center; font-size: 16px; width: 36px; height: 100%; cursor: pointer; transition: transform 0.2s ease;";
  btn.innerHTML = "📸";

  btn.addEventListener("mouseenter", () => (btn.style.transform = "scale(1.2)"));
  btn.addEventListener("mouseleave", () => (btn.style.transform = "scale(1.0)"));

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    captureCleanScreenshot();
  });

  rightControls.insertBefore(btn, rightControls.firstChild);
}

// Hotkey Listener (Clean 4K Screenshot: Alt+S | Picture-in-Picture: Alt+P)
window.addEventListener(
  "keydown",
  (e) => {
    if (!isContextValid()) return;

    // A. Clean 4K Video Frame Screenshot (Alt + S)
    if (e.altKey && (e.key === "s" || e.key === "S")) {
      if (!settings.isScreenshotEnabled) return;
      e.preventDefault();
      captureCleanScreenshot();
    }

    // B. Floating Picture-in-Picture Mode (Alt + P)
    if (e.altKey && (e.key === "p" || e.key === "P")) {
      if (!settings.isPipEnabled) return;
      const video = document.querySelector("video");
      if (!video) return;

      e.preventDefault();
      try {
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture();
          showVoiceToast("Exited Floating Window 📺");
        } else {
          video.requestPictureInPicture();
          showVoiceToast("Floating Picture-in-Picture Mode 📺");
        }
      } catch (err) {}
    }
  },
  { capture: true },
);

// 4. Hands-Free Sleep Timer Engine
function setupSleepTimer(minutes) {
  if (sleepTimerId) clearTimeout(sleepTimerId);
  if (!minutes || minutes <= 0) return;

  showVoiceToast(`Sleep Timer Set: ${minutes} Mins 💤`);

  sleepTimerId = setTimeout(() => {
    const video = document.querySelector("video");
    if (video) {
      video.pause();
      showVoiceToast("Sleep Timer Ended: Video Paused 💤");
    }
  }, minutes * 60 * 1000);
}

// 5. Upcoming Ad Alert Engine
function checkUpcomingAds() {
  if (!isContextValid()) return;
  if (!settings.isUpcomingAlertEnabled || !settings.isSkipperEnabled) return;

  const video = document.querySelector("video");
  if (!video || !isFinite(video.duration) || video.paused) return;

  const adShowing = document.querySelector(".ad-showing, .ad-interrupting");
  if (adShowing) return;

  const markers = document.querySelectorAll(
    ".ytp-ad-marker, .ytp-ad-marker-container .ytp-ad-marker",
  );
  const currentTime = video.currentTime;
  const duration = video.duration;

  markers.forEach((marker) => {
    let styleLeft = parseFloat(marker.style.left);
    if (!isNaN(styleLeft) && duration > 0) {
      const markerTime = (styleLeft / 100) * duration;
      const diff = markerTime - currentTime;

      if (diff > 0.5 && diff <= 8.0 && Date.now() - lastAlertTime > 10000) {
        lastAlertTime = Date.now();
        showUpcomingAdTooltip(Math.round(diff));
      }
    }
  });
}

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
      z-index: 999999;
      background: rgba(15, 17, 21, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(245, 158, 11, 0.6);
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

// 6. Dual High Bitrate & 1080p Premium Enhanced Bitrate Engine
function enforceEnhancedBitrate() {
  if (!isContextValid()) return;
  if (!settings.isHighBitrateEnabled) return;
  if (Date.now() - lastQualityCheck < 3500) return;
  lastQualityCheck = Date.now();

  const player = document.querySelector("#movie_player, .html5-video-player");

  if (player) {
    try {
      if (typeof player.getAvailableQualityLevels === "function") {
        const levels = player.getAvailableQualityLevels();
        if (Array.isArray(levels) && levels.length > 0) {
          const targetQuality =
            levels.find((l) =>
              ["highres", "hd2160", "hd1440", "hd1080"].includes(l),
            ) || levels[0];

          if (
            typeof player.getPlaybackQuality === "function" &&
            player.getPlaybackQuality() !== targetQuality
          ) {
            if (typeof player.setPlaybackQualityRange === "function") {
              player.setPlaybackQualityRange(targetQuality, targetQuality);
            }
            if (typeof player.setPlaybackQuality === "function") {
              player.setPlaybackQuality(targetQuality);
            }
          }
        }
      }
    } catch (e) {}
  }

  try {
    const menuItems = document.querySelectorAll(
      ".ytp-panel-menu .ytp-menuitem, .ytp-quality-menu .ytp-menuitem",
    );
    menuItems.forEach((item) => {
      const text = (item.textContent || "").toLowerCase();
      if (
        (text.includes("1080p premium") || text.includes("enhanced bitrate")) &&
        !item.classList.contains("ytp-button-active") &&
        item.getAttribute("aria-checked") !== "true"
      ) {
        item.click();
        showVoiceToast("Unlocked 1080p Premium Enhanced Bitrate ⚡");
      }
    });
  } catch (e) {}
}

// 7. Auto Theater Mode Engine
function enforceAutoTheater() {
  if (!isContextValid()) return;
  if (!settings.isAutoTheaterEnabled) return;
  if (Date.now() - lastTheaterCheck < 4000) return;

  const watchFlexy = document.querySelector("ytd-watch-flexy");
  if (watchFlexy && !watchFlexy.hasAttribute("theater")) {
    lastTheaterCheck = Date.now();

    const sizeBtn = document.querySelector(".ytp-size-button");
    if (sizeBtn) {
      sizeBtn.click();
    } else {
      const event = new KeyboardEvent("keydown", {
        key: "t",
        keyCode: 84,
        which: 84,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(event);
    }
  }
}

// 8. Anti-Distraction Engine
function toggleAntiDistractionCSS(enable) {
  let styleEl = document.getElementById("yt-handsfree-antidistraction-style");
  if (enable) {
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "yt-handsfree-antidistraction-style";
      styleEl.textContent = `
        ytd-rich-section-renderer,
        ytd-reel-shelf-renderer,
        yt-mealbar-promo-renderer,
        ytd-popup-container ytd-action-companion-ad-renderer {
          display: none !important;
        }
      `;
      document.head.appendChild(styleEl);
    }
  } else {
    if (styleEl) styleEl.remove();
  }
}

// 9. Shift + Scroll Speed Controller
window.addEventListener(
  "wheel",
  (e) => {
    if (!isContextValid()) return;
    if (!settings.isSpeedScrollEnabled || !e.shiftKey) return;

    const video = document.querySelector("video");
    if (!video) return;

    e.preventDefault();
    e.stopPropagation();

    let delta = e.deltaY < 0 ? 0.25 : -0.25;
    let newRate = Math.min(Math.max(video.playbackRate + delta, 0.25), 4.0);
    video.playbackRate = parseFloat(newRate.toFixed(2));

    showVoiceToast(`Speed: ${video.playbackRate}x ⚡`);
  },
  { capture: true, passive: false },
);

// 10. Main Engine Interval Loop (Guarded against extension context invalidation)
const mainInterval = setInterval(() => {
  if (!isContextValid()) {
    clearInterval(mainInterval);
    return;
  }

  try {
    checkUpcomingAds();
    enforceEnhancedBitrate();
    enforceAutoTheater();
    injectScreenshotButton();

    if (!settings.isSkipperEnabled) return;

    const video = document.querySelector("video");
    const player = document.querySelector("#movie_player, .html5-video-player");
    const adPlaying =
      (player && (player.classList.contains("ad-showing") || player.classList.contains("ad-interrupting"))) ||
      document.querySelector(".ad-showing, .ad-interrupting");

    const skipBtn = document.querySelector(
      ".ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-skip-button, .ytp-ad-skip-button-slot, .ytp-skip-ad-button-single, button[class*='skip-ad']",
    );

    // Feature A: Fast Forward Unskippable Ads (16.0x Speed + Mute)
    if (settings.isFastForwardEnabled && adPlaying && !skipBtn) {
      if (video && isFinite(video.duration) && video.duration > 0) {
        if (video.currentTime < video.duration - 0.5) {
          video.playbackRate = 16.0;
          video.muted = true;
        }
      }
    }

    // Feature B: Hardware Skip Button Clicker
    if (skipBtn && skipBtn.offsetParent !== null && !skipBtn.dataset.clicked) {
      if (!skipBtn.dataset.firstSeen) {
        skipBtn.dataset.firstSeen = Date.now();
      }

      const elapsed = Date.now() - parseInt(skipBtn.dataset.firstSeen);
      const waitRequired = settings.isFairPlayEnabled ? 5000 : 0;

      if (elapsed >= waitRequired) {
        skipBtn.dataset.clicked = "true";

        // Immediate Native DOM Click Fallback
        try {
          skipBtn.click();
        } catch (e) {}

        const rect = skipBtn.getBoundingClientRect();
        const clickX = Math.round(rect.left + rect.width / 2);
        const clickY = Math.round(rect.top + rect.height / 2);

        if (isContextValid()) {
          try {
            chrome.runtime.sendMessage({
              action: "hardware_click",
              x: clickX,
              y: clickY,
            });
          } catch (e) {}
        }

        setTimeout(() => {
          if (skipBtn) {
            skipBtn.dataset.clicked = "";
            skipBtn.dataset.firstSeen = "";
          }
        }, 2000);
      }
    }

    // Feature C: Close Banners
    document.querySelectorAll(".ytp-ad-overlay-close-button").forEach((btn) => {
      if (btn.offsetParent !== null) btn.click();
    });
  } catch (e) {}
}, 300);

// 11. Voice Recognition Engine
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
        if (settings.isVoiceControlEnabled && recognition && isContextValid()) {
          try {
            recognition.start();
          } catch (e) {}
        }
      };

      recognition.onerror = () => {
        if (settings.isVoiceControlEnabled && recognition && isContextValid()) {
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

// Handle Voice Commands
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

// Toast HUD Notification
function showVoiceToast(text) {
  let toast = document.getElementById("yt-handsfree-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "yt-handsfree-toast";
    toast.style.cssText = `
      position: fixed;
      top: 70px;
      right: 30px;
      z-index: 999999;
      background: rgba(15, 17, 21, 0.88);
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

  toast.innerHTML = `<span>⚡ Hands Free:</span> <span style="color: #ff3377;">${text}</span>`;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
  }, 2500);
}
