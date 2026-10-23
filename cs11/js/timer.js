/**
 * Timer Module - Handles countdown state, ticking, pausing, resetting, and custom intervals.
 * Utilizes setInterval() for periodic ticks and setTimeout() for scheduled actions.
 */

let intervalId = null;
let currentRemaining = 0;
let initialDuration = 0;
let isRunning = false;
let timeoutDelayId = null;

/**
 * Formats seconds into 'MM:SS' string (e.g., 9 -> '00:09', 75 -> '01:15').
 * @param {number} totalSeconds 
 * @returns {string} Formatted MM:SS
 */
export function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Sets the timer duration.
 * @param {number} seconds 
 */
export function setTimerDuration(seconds) {
  initialDuration = Math.max(0, Number(seconds));
  currentRemaining = initialDuration;
}

/**
 * Starts the countdown timer using setInterval().
 * @param {Object} callbacks
 * @param {Function} callbacks.onTick Called every second with current remaining seconds.
 * @param {Function} callbacks.onComplete Called when the timer reaches 0.
 */
export function startTimer({ onTick, onComplete }) {
  if (isRunning) return;
  if (currentRemaining <= 0) return;

  isRunning = true;

  intervalId = setInterval(() => {
    currentRemaining -= 1;

    if (typeof onTick === 'function') {
      onTick(currentRemaining);
    }

    if (currentRemaining <= 0) {
      stopInterval();
      isRunning = false;
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  }, 1000);
}

/**
 * Pauses the countdown timer.
 */
export function pauseTimer() {
  stopInterval();
  isRunning = false;
}

/**
 * Resets the countdown back to the initial duration.
 * @returns {number} The reset duration in seconds.
 */
export function resetTimer() {
  stopInterval();
  isRunning = false;
  currentRemaining = initialDuration;
  return currentRemaining;
}

/**
 * Helper to clear the active tick interval.
 */
function stopInterval() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

/**
 * Checks if the timer is currently actively ticking.
 * @returns {boolean}
 */
export function isTimerRunning() {
  return isRunning;
}

/**
 * Gets the current remaining seconds.
 * @returns {number}
 */
export function getRemainingSeconds() {
  return currentRemaining;
}

/**
 * Schedules an asynchronous action using setTimeout().
 * Useful for alert notifications and delayed class transitions.
 * @param {Function} callback 
 * @param {number} delayMs 
 * @returns {number} Timeout ID
 */
export function scheduleDelayedAction(callback, delayMs = 2500) {
  if (timeoutDelayId) {
    clearTimeout(timeoutDelayId);
  }
  timeoutDelayId = setTimeout(() => {
    callback();
    timeoutDelayId = null;
  }, delayMs);
  return timeoutDelayId;
}

/**
 * Cancels any active pending delayed action.
 */
export function cancelDelayedAction() {
  if (timeoutDelayId) {
    clearTimeout(timeoutDelayId);
    timeoutDelayId = null;
  }
}
