<div align="center">

<img src="assets/banner.png" alt="Youtube Hands Free Banner" width="100%" style="border-radius: 10px;" />

# ⚡ YouTube Hands Free
### Raycast Designer Motion Icon, Hardware CDP, AI Voice & 4K Lock Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Manifest V3](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub Stars](https://img.shields.io/github/stars/sasohan0/youtube-hands-free?style=social)](https://github.com/sasohan0/youtube-hands-free)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**YouTube Hands Free** is an ultra-sleek, zero-latency Chrome extension that automatically bypasses, skips, and fast-forwards YouTube video ads using **hardware-level Chrome DevTools Protocol (CDP)** inputs, an **AI Voice Command Engine**, a **High Bitrate 4K Stream Lock**, and a **Max-Visibility Raycast Designer Motion Icon Engine**.

[Features](#-key-features) • [Raycast Motion Icon](#-raycastlinear-designer-motion-icon) • [High Bitrate 4K Lock](#-high-bitrate--4k-quality-lock) • [Ad Predictor & Alert](#-ad-predictor--upcoming-alert) • [Voice Commands](#-voice-command-engine) • [Installation](#-installation-guide)

</div>

---

## 📸 Visual Glassmorphic UI Showcase

<div align="center">
  <img src="assets/dashboard.png" alt="YouTube Hands Free Dark Glassmorphic UI Dashboard" width="480px" style="border-radius: 14px; box-shadow: 0 12px 35px rgba(0,0,0,0.6);" />
  <p><em>Ultra-sleek Dark Glassmorphic Control Center with Max-Visibility Raycast Motion Icon, 4K Quality Lock, Ad Predictor, Time Saved counter, and Glass presets.</em></p>
</div>

---

## ✨ Key Features

- 💫 **Max-Visibility Raycast Motion Icon**: Prominent 60 FPS micro-pulse animation in the Chrome toolbar. Features a full-grid **Radar Sweep Beam** (`#00F2FE` -> `#FF0050` conic gradient sweep), enlarged 28x28px dark card base, breathing spring physics, and an elastic **Snap Burst Wave** on ad bypass.
- 🎯 **Hardware-Level Click Simulation**: Bypasses YouTube's programmatic event detection by dispatching OS-level `Input.dispatchMouseEvent` via Chrome Debugger.
- 🎬 **High Bitrate & 4K Stream Lock**: Automatically locks YouTube player playback to maximum available quality (`2160p 4K`, `1440p 2K`, or `1080p60 Premium`), preventing YouTube from auto-downgrading resolutions.
- 🔮 **Ad Break Predictor Engine**: Scans YouTube timeline markers and video duration to predict total upcoming ad breaks.
- 🔔 **Upcoming Ad Announcement HUD**: Displays an on-screen Glass Tooltip notification 5s before an ad break triggers (`⚡ Upcoming Ad in ~5s`).
- ⏱️ **Time Saved Counter**: Automatically calculates and displays cumulative seconds/minutes saved from skipped & accelerated ads.
- 🎤 **Hands-Free Voice Command Engine**: Control playback and skip ads effortlessly using real-time speech recognition ("Skip", "Pause", "Play", "Mute", "Speed up").
- ⏩ **16x Speed Unskippable Ad Fast-Forwarding**: Instantly speeds through unskippable ads at 16.0x playback rate while auto-muting rapid audio.
- 🎨 **Glassmorphic Multi-Theme Presets**: Switch between **Neon Glass**, **Cyberpunk**, and **Obsidian** dark glass themes with custom backdrop blur and hover shine sweep effects.

---

## 💫 Raycast/Linear Designer Motion Icon

Designed following top-tier product design principles (Raycast, Linear, Apple macOS Menubar design systems):

```text
  [Active Listening State]               [Ad Skip Execution Burst]
   🌀 Conic Radar Sweep Ring              ⚡ Elastic Spin Snap (180°)
   Cyan/Red gradient sweep beam           Expanding Shockwave Burst Ring
```

1. **Full Grid Conic Radar Sweep**: A subtle, 60 FPS conic gradient ring (`#00F2FE` -> `#FF0050` -> `#8A2BE2`) continuously sweeps around the icon perimeter.
2. **Spring Breathing Physics**: Smooth `Math.sin()` cubic-bezier breathing motion indicating live system monitoring.
3. **Elastic Execution Snap**: Flashes a neon `SKIP` badge and triggers a 180° elastic snap spin + shockwave burst when an ad is bypassed.

---

## 🎬 High Bitrate & 4K Quality Lock

YouTube often defaults to auto-resolution downgrades (`480p`/`720p`) when switching tabs or during minor network fluctuations. **YouTube Hands Free** continuously interfaces with YouTube's HTML5 Player API (`setPlaybackQualityRange`) to enforce max resolution & 60fps streams.

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

5. **Enjoy Raycast-Grade 4K Hands-Free YouTube!** 🎉

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Built with ❤️ for an uninterrupted, hands-free YouTube streaming experience.</sub>
</div>
