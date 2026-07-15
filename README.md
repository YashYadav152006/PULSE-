# ⚡ FOCUS OS — Productivity Dashboard

> A clean, fast, single-page productivity dashboard built with vanilla HTML, CSS & JavaScript. No frameworks. No dependencies. Just pure web fundamentals.

---

## 📸 Preview

```
┌─────────────────────────────────────────────────────────┐
│  FOCUS·OS          00:00:00 — Monday          🌙 ☽     │
├──────────────┬──────────────┬──────────────────────────┤
│              │   Pomodoro   │       Weather            │
│  Todo List   ├──────────────┼──────────────────────────┤
│              │  Motivation  │       Goals              │
├──────────────┴──────────────┴──────────────────────────┤
│              Daily Planner  (24 hour slots)             │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Features

| Feature | What it does |
|---|---|
| ✅ **Todo List** | Add, star, complete, delete tasks · Filter by All / Pending / Starred / Done |
| ⏱ **Pomodoro Timer** | 25m work · 5m short break · 15m long break · SVG ring animation |
| ⛅ **Weather Widget** | Real-time weather using your location · No API key needed |
| 💬 **Motivation Quote** | Fetches live quotes from API · 7 offline fallbacks |
| ◎ **Daily Goals** | Set goals · Animated progress bar · Track completion |
| 📅 **Daily Planner** | 24 hour slots · Auto-scroll to current hour · Auto-save |
| 🌗 **Dark / Light Mode** | Toggle + remembers your choice |
| 💾 **localStorage** | Everything saves on refresh — tasks, goals, planner, theme |

---

## 🗂️ Project Structure

```
ProductivityDash/
│
├── index.html     →  All sections and HTML structure
├── style.css      →  Design tokens, bento grid, dark/light theme
├── script.js      →  All logic with beginner-friendly comments
└── README.md      →  This file
```

---

## 🧠 JavaScript Concepts Used

This project was built to practice core JS — every concept is commented in `script.js`.

```
📌 Date Object          →  Live clock, greeting, planner date
📌 setInterval          →  Clock update every second, pomodoro countdown
📌 clearInterval        →  Pause / reset the pomodoro timer
📌 localStorage         →  Save tasks, goals, planner notes, theme
📌 JSON.parse / stringify →  Convert arrays ↔ strings for storage
📌 createElement        →  Build task cards and goal items in JS
📌 appendChild          →  Add elements to the DOM
📌 Event Delegation     →  One listener handles all task/goal buttons
📌 Fetch API            →  Get quote from API + weather from Open-Meteo
📌 Geolocation API      →  Get user's coordinates for weather
📌 CSS Variables        →  Theme switching via data-theme attribute
📌 SVG stroke-dashoffset →  Pomodoro ring progress animation
```

---

## 🚀 How to Run

**Option 1 — Direct (Simplest)**
```
Just open index.html in any browser. Done.
```

**Option 2 — VS Code Live Server**
```
Right click index.html → Open with Live Server
```

**Option 3 — Deploy Free**
```
Drag the folder into:
→ netlify.com/drop    (instant live URL)
→ vercel.com          (connect GitHub repo)
```

---

## 🎨 Customization

### Change accent color
In `style.css`, find this line and change the hex value:
```css
--acc: #E8943A;   /* amber orange — change this */
```

### Change light theme colors
In `style.css`, find the `[data-theme="light"]` block:
```css
[data-theme="light"] {
    --bg:  #F0F1FF;   /* page background */
    --s1:  #FAFAFF;   /* card background */
    --ink: #0C0E20;   /* text color */
    /* change any of these */
}
```

### Change pomodoro durations
In `script.js`, find this object and update the minutes:
```js
var MODES = {
    work:  25 * 60,   /* change 25 to any number */
    short:  5 * 60,   /* change 5  to any number */
    long:  15 * 60    /* change 15 to any number */
};
```

---

## 🌐 APIs Used

| API | Purpose | Cost |
|---|---|---|
| [Quotable.io](https://api.quotable.io) | Random motivation quotes | Free · No key |
| [Open-Meteo](https://open-meteo.com) | Live weather data | Free · No key |
| [Nominatim](https://nominatim.openstreetmap.org) | City name from coordinates | Free · No key |
| Browser Geolocation API | Get user's location | Built-in · No key |

> ⚠️ Weather requires **location permission** in the browser. Click Allow when prompted.

---

## 📦 Tech Stack

```
HTML5        →  Semantic structure
CSS3         →  Custom properties, CSS Grid (bento layout), Flexbox
JavaScript   →  Vanilla ES6, no frameworks, no libraries
Fonts        →  Space Grotesk + Space Mono (Google Fonts)
```

---

## 🔧 Browser Support

Works on all modern browsers:
`Chrome ✓` · `Firefox ✓` · `Edge ✓` · `Safari ✓`

---

## 👨‍💻 Author

**Yash** — BCA Student · Uttaranchal University  
Self-taught full-stack developer · Building in public

> *"Khud banaya. Khud debugged kiya. Khud seekha."*

---

## ⭐ If you liked this project

Give it a star on GitHub and share it with your batch!

```
git init
git add .
git commit -m "feat: productivity dashboard - DOM assignment"
git push origin main
```

---

*Built with 💛 using pure HTML, CSS & JavaScript — no shortcuts.*
