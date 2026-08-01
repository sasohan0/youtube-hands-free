<div align="center">

<img src="assets/banner.png" alt="Youtube Hands Free Banner" width="100%" style="border-radius: 10px;" />

# ⚡ YouTube Hands Free
### Cyberpunk Visor Emoji Motion Icon, Hardware CDP, AI Voice & 4K Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Manifest V3](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub Stars](https://img.shields.io/github/stars/sasohan0/youtube-hands-free?style=social)](https://github.com/sasohan0/youtube-hands-free)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**YouTube Hands Free** is an ultra-sleek, zero-latency Chrome extension that automatically bypasses, skips, and fast-forwards YouTube video ads using **hardware-level Chrome DevTools Protocol (CDP)** inputs, an **AI Voice Command Engine**, a **High Bitrate 4K Stream Lock**, and a **Cyberpunk Visor Emoji Motion-Graphics Toolbar Icon Engine**.

[Features](#-key-features) • [Cyberpunk Motion Icon](#-cyberpunk-visor-emoji-motion-icon) • [High Bitrate 4K Lock](#-high-bitrate--4k-quality-lock) • [Ad Predictor & Alert](#-ad-predictor--upcoming-alert) • [Voice Commands](#-voice-command-engine) • [Installation](#-installation-guide)

</div>

---

## 📸 Visual Glassmorphic UI Showcase

<div align="center">
  <img src="assets/dashboard.png" alt="YouTube Hands Free Dark Glassmorphic UI Dashboard" width="480px" style="border-radius: 14px; box-shadow: 0 12px 35px rgba(0,0,0,0.6);" />
  <p><em>Ultra-sleek Dark Glassmorphic Control Center with Cyberpunk Visor Emoji Motion Icon, 4K Quality Lock, Ad Predictor, Time Saved counter, and Glass presets.</em></p>
</div>

---

## ✨ Key Features

- 🕶️ **Cyberpunk Visor Emoji Motion Icon Engine**: Live morphing transparent icon engine in the Chrome extension toolbar. Dynamically cycles between **Modern Gray-Black Skip Button** (⏭️), **Cyber Hand Tapping Gray-Black Skip** (👆⏭️), and **Vibing Cyberpunk Visor Emoji** (🎧😎).
- 🎯 **Hardware-Level Click Simulation**: Bypasses YouTube's programmatic event detection by dispatching OS-level `Input.dispatchMouseEvent` via Chrome Debugger.
- 🎬 **High Bitrate & 4K Stream Lock**: Automatically locks YouTube player playback to maximum available quality (`2160p 4K`, `1440p 2K`, or `1080p60 Premium`), preventing YouTube from auto-downgrading resolutions.
- 🔮 **Ad Break Predictor Engine**: Scans YouTube timeline markers and video duration to predict total upcoming ad breaks.
- 🔔 **Upcoming Ad Announcement HUD**: Displays an on-screen Glass Tooltip notification 5s before an ad break triggers (`⚡ Upcoming Ad in ~5s`).
- ⏱️ **Time Saved Counter**: Automatically calculates and displays cumulative seconds/minutes saved from skipped & accelerated ads.
- 🎤 **Hands-Free Voice Command Engine**: Control playback and skip ads effortlessly using real-time speech recognition ("Skip", "Pause", "Play", "Mute", "Speed up").
- ⏩ **16x Speed Unskippable Ad Fast-Forwarding**: Instantly speeds through unskippable ads at 16.0x playback rate while auto-muting rapid audio.
- 🎨 **Glassmorphic Multi-Theme Presets**: Switch between **Neon Glass**, **Cyberpunk**, and **Obsidian** dark glass themes with custom backdrop blur and hover shine sweep effects.

---

## 🕶️ Cyberpunk Visor Emoji Motion Icon

The extension toolbar icon dynamically morphs between 3 custom animated scenes on a **100% transparent background**:

```text
  [Scene 1: Modern Gray-Black Skip]   [Scene 2: Cyber Hand Tap]         [Scene 3: Cyberpunk Emoji]
   ⏭️ Gray-Black Pill (#161b26)        👆 Neon Cyan Finger Tap          🎧😎 Cyber Visor Glasses (#00F2FE)
   crisp white arrows                  cyan shockwave ripple            magenta headphones & smile (#FF007F)
```

1. **Modern Gray-Black Skip Button (⏭️)**: Dark gray-black `#161b26` pill with `#334155` border and crisp white arrows.
2. **Cyber Hand Tapping Gray-Black Skip (👆⏭️)**: A neon cyan cyber finger taps down on the gray-black skip button generating click shockwave ripples.
3. **Vibing Cyberpunk Emoji (🎧😎)**: Dark obsidian emoji with glowing neon cyan visor glasses, magenta headphones, and a neon smile bobbing to the music beat.

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

5. **Enjoy Live Cyberpunk 4K Hands-Free YouTube!** 🎉

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Built with ❤️ for an uninterrupted, hands-free YouTube streaming experience.</sub>
</div>
