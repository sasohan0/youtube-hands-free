document.addEventListener("DOMContentLoaded", () => {
  const masterToggle = document.getElementById("masterToggle");
  const ffToggle = document.getElementById("fastForwardToggle");
  const voiceToggle = document.getElementById("voiceToggle");
  const upcomingAdToggle = document.getElementById("upcomingAdToggle");
  const totalSkippedEl = document.getElementById("totalSkipped");
  const historyListEl = document.getElementById("historyList");
  const clearBtn = document.getElementById("clearBtn");
  const themeBtns = document.querySelectorAll(".theme-btn");
  const statusText = document.getElementById("statusText");
  const predictedAdCountEl = document.getElementById("predictedAdCount");
  const timeSavedEl = document.getElementById("timeSaved");

  // Load States
  chrome.storage.local.get(
    {
      isSkipperEnabled: true,
      isFastForwardEnabled: true,
      isVoiceControlEnabled: false,
      isUpcomingAlertEnabled: true,
      selectedTheme: "neon",
      predictedAdCount: 0,
      timeSavedSeconds: 0,
    },
    (result) => {
      masterToggle.checked = result.isSkipperEnabled;
      ffToggle.checked = result.isFastForwardEnabled;
      voiceToggle.checked = result.isVoiceControlEnabled;
      upcomingAdToggle.checked = result.isUpcomingAlertEnabled;

      applyTheme(result.selectedTheme);
      updateStatusText(result.isSkipperEnabled, result.isVoiceControlEnabled);
      renderMetrics(result.predictedAdCount, result.timeSavedSeconds);
    },
  );

  // Listeners for Toggles
  masterToggle.addEventListener("change", () => {
    const isEnabled = masterToggle.checked;
    chrome.storage.local.set({ isSkipperEnabled: isEnabled });
    updateStatusText(isEnabled, voiceToggle.checked);
  });

  ffToggle.addEventListener("change", () => {
    chrome.storage.local.set({ isFastForwardEnabled: ffToggle.checked });
  });

  voiceToggle.addEventListener("change", () => {
    const isVoice = voiceToggle.checked;
    chrome.storage.local.set({ isVoiceControlEnabled: isVoice });
    updateStatusText(masterToggle.checked, isVoice);
  });

  upcomingAdToggle.addEventListener("change", () => {
    chrome.storage.local.set({
      isUpcomingAlertEnabled: upcomingAdToggle.checked,
    });
  });

  // Theme Buttons Listener
  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const theme = btn.dataset.theme;
      applyTheme(theme);
      chrome.storage.local.set({ selectedTheme: theme });
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

  function renderMetrics(count, seconds) {
    predictedAdCountEl.textContent =
      count > 0 ? `~${count} Ads` : "No Ads Detected";

    if (seconds < 60) {
      timeSavedEl.textContent = `${seconds}s`;
    } else {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      timeSavedEl.textContent = `${mins}m ${secs}s`;
    }
  }

  function updateStatusText(skipper, voice) {
    if (!skipper) {
      statusText.textContent = "Engine Paused";
      statusText.parentElement.style.borderColor = "rgba(239, 68, 68, 0.3)";
      statusText.parentElement.style.color = "#f87171";
      statusText.parentElement.style.background = "rgba(239, 68, 68, 0.08)";
      document.querySelector(".status-pulse").style.backgroundColor = "#ef4444";
      document.querySelector(".status-pulse").style.boxShadow =
        "0 0 10px #ef4444";
    } else if (voice) {
      statusText.textContent = "🎤 Hardware & Voice Active";
      statusText.parentElement.style.borderColor = "rgba(168, 85, 247, 0.3)";
      statusText.parentElement.style.color = "#c084fc";
      statusText.parentElement.style.background = "rgba(168, 85, 247, 0.08)";
      document.querySelector(".status-pulse").style.backgroundColor = "#c084fc";
      document.querySelector(".status-pulse").style.boxShadow =
        "0 0 10px #c084fc";
    } else {
      statusText.textContent = "System Active & Listening";
      statusText.parentElement.style.borderColor = "rgba(16, 185, 129, 0.2)";
      statusText.parentElement.style.color = "#10b981";
      statusText.parentElement.style.background = "rgba(16, 185, 129, 0.08)";
      document.querySelector(".status-pulse").style.backgroundColor = "#10b981";
      document.querySelector(".status-pulse").style.boxShadow =
        "0 0 10px #10b981";
    }
  }

  // Render History
  function loadHistory() {
    chrome.storage.local.get(
      { skipCount: 0, skipHistory: [], timeSavedSeconds: 0 },
      (data) => {
        totalSkippedEl.textContent = data.skipCount;
        historyListEl.innerHTML = "";

        if (data.skipHistory.length === 0) {
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

  // Clear Button
  clearBtn.addEventListener("click", () => {
    chrome.storage.local.set(
      { skipCount: 0, skipHistory: [], timeSavedSeconds: 0 },
      () => {
        loadHistory();
        renderMetrics(0, 0);
        clearBtn.textContent = "Cleared!";
        setTimeout(() => (clearBtn.textContent = "Clear"), 1500);
      },
    );
  });

  loadHistory();
});
