# CS 4 JavaScript Assignments Portfolio

**Student Name:** Akshan Motghare  
**PRN:** 24070521276  
**Directory Path:** `C:\Users\HP\OneDrive\Desktop\Akshan\JavaScript\cs_4` (Local Workspace: `c:\Users\aksha\OneDrive\Desktop\Akshan\Javascript\cs4`)

---

## Assignment 1: Mirror Line ⇄ (Interactive Palindrome Checker)
**File:** [`index.html`](file:///c:/Users/aksha/OneDrive/Desktop/Akshan/Javascript/cs4/index.html) | [`styles.css`](file:///c:/Users/aksha/OneDrive/Desktop/Akshan/Javascript/cs4/styles.css) | [`script.js`](file:///c:/Users/aksha/OneDrive/Desktop/Akshan/Javascript/cs4/script.js)

### Overview
An interactive palindrome verification dashboard that accepts user text and sequences, reflects them across a central "Mirror Axis", and analyzes symmetry in real-time.

### Key Concepts Demonstrated:
1. **Different Function Types:**
   - Function Declarations (`cleanString`, `processAndVerify`)
   - Function Expressions (`const reverseString = function(str) { ... }`)
   - Arrow Functions (`const checkEquivalence = (a, b) => a === b;`)
2. **Variable Scopes:**
   - Global Scope (presets, DOM bindings)
   - Function Scope (local helper parameters)
   - Block Scope (`let`, `const` inside loops and conditionals)
3. **Closures for State Preservation:**
   - `createVerificationTracker()` preserves private verification count and historical logs.
   - `createPalindromeEngine(options)` factory locking in case-sensitivity and punctuation rules.
4. **Try-Catch Error Handling:**
   - Safe validation routine catching malformed, null, or out-of-bounds user inputs with user-friendly alerts.

---

## Assignment 2: Focus // Feed (Study vs Instagram Calculator)
**File:** [`focus-vs-feed.html`](file:///c:/Users/aksha/OneDrive/Desktop/Akshan/Javascript/cs4/focus-vs-feed.html) | [`focus-vs-feed.css`](file:///c:/Users/aksha/OneDrive/Desktop/Akshan/Javascript/cs4/focus-vs-feed.css) | [`focus-vs-feed.js`](file:///c:/Users/aksha/OneDrive/Desktop/Akshan/Javascript/cs4/focus-vs-feed.js)

### Overview
An interactive comparison calculator tracking time spent **Studying** versus scrolling on **Instagram**. Users can either run live stopwatches or input time manually, producing real-time ratio comparisons, percentage split bars, and intelligent situational summaries.

### Key Features:
1. **Single-Clock Mutual Exclusion:**
   - Follows the rule: *"One clock runs at a time — because you can't actually do both."*
   - Activating Study automatically stops Instagram, and vice-versa.
2. **Live Stopwatch Ticking:**
   - Tracks seconds in real time (`hh:mm:ss`), updating session tallies automatically.
3. **Manual Entry (`[hh] [mm]`):**
   - Allows direct setting of total hours and minutes for either category.
4. **Balance of the Day Dashboard:**
   - **Visual Comparison Bar**: Dynamic split bar (e.g. 54% vs 46%).
   - **4-Column Metric Grid**: Study Total (`3h 12m`), Instagram Total (`2h 45m`), Ratio (`1.2:1`), Total Tracked (`5h 57m`).
   - **Dynamic Insight Banner**: Real-time summary (`Study is ahead — 1.2× more study time than Instagram time today.`).
   - **Reset Everything Action**: Safely wipes tracked tallies and resets clocks back to zero.

---

## How to View and Run
Open either HTML file directly in any modern web browser:
- Assignment 1: [`index.html`](file:///c:/Users/aksha/OneDrive/Desktop/Akshan/Javascript/cs4/index.html)
- Assignment 2: [`focus-vs-feed.html`](file:///c:/Users/aksha/OneDrive/Desktop/Akshan/Javascript/cs4/focus-vs-feed.html)
