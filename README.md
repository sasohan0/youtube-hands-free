<div align="center">

<img src="assets/banner.png" alt="Youtube Hands Free Banner" width="100%" style="border-radius: 10px;" />

# ⚡ YouTube Hands Free
### Hardware CDP, AI Voice, 4K Lock, Auto-Theater & Anti-Distraction Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Manifest V3](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub Stars](https://img.shields.io/github/stars/sasohan0/youtube-hands-free?style=social)](https://github.com/sasohan0/youtube-hands-free)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**YouTube Hands Free** is an ultra-sleek, zero-latency Chrome extension that automatically bypasses, skips, and fast-forwards YouTube video ads using **hardware-level Chrome DevTools Protocol (CDP)** inputs, an **AI Voice Command Engine**, a **High Bitrate 4K Stream Lock**, **Auto-Theater Mode**, **Anti-Distraction Mode**, and a **Raycast Designer Motion Icon Engine**.

[Features](#-key-features) • [Power Tools Suite](#-cinema--power-tools-suite) • [Raycast Motion Icon](#-raycastlinear-designer-motion-icon) • [Voice Commands](#-voice-command-engine) • [Installation](#-installation-guide)

</div>

---

## 📸 Visual Glassmorphic UI Showcase

<div align="center">
  <img src="assets/dashboard.png" alt="YouTube Hands Free Dark Glassmorphic UI Dashboard" width="480px" style="border-radius: 14px; box-shadow: 0 12px 35px rgba(0,0,0,0.6);" />
  <p><em>Ultra-sleek Dark Glassmorphic Control Center with Power Tools (Auto-Theater, Anti-Distraction, Speed Scroll), 4K Quality Lock, Ad Predictor, Time Saved counter, and Glass presets.</em></p>
</div>

---

## ✨ Key Features

- 🎯 **Hardware-Level Click Simulation**: Bypasses YouTube's programmatic event detection by dispatching OS-level `Input.dispatchMouseEvent` via Chrome Debugger.
- 🎬 **High Bitrate & 4K Stream Lock**: Automatically locks YouTube player playback to maximum available quality (`2160p 4K`, `1440p 2K`, or `1080p60 Premium`), preventing YouTube from auto-downgrading resolutions.
- 🎭 **Auto-Theater Mode**: Automatically expands YouTube player into full Cinema / Theater Mode when a video starts playing.
- 🛡️ **Anti-Distraction Suite**: Automatically suppresses YouTube Shorts shelves, Premium upgrade popups, and promotional survey banners.
- ⚡ **Shift + Scroll Speed Controller**: Hold `Shift` and scroll anywhere over the video player to smoothly adjust playback speed (`0.25x` to `4.00x`) with a Glass Toast HUD alert.
- 🔮 **Ad Break Predictor Engine**: Scans YouTube timeline markers and video duration to predict total upcoming ad breaks.
- 🔔 **Upcoming Ad Announcement HUD**: Displays an on-screen Glass Tooltip notification 5s before an ad break triggers (`⚡ Upcoming Ad in ~5s`).
- ⏱️ **Time Saved Counter**: Automatically calculates and displays cumulative seconds/minutes saved from skipped & accelerated ads.
- 🎤 **Hands-Free Voice Command Engine**: Control playback and skip ads effortlessly using real-time speech recognition ("Skip", "Pause", "Play", "Mute", "Speed up").
- ⏩ **16x Speed Unskippable Ad Fast-Forwarding**: Instantly speeds through unskippable ads at 16.0x playback rate while auto-muting rapid audio.
- 💫 **Max-Visibility Raycast Motion Icon**: Prominent 60 FPS micro-pulse animation in Chrome toolbar featuring a continuous conic radar sweep beam.

---

## 🎭 Cinema & Power Tools Suite

| Power Feature | Behavior | Benefit |
| :--- | :--- | :--- |
| **Auto Theater Mode** | Clicks `.ytp-size-button` on video load | Immersive full-width cinema experience |
| **Anti-Distraction Mode** | Blocks Shorts shelves & Premium nag popups | Clean, focused YouTube browsing |
| **Shift + Scroll Speed** | `Shift + Wheel` over video player | Instant fine-tuned speed control (`0.25x` - `4.0x`) |

---

## 🎤 Voice Command Engine

Activate the **Voice Command Engine** toggle in the popup to speak commands directly while watching YouTube. An on-screen Glassmorphic HUD toast will confirm actions in real time!

| Voice Command | Triggered Action |
| :--- | :--- |
| **"Skip"** / **"Skip Ad"** / **"Next Ad"** | Clicks skip button immediately via CDP |
| **"Pause"** | Pauses YouTube video playback |
| **"Play"** / **"Start"** | Resumes video playback |
| **"Mute"** | Mutes video audio |
| **"Unmute"** | Restores video audio |
| **"Speed Up"** / **"Fast"** | Sets video playback speed to `2.0x` |
| **"Normal Speed"** | Restores playback speed to `1.0x` |

---

## 🚀 Installation Guide

### Prerequisites
- Google Chrome, Brave, Edge, or any Chromium-based browser supporting Manifest V3.

### Quick Setup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sasohan0/youtube-hands-free.git
   cd youtube-hands-free
   ```

2. **Open Extensions Page**:
   - In Chrome, navigate to `chrome://extensions/`.

3. **Enable Developer Mode**:
   - Toggle the **Developer mode** switch in the top-right corner.

4. **Reload Unpacked Extension**:
   - Click **Load unpacked** (or click the **Reload ↺** refresh icon on the `YouTube Hands Free` card).

5. **Enjoy Power-Packed 4K Hands-Free YouTube!** 🎉

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Built with ❤️ for an uninterrupted, hands-free YouTube streaming experience.</sub>
</div>
