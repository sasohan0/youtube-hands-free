document.addEventListener("DOMContentLoaded", () => {
  const masterToggle = document.getElementById("masterToggle");
  const fairPlayToggle = document.getElementById("fairPlayToggle");
  const ffToggle = document.getElementById("fastForwardToggle");
  const voiceToggle = document.getElementById("voiceToggle");
  const upcomingAdToggle = document.getElementById("upcomingAdToggle");
  const highBitrateToggle = document.getElementById("highBitrateToggle");
  const audioBoostToggle = document.getElementById("audioBoostToggle");
  const screenshotToggle = document.getElementById("screenshotToggle");
  const pipToggle = document.getElementById("pipToggle");
  const sleepTimerSelect = document.getElementById("sleepTimerSelect");
  const autoTheaterToggle = document.getElementById("autoTheaterToggle");
  const antiDistractionToggle = document.getElementById("antiDistractionToggle");
  const speedScrollToggle = document.getElementById("speedScrollToggle");
  const totalSkippedEl = document.getElementById("totalSkipped");
  const historyListEl = document.getElementById("historyList");
  const clearBtn = document.getElementById("clearBtn");
  const themeBtns = document.querySelectorAll(".theme-btn");
  const statusText = document.getElementById("statusText");
  const timeSavedEl = document.getElementById("timeSaved");

  // Safe Storage Writer Helper
  function saveSetting(key, val) {
    const data = {};
    data[key] = val;
    try {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set(data, () => {
          if (chrome.runtime.lastError) {}
        });
      }
    } catch (e) {}
  }

  // Load Saved User Settings
  const defaults = {
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
    selectedTheme: "neon",
    timeSavedSeconds: 0,
  };

  try {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(null, (items) => {
        if (chrome.runtime.lastError) return;
        const result = { ...defaults, ...(items || {}) };

        if (masterToggle) masterToggle.checked = !!result.isSkipperEnabled;
        if (fairPlayToggle) fairPlayToggle.checked = !!result.isFairPlayEnabled;
        if (ffToggle) ffToggle.checked = !!result.isFastForwardEnabled;
        if (voiceToggle) voiceToggle.checked = !!result.isVoiceControlEnabled;
        if (upcomingAdToggle) upcomingAdToggle.checked = !!result.isUpcomingAlertEnabled;
        if (highBitrateToggle) highBitrateToggle.checked = !!result.isHighBitrateEnabled;
        if (audioBoostToggle) audioBoostToggle.checked = !!result.isAudioBoostEnabled;
        if (screenshotToggle) screenshotToggle.checked = !!result.isScreenshotEnabled;
        if (pipToggle) pipToggle.checked = !!result.isPipEnabled;
        if (sleepTimerSelect) sleepTimerSelect.value = result.sleepTimerMinutes || 0;
        if (autoTheaterToggle) autoTheaterToggle.checked = !!result.isAutoTheaterEnabled;
        if (antiDistractionToggle) antiDistractionToggle.checked = !!result.isAntiDistractionEnabled;
        if (speedScrollToggle) speedScrollToggle.checked = !!result.isSpeedScrollEnabled;

        applyTheme(result.selectedTheme || "neon");
        updateStatusText(
          result.isSkipperEnabled,
          result.isVoiceControlEnabled,
          result.isFairPlayEnabled,
        );
        renderMetrics(result.timeSavedSeconds || 0);
      });
    }
  } catch (e) {}

  // Safe Guarded Event Listeners (Zero Null Pointer Crashes)
  if (masterToggle) {
    masterToggle.addEventListener("change", () => {
      const isEnabled = masterToggle.checked;
      saveSetting("isSkipperEnabled", isEnabled);
      updateStatusText(
        isEnabled,
        voiceToggle ? voiceToggle.checked : false,
        fairPlayToggle ? fairPlayToggle.checked : false,
      );
    });
  }

  if (fairPlayToggle) {
    fairPlayToggle.addEventListener("change", () => {
      const isFair = fairPlayToggle.checked;
      saveSetting("isFairPlayEnabled", isFair);
      updateStatusText(
        masterToggle ? masterToggle.checked : true,
        voiceToggle ? voiceToggle.checked : false,
        isFair,
      );
    });
  }

  if (ffToggle) {
    ffToggle.addEventListener("change", () => {
      saveSetting("isFastForwardEnabled", ffToggle.checked);
    });
  }

  if (voiceToggle) {
    voiceToggle.addEventListener("change", () => {
      const isVoice = voiceToggle.checked;
      saveSetting("isVoiceControlEnabled", isVoice);
      updateStatusText(
        masterToggle ? masterToggle.checked : true,
        isVoice,
        fairPlayToggle ? fairPlayToggle.checked : false,
      );
    });
  }

  if (upcomingAdToggle) {
    upcomingAdToggle.addEventListener("change", () => {
      saveSetting("isUpcomingAlertEnabled", upcomingAdToggle.checked);
    });
  }

  if (highBitrateToggle) {
    highBitrateToggle.addEventListener("change", () => {
      saveSetting("isHighBitrateEnabled", highBitrateToggle.checked);
    });
  }

  if (audioBoostToggle) {
    audioBoostToggle.addEventListener("change", () => {
      saveSetting("isAudioBoostEnabled", audioBoostToggle.checked);
    });
  }

  if (screenshotToggle) {
    screenshotToggle.addEventListener("change", () => {
      saveSetting("isScreenshotEnabled", screenshotToggle.checked);
    });
  }

  if (pipToggle) {
    pipToggle.addEventListener("change", () => {
      saveSetting("isPipEnabled", pipToggle.checked);
    });
  }

  if (sleepTimerSelect) {
    sleepTimerSelect.addEventListener("change", () => {
      saveSetting("sleepTimerMinutes", parseInt(sleepTimerSelect.value) || 0);
    });
  }

  if (autoTheaterToggle) {
    autoTheaterToggle.addEventListener("change", () => {
      saveSetting("isAutoTheaterEnabled", autoTheaterToggle.checked);
    });
  }

  if (antiDistractionToggle) {
    antiDistractionToggle.addEventListener("change", () => {
      saveSetting("isAntiDistractionEnabled", antiDistractionToggle.checked);
    });
  }

  if (speedScrollToggle) {
    speedScrollToggle.addEventListener("change", () => {
      saveSetting("isSpeedScrollEnabled", speedScrollToggle.checked);
    });
  }

  // Theme Buttons Listener
  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      applyTheme(theme);
      saveSetting("selectedTheme", theme);
    });
  });

  function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    themeBtns.forEach((b) => {
      if (b.dataset.theme === theme) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });
  }

  function renderMetrics(seconds) {
    if (!timeSavedEl) return;
    if (seconds < 60) {
      timeSavedEl.textContent = `${seconds}s`;
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timeSavedEl.textContent = `${mins}m ${secs}s`;
    }
  }

  function updateStatusText(skipper, voice, fairPlay) {
    if (!statusText) return;
    if (!skipper) {
      statusText.textContent = "Engine Paused";
      statusText.parentElement.style.borderColor = "rgba(239, 68, 68, 0.3)";
      statusText.parentElement.style.color = "#f87171";
      statusText.parentElement.style.background = "rgba(239, 68, 68, 0.08)";
      const pulse = document.querySelector(".status-pulse");
      if (pulse) {
        pulse.style.backgroundColor = "#ef4444";
        pulse.style.boxShadow = "0 0 10px #ef4444";
      }
    } else if (fairPlay) {
      statusText.textContent = "🤝 Creator Fair-Play Active (5s Wait)";
      statusText.parentElement.style.borderColor = "rgba(245, 158, 11, 0.3)";
      statusText.parentElement.style.color = "#f59e0b";
      statusText.parentElement.style.background = "rgba(245, 158, 11, 0.08)";
      const pulse = document.querySelector(".status-pulse");
      if (pulse) {
        pulse.style.backgroundColor = "#f59e0b";
        pulse.style.boxShadow = "0 0 10px #f59e0b";
      }
    } else if (voice) {
      statusText.textContent = "🎤 Hardware & Voice Active";
      statusText.parentElement.style.borderColor = "rgba(168, 85, 247, 0.3)";
      statusText.parentElement.style.color = "#c084fc";
      statusText.parentElement.style.background = "rgba(168, 85, 247, 0.08)";
      const pulse = document.querySelector(".status-pulse");
      if (pulse) {
        pulse.style.backgroundColor = "#c084fc";
        pulse.style.boxShadow = "0 0 10px #c084fc";
      }
    } else {
      statusText.textContent = "System Active & Listening";
      statusText.parentElement.style.borderColor = "rgba(16, 185, 129, 0.2)";
      statusText.parentElement.style.color = "#10b981";
      statusText.parentElement.style.background = "rgba(16, 185, 129, 0.08)";
      const pulse = document.querySelector(".status-pulse");
      if (pulse) {
        pulse.style.backgroundColor = "#10b981";
        pulse.style.boxShadow = "0 0 10px #10b981";
      }
    }
  }

  // Render History
  function loadHistory() {
    try {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(
          { skipCount: 0, skipHistory: [] },
          (data) => {
            if (totalSkippedEl) totalSkippedEl.textContent = data.skipCount || 0;
            if (!historyListEl) return;
            historyListEl.innerHTML = "";

            if (!data.skipHistory || data.skipHistory.length === 0) {
              historyListEl.innerHTML =
                '<li class="empty-hist">No ads skipped yet.</li>';
            } else {
              data.skipHistory.forEach((item) => {
                const li = document.createElement("li");
                li.innerHTML = `
                <span class="hist-time">${item.time}</span>
                <span class="hist-title">${item.title}</span>
              `;
                historyListEl.appendChild(li);
              });
            }
          },
        );
      }
    } catch (e) {}
  }

  // Clear Button
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      saveSetting("skipCount", 0);
      saveSetting("skipHistory", []);
      saveSetting("timeSavedSeconds", 0);
      if (totalSkippedEl) totalSkippedEl.textContent = "0";
      if (historyListEl)
        historyListEl.innerHTML =
          '<li class="empty-hist">No ads skipped yet.</li>';
      renderMetrics(0);
      clearBtn.textContent = "Cleared!";
      setTimeout(() => (clearBtn.textContent = "Clear"), 1500);
    });
  }

  loadHistory();
});
