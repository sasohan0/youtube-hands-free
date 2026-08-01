document.addEventListener("DOMContentLoaded", () => {
  const masterToggle = document.getElementById("masterToggle");
  const ffToggle = document.getElementById("fastForwardToggle");
  const totalSkippedEl = document.getElementById("totalSkipped");
  const historyListEl = document.getElementById("historyList");
  const clearBtn = document.getElementById("clearBtn");

  // Load States
  chrome.storage.local.get(
    { isSkipperEnabled: true, isFastForwardEnabled: true },
    (result) => {
      masterToggle.checked = result.isSkipperEnabled;
      ffToggle.checked = result.isFastForwardEnabled;
    },
  );

  // Listeners for Toggles
  masterToggle.addEventListener("change", () => {
    chrome.storage.local.set({ isSkipperEnabled: masterToggle.checked });
  });

  ffToggle.addEventListener("change", () => {
    chrome.storage.local.set({ isFastForwardEnabled: ffToggle.checked });
  });

  // Render History
  function loadHistory() {
    chrome.storage.local.get({ skipCount: 0, skipHistory: [] }, (data) => {
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
    });
  }

  // Clear Button
  clearBtn.addEventListener("click", () => {
    chrome.storage.local.set({ skipCount: 0, skipHistory: [] }, () => {
      loadHistory();
      clearBtn.textContent = "Cleared!";
      setTimeout(() => (clearBtn.textContent = "Clear"), 1500);
    });
  });

  loadHistory();
});
