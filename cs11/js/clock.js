/**
 * Clock Module - Handles the live real-time current clock.
 * Uses setInterval() to update every second.
 */

let clockIntervalId = null;

/**
 * Formats a Date object into 'h:mm:ss A' format (e.g., '8:01:02 PM').
 * @param {Date} date 
 * @returns {string} Formatted time string
 */
export function formatCurrentTime(date = new Date()) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12

  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

/**
 * Starts the live clock and invokes onTick on every tick.
 * @param {Function} onTick Callback receiving the formatted time string.
 * @returns {number} The interval ID.
 */
export function startLiveClock(onTick) {
  // Update immediately
  if (typeof onTick === 'function') {
    onTick(formatCurrentTime());
  }

  if (clockIntervalId) {
    clearInterval(clockIntervalId);
  }

  clockIntervalId = setInterval(() => {
    if (typeof onTick === 'function') {
      onTick(formatCurrentTime());
    }
  }, 1000);

  return clockIntervalId;
}

/**
 * Stops the live clock if running.
 */
export function stopLiveClock() {
  if (clockIntervalId) {
    clearInterval(clockIntervalId);
    clockIntervalId = null;
  }
}
