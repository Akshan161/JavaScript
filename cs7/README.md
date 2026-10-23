# ChronoRole — Smart Role-Based Alarm Studio
**Web Development Laboratory — Experiment 7**

---

## 🌟 Overview & Design Features

This project is a modern, standalone single-page web application for **ChronoRole (Smart Role-Based Alarm Studio)**. Built with pure semantic HTML, vanilla CSS, and reactive JavaScript with zero external runtime dependencies.

### 🎨 1. White & Blue Color Palette
- **Canvas & Background**: Pure white & soft icy-blue ambient mesh (`#ffffff`, `#f0f6ff`, `#edf4fe`).
- **Primary & Accent Blues**: Electric royal blue (`#2563eb`), deep ocean sapphire (`#1d4ed8`), and vibrant cerulean (`#0284c7`).
- **Typography & High Contrast**: Midnight navy (`#0f172a`, `#1e3a8a`, `#334155`) for crisp readability and visual hierarchy.
- **Card Styling**: Elevated white cards with subtle icy-blue borders (`#bfdbfe`, `#dbeafe`) and soft diffused shadows (`rgba(37, 99, 235, 0.08)`).
- **Harmonious Role Badges**:
  - `STUDY`: Royal Blue (`#2563eb`)
  - `SLEEP`: Sky / Ocean Blue (`#0284c7`)
  - `WORK`: Indigo Blue (`#4f46e5`)
  - `FITNESS`: Teal Blue (`#0d9488`)
  - `CUSTOM`: Violet Blue (`#7c3aed`)

### 📐 2. Layout Architecture & Upgrades
- **Clean Header**: Features the ChronoRole emblem, Alerts toggle (`Alerts: Off / On`), Brightness/Theme button, and `+ New Alarm` trigger.
- **Command Deck Hero (Dual-Pane Bento Grid)**:
  - **Left Deck**: High-precision digital clock with live ticking seconds, AM/PM tag, dynamic calendar date (dialed back 2 weeks), timezone status, and an integrated **Role Quick-Start Presets** grid (+25m Study, +50m Sprint, +20m Nap, 10:30 PM Bedtime, +1h Work Standup, +45m Hydration).
  - **Right Spotlight HUD**: Next upcoming alarm detector with live countdown (`06h 47m 54s`), target activity tag, active roles tracker, and quick simulator trigger.
- **Scheduled Alarms Management Board**:
  - Filter pills with real-time counters (`All Roles`, `Study`, `Sleep`, `Work`, `Fitness`, `Custom`).
  - Interactive cards with ON/OFF switch toggles, live remaining time badges (`in 22h 17m 29s`), repeat day indicators (`S M T W T F S`), role checklists, and action controls (Edit, Play Tone, Delete).
- **Interactive Modals**:
  - **Configure Alarm Modal**: Intuitive modal to create or edit alarms with hour/minute dropdowns, AM/PM, role tags, repeat days, ringtone selector, and checklist.
  - **Ring Screen Simulator**: Full modal simulation with vibrating bell animation, live audio synthesis, checklist review, Snooze 5 min, and Dismiss.
- **Built-in Audio Synthesizer**: Uses HTML5 Web Audio API to produce customizable alarm tones (*Study Gong*, *Gentle Chime*, *Digital Pulse*, *Energize Ring*, *Peaceful*) without needing any external MP3 files.

---

## 🚀 How to Run

Simply open [index.html](file:///c:/Users/aksha/OneDrive/Desktop/Akshan/Javascript/cs7/index.html) in any web browser (Chrome, Edge, Firefox, Brave, Safari).
