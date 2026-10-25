/**
 * =========================================================================
 * ASSIGNMENT: Interactive Study vs Instagram Calculator ("Focus // Feed")
 * Student Name : Akshan Motghare
 * PRN          : 24070521276
 * File Path    : C:\Users\HP\OneDrive\Desktop\Akshan\JavaScript\cs_4\focus-vs-feed.html
 *
 * Core Features:
 * 1. Mutual-exclusion Stopwatch: One clock runs at a time.
 * 2. Manual Time Setting: Set study or Instagram time directly via hh:mm inputs.
 * 3. Dynamic Balance Metrics:
 *    - Real-time comparison progress bar and percentage split
 *    - Total study & Instagram time formatted in hours and minutes
 *    - Relative ratio calculation (e.g. 1.2:1)
 *    - Total accumulated tracked time
 *    - Smart situational insight text
 * 4. Session Tracker & Complete Reset functionality
 * =========================================================================
 */

// =========================================================================
// 1. STATE MANAGEMENT
// =========================================================================
const AppState = {
  // Initial state set to match the exact values in the assignment screenshots
  studySeconds: 3 * 3600 + 12 * 60,       // 3h 12m = 11,520 seconds
  feedSeconds: 2 * 3600 + 45 * 60 + 27,   // 2h 45m 27s = 9,927 seconds
  studySessions: 2,
  feedSessions: 2,
  activeClock: null, // 'study' | 'feed' | null
  timerIntervalId: null
};

// =========================================================================
// 2. DOM ELEMENT REFERENCES
// =========================================================================
// Study Elements
const studyColumn = document.getElementById("studyColumn");
const studyTimerDisplay = document.getElementById("studyTimerDisplay");
const studyToggleBtn = document.getElementById("studyToggleBtn");
const studySessionText = document.getElementById("studySessionText");
const studyHoursInput = document.getElementById("studyHoursInput");
const studyMinutesInput = document.getElementById("studyMinutesInput");
const studySetTotalBtn = document.getElementById("studySetTotalBtn");

// Feed (Instagram) Elements
const feedColumn = document.getElementById("feedColumn");
const feedTimerDisplay = document.getElementById("feedTimerDisplay");
const feedToggleBtn = document.getElementById("feedToggleBtn");
const feedSessionText = document.getElementById("feedSessionText");
const feedHoursInput = document.getElementById("feedHoursInput");
const feedMinutesInput = document.getElementById("feedMinutesInput");
const feedSetTotalBtn = document.getElementById("feedSetTotalBtn");

// Balance & Stats Elements
const studyProgressBar = document.getElementById("studyProgressBar");
const feedProgressBar = document.getElementById("feedProgressBar");
const studyPercentage = document.getElementById("studyPercentage");
const feedPercentage = document.getElementById("feedPercentage");
const statStudyTotal = document.getElementById("statStudyTotal");
const statFeedTotal = document.getElementById("statFeedTotal");
const statRatio = document.getElementById("statRatio");
const statTotalTracked = document.getElementById("statTotalTracked");
const insightBanner = document.getElementById("insightBanner");
const insightText = document.getElementById("insightText");
const resetBtn = document.getElementById("resetBtn");


// =========================================================================
// 3. UTILITY & FORMATTING FUNCTIONS
// =========================================================================

/**
 * Formats seconds into HH:MM:SS string
 * @param {number} totalSec
 * @returns {string} e.g. "03:12:00"
 */
function formatHHMMSS(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

/**
 * Formats seconds into "Xh Ym" string
 * @param {number} totalSec
 * @returns {string} e.g. "3h 12m"
 */
function formatHoursMinutes(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  return `${h}h ${m}m`;
}


// =========================================================================
// 4. STATS & BALANCE CALCULATIONS
// =========================================================================

/**
 * Recomputes all summary statistics, percentages, and comparison text
 */
function updateBalanceMetrics() {
  const studySec = AppState.studySeconds;
  const feedSec = AppState.feedSeconds;
  const totalSec = studySec + feedSec;

  // 1. Update Timer Displays
  studyTimerDisplay.textContent = formatHHMMSS(studySec);
  feedTimerDisplay.textContent = formatHHMMSS(feedSec);

  // 2. Update Session Counts
  studySessionText.textContent = `${AppState.studySessions} session${AppState.studySessions === 1 ? "" : "s"} today`;
  feedSessionText.textContent = `${AppState.feedSessions} session${AppState.feedSessions === 1 ? "" : "s"} today`;

  // 3. Update Stat Columns
  statStudyTotal.textContent = formatHoursMinutes(studySec);
  statFeedTotal.textContent = formatHoursMinutes(feedSec);
  statTotalTracked.textContent = formatHoursMinutes(totalSec);

  // 4. Ratio Calculation
  if (studySec === 0 && feedSec === 0) {
    statRatio.textContent = "0:0";
  } else if (feedSec === 0) {
    statRatio.textContent = "1:0";
  } else if (studySec === 0) {
    statRatio.textContent = "0:1";
  } else {
    // Standard decimal ratio representation matching screenshot
    const ratioVal = (studySec / feedSec).toFixed(1);
    statRatio.textContent = `${ratioVal}:1`;
  }

  // 5. Percentages & Comparison Bar
  let studyPct = 50;
  let feedPct = 50;

  if (totalSec > 0) {
    studyPct = Math.round((studySec / totalSec) * 100);
    feedPct = 100 - studyPct;
  }

  studyProgressBar.style.width = `${studyPct}%`;
  feedProgressBar.style.width = `${feedPct}%`;
  studyPercentage.textContent = `${studyPct}%`;
  feedPercentage.textContent = `${feedPct}%`;

  // 6. Insight Text
  if (totalSec === 0) {
    insightText.textContent = "No activity tracked yet. Start studying or scrolling!";
  } else if (studySec > feedSec) {
    const factor = (studySec / (feedSec || 1)).toFixed(1);
    insightText.innerHTML = `Study is ahead &mdash; ${factor}&times; more study time than Instagram time today.`;
  } else if (feedSec > studySec) {
    const factor = (feedSec / (studySec || 1)).toFixed(1);
    insightText.innerHTML = `Instagram is ahead &mdash; ${factor}&times; more Instagram time than study time today.`;
  } else {
    insightText.innerHTML = `Perfect balance &mdash; equal study and Instagram time today.`;
  }
}


// =========================================================================
// 5. STOPWATCH CONTROLLER (MUTUAL EXCLUSION)
// =========================================================================

/**
 * Ticks the active stopwatch every second
 */
function onClockTick() {
  if (AppState.activeClock === "study") {
    AppState.studySeconds++;
  } else if (AppState.activeClock === "feed") {
    AppState.feedSeconds++;
  }
  updateBalanceMetrics();
}

/**
 * Starts or switches the stopwatch to the given target ('study' | 'feed')
 */
function startClock(target) {
  // If target is already active, pause it
  if (AppState.activeClock === target) {
    stopActiveClock();
    return;
  }

  // If another clock was running, stop it first (Single clock rule)
  if (AppState.activeClock !== null) {
    stopActiveClock();
  }

  AppState.activeClock = target;

  if (target === "study") {
    AppState.studySessions++;
    studyColumn.classList.add("active-running");
    studyToggleBtn.textContent = "Pause Studying";
    studyToggleBtn.style.background = "#0284c7";
    studyToggleBtn.style.color = "#ffffff";
  } else if (target === "feed") {
    AppState.feedSessions++;
    feedColumn.classList.add("active-running");
    feedToggleBtn.textContent = "Pause Scrolling";
    feedToggleBtn.style.background = "#0284c7";
    feedToggleBtn.style.color = "#ffffff";
  }

  AppState.timerIntervalId = setInterval(onClockTick, 1000);
  updateBalanceMetrics();
}

/**
 * Stops any currently running clock
 */
function stopActiveClock() {
  if (AppState.timerIntervalId) {
    clearInterval(AppState.timerIntervalId);
    AppState.timerIntervalId = null;
  }

  if (AppState.activeClock === "study") {
    studyColumn.classList.remove("active-running");
    studyToggleBtn.textContent = "Start Studying";
    studyToggleBtn.style.background = "transparent";
    studyToggleBtn.style.color = "#0284c7";
  } else if (AppState.activeClock === "feed") {
    feedColumn.classList.remove("active-running");
    feedToggleBtn.textContent = "Start Scrolling";
    feedToggleBtn.style.background = "transparent";
    feedToggleBtn.style.color = "#38bdf8";
  }

  AppState.activeClock = null;
}


// =========================================================================
// 6. MANUAL ENTRY CONTROLLER
// =========================================================================

function handleSetManualStudy() {
  const hours = parseInt(studyHoursInput.value, 10) || 0;
  const minutes = parseInt(studyMinutesInput.value, 10) || 0;

  if (hours < 0 || minutes < 0 || minutes > 59) {
    alert("Please enter valid positive values (0-99 hours, 0-59 minutes).");
    return;
  }

  AppState.studySeconds = hours * 3600 + minutes * 60;
  studyHoursInput.value = "";
  studyMinutesInput.value = "";
  updateBalanceMetrics();
}

function handleSetManualFeed() {
  const hours = parseInt(feedHoursInput.value, 10) || 0;
  const minutes = parseInt(feedMinutesInput.value, 10) || 0;

  if (hours < 0 || minutes < 0 || minutes > 59) {
    alert("Please enter valid positive values (0-99 hours, 0-59 minutes).");
    return;
  }

  AppState.feedSeconds = hours * 3600 + minutes * 60;
  feedHoursInput.value = "";
  feedMinutesInput.value = "";
  updateBalanceMetrics();
}


// =========================================================================
// 7. RESET EVERYTHING CONTROLLER
// =========================================================================

function handleResetAll() {
  stopActiveClock();

  AppState.studySeconds = 0;
  AppState.feedSeconds = 0;
  AppState.studySessions = 0;
  AppState.feedSessions = 0;

  updateBalanceMetrics();
}


// =========================================================================
// 8. EVENT ATTACHMENT & INITIAL LOAD
// =========================================================================

studyToggleBtn.addEventListener("click", () => startClock("study"));
feedToggleBtn.addEventListener("click", () => startClock("feed"));

studySetTotalBtn.addEventListener("click", handleSetManualStudy);
feedSetTotalBtn.addEventListener("click", handleSetManualFeed);

studyMinutesInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSetManualStudy();
});
feedMinutesInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSetManualFeed();
});

resetBtn.addEventListener("click", handleResetAll);

// Run initial metrics calculation on DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  updateBalanceMetrics();
});
