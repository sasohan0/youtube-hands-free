let settings = { isSkipperEnabled: true, isFastForwardEnabled: true };
let lastLogTime = 0;

// 1. Sync Settings with UI
chrome.storage.local.get(
  { isSkipperEnabled: true, isFastForwardEnabled: true },
  (res) => {
    settings = res;
  },
);

chrome.storage.onChanged.addListener((changes) => {
  if (changes.isSkipperEnabled)
    settings.isSkipperEnabled = changes.isSkipperEnabled.newValue;
  if (changes.isFastForwardEnabled)
    settings.isFastForwardEnabled = changes.isFastForwardEnabled.newValue;
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
      ].slice(0, 5); // Max 5 items

      chrome.storage.local.set({
        skipCount: data.skipCount + 1,
        skipHistory: history,
      });
    });
  }
}

// 3. The Execution Loop
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
        video.muted = true; // Mute the rapid audio
      }
    }
  }

  // --- FEATURE B: Hardware Skip Button Clicker ---
  if (skipBtn && skipBtn.offsetParent !== null && !skipBtn.dataset.clicked) {
    skipBtn.dataset.clicked = "true"; // Prevent spamming

    const rect = skipBtn.getBoundingClientRect();
    const clickX = Math.round(rect.left + rect.width / 2);
    const clickY = Math.round(rect.top + rect.height / 2);

    // Command background.js to click
    chrome.runtime.sendMessage({
      action: "hardware_click",
      x: clickX,
      y: clickY,
    });

    logSkipHistory();

    // Unlock after 2 seconds just in case it buffered
    setTimeout(() => {
      if (skipBtn) skipBtn.dataset.clicked = "";
    }, 2000);
  }

  // --- FEATURE C: Standard Banner Closer ---
  document.querySelectorAll(".ytp-ad-overlay-close-button").forEach((btn) => {
    if (btn.offsetParent !== null) btn.click();
  });
}, 300);
