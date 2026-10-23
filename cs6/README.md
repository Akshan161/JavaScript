# Experiment 6: String Functions, Email Verification & Regex Studio
**Web Development Laboratory**

---

## 🌟 Overview & Enhancements
This application is a next-generation laboratory studio built for **Experiment 6 (String Functions, Regular Expressions & Text Analytics)**. Compared to the basic reference layout, this program introduces:

### 1. 🎨 Curated Colors & Theme Engine
- **🌌 Cyber Slate (Default)**: Deep Obsidian Navy (`#0a0f1d`) with luminous cyan (`#06b6d4`) and electric indigo (`#6366f1`) accents.
- **🌲 Emerald Obsidian**: Deep forest emerald theme (`#060d0a` with `#10b981` accents).
- **🌆 Sunset Neon**: Deep purple background with vibrant coral, rose, and amber highlights.
- **☀️ Neo Studio (Light)**: Clean, high-contrast crisp studio light mode.
- *Instant theme dropdown switcher with `localStorage` persistence.*

### 2. 📐 Enhanced Layout & Alignment
- **App-Shell Bento Grid**: Modular card-based layout with glassmorphic cards (`backdrop-filter: blur`), glowing ambient orbs, and distinct card headers.
- **Dynamic Student Identity Badge**: Interactive developer badge displaying student name (`AKSHAN`) and PRN (`24070521000`) with in-app edit modal.
- **Top KPI Dashboard**: Live summary banner tracking words analyzed, extracted entities, email integrity, and string transformations.
- **Segmented Pill Navigation**: 5 dedicated studio modules with badge counters, icons, and keyboard-friendly transitions.

---

## 🔬 Studio Modules (5-in-1 Suite)

1. **✉️ Email Validator & RFC 5322 Syntax Inspector (Tab 1)**:
   - Full RFC 5322 regular expression verification.
   - Live visual syntax anatomy deconstructing username (local-part), `@`, domain name, and TLD.
   - Interactive verification checklist (presence of `@`, single `@`, valid characters, no consecutive dots `..`, valid TLD length).
   - Quick one-click test presets (Gmail, Academic `.edu.in`, plus addressing, invalid double dots, missing domain).

2. **🔍 Unstructured Data Extraction & Entity Miner (Tab 2)**:
   - Extracts emails, phone numbers, URLs, hashtags/mentions, and IPv4 addresses from raw text.
   - Filter tabs by entity type with live counts.
   - 1-click **Copy JSON** of all extracted entities.

3. **🔤 String Methods & Transformation Lab (Tab 3)**:
   - Case conversions: `toUpperCase()`, `toLowerCase()`, Title Case, `camelCase`, `snake_case`, `kebab-case`, `PascalCase`, `tOGGLE cASE`.
   - String utilities: `reverse()`, Palindrome test, `trim()`, space stripper, Base64 encode/decode.
   - Parameterized slicing (`.slice(start, end)`) and substring replacement (`.replaceAll(find, replace)`).
   - Live JavaScript execution snippet generator showing the exact native code used.
   - Recent transformations history stack.

4. **🌐 Text Analysis & Mail Presence Check (Tab 4 - Lab Benchmark)**:
   - Interactive text input inspector with character counter.
   - **Sample WITH Mail** and **Sample WITHOUT Mail** instant loaders.
   - **Mail Presence Status**: Live detection badge with RFC compliance criteria.
   - Cloud badges of all detected emails with 1-click copy buttons.
   - Entity footprint indicators (Phone numbers, URLs, Tags/Mentions).
   - **Comprehensive Text Metrics**: Total words, characters (with spaces), characters (without spaces), sentences, paragraphs, estimated reading time.
   - **Flesch Reading Ease Score**: Evaluates readability index in real-time.
   - **Character Set Distribution**: Color-segmented progress bar breakdown (Uppercase, Lowercase, Digits, Symbols, Spaces).
   - **Top Keyword Frequencies**: Horizontal bar chart showing most frequent keywords.

5. **>_ Regex Tester & Parser Sandbox (Tab 5)**:
   - Live regex pattern input with interactive flag selectors (`g`, `i`, `m`, `s`).
   - Real-time match highlighter overlay with custom `<mark>` tokens.
   - Match details table with match index, length, and value.
   - Built-in regex pattern presets (Email, Phone, URL, Hex color, IPv4, HTML tags).
   - Built-in quick regex cheatsheet.

---

## 🚀 How to Run & View
1. Open [`index.html`](file:///c:/Users/aksha/OneDrive/Desktop/Akshan/Javascript/cs6/index.html) (or [`akshan.index.html`](file:///c:/Users/aksha/OneDrive/Desktop/Akshan/Javascript/cs6/akshan.index.html)) directly in any modern web browser (Google Chrome, Microsoft Edge, Brave, Firefox).
2. Or use any local HTTP server:
   ```powershell
   npx serve .
   ```
