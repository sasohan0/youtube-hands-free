# 🛡️ Privacy Policy & Security Safeguards

**Last Updated:** August 2026

**YouTube Hands Free** is committed to absolute user privacy, transparent open-source code practices, and fair play digital ethics.

---

## 🔒 1. Zero Data Collection Guarantee

- **No Remote Telemetry**: YouTube Hands Free does **NOT** collect, track, store, or transmit any user data, video history, browsing logs, or personal identifiers.
- **100% Local Storage**: All extension settings, theme preferences, and local skip counters are stored strictly inside your browser's local sandbox (`chrome.storage.local`).
- **No Third-Party Analytics**: No Google Analytics, no Mixpanel, no tracking pixels, and no external API server calls.

---

## 🔑 2. Permissions Transparency & Purpose

| Chrome Permission | Justification & Technical Purpose | Safety Scope |
| :--- | :--- | :--- |
| `storage` | Saves user UI preferences (theme, toggles, time saved metrics) locally. | Sandboxed strictly inside browser |
| `activeTab` | Scans YouTube video player state (`<video>`) on the active tab only. | Active YouTube tab only |
| `debugger` | Used strictly to dispatch OS-level left-click inputs (`Input.dispatchMouseEvent`) to auto-click YouTube's official skip button. | Detaches immediately (< 50ms) |
| `scripting` | Injects content script (`content.js`) on YouTube pages to handle playback speed and UI alerts. | Strictly `https://*.youtube.com/*` |

---

## 🤝 3. Creator Fair-Play Mode (Ethical Monetization Safeguard)

Content creators rely on YouTube ad monetization to continue producing free content. 

- **How Fair-Play Mode Works**: When **Creator Fair-Play Mode** is activated in the popup control center, YouTube Hands Free waits **5 full seconds** after YouTube renders a skip button before auto-clicking.
- **Benefit**: This 5-second window satisfies YouTube's creator ad view threshold, ensuring content creators still receive revenue credit for your view while giving you a 100% hands-free experience.

---

## ⚖️ 4. Disclaimer & Terms of Use

- **YouTube Hands Free** is an open-source educational project and is not affiliated with, endorsed by, or sponsored by YouTube, Google LLC, or Alphabet Inc.
- All trademarks (`YouTube`, `Chrome`) belong to their respective owners.

---

<div align="center">
  <sub>YouTube Hands Free • Open Source • 100% Local Privacy</sub>
</div>
