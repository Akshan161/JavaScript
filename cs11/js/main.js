/**
 * Main Application Module - Orchestrates clock, routine schedule, and countdown timer.
 */

import { startLiveClock } from './clock.js';
import { 
  getAllRoutine, 
  getCurrentClass, 
  advanceToNextClass, 
  setClassById, 
  formatClassTitle 
} from './routine.js';
import { 
  startTimer, 
  pauseTimer, 
  resetTimer, 
  setTimerDuration, 
  formatTime, 
  isTimerRunning, 
  getRemainingSeconds, 
  scheduleDelayedAction, 
  cancelDelayedAction 
} from './timer.js';

// DOM Element References
const currentTimeEl = document.getElementById('currentTime');
const currentSubjectVenueEl = document.getElementById('currentSubjectVenue');
const countdownDisplayEl = document.getElementById('countdownDisplay');
const btnStart = document.getElementById('btnStart');
const btnPause = document.getElementById('btnPause');
const btnReset = document.getElementById('btnReset');
const customSecondsInput = document.getElementById('customSecondsInput');
const btnSet = document.getElementById('btnSet');
const statusMessageEl = document.getElementById('statusMessage');
const routineListEl = document.getElementById('routineList');

/**
 * Updates status text and CSS classes.
 * @param {string} text 
 * @param {'ready'|'running'|'paused'|'notification'|'alert'} type 
 */
function updateStatus(text, type = 'ready') {
  statusMessageEl.textContent = text;
  statusMessageEl.className = 'status-message';
  
  if (type === 'ready') statusMessageEl.classList.add('ready-status');
  else if (type === 'running') statusMessageEl.classList.add('running-status');
  else if (type === 'paused') statusMessageEl.classList.add('paused-status');
  else if (type === 'notification') statusMessageEl.classList.add('notification-status');
}

/**
 * Renders the routine list in Card 3 and highlights the active item.
 */
function renderRoutineList() {
  const current = getCurrentClass();
  const routine = getAllRoutine();

  routineListEl.innerHTML = '';

  routine.forEach(item => {
    const li = document.createElement('li');
    li.className = `routine-item ${item.id === current.id ? 'active' : ''}`;
    li.setAttribute('role', 'listitem');
    li.setAttribute('data-id', item.id);
    li.tabIndex = 0;

    li.innerHTML = `
      <span class="routine-col-subject">${item.subject}</span>
      <span class="routine-col-venue">(${item.venue})</span>
      <span class="routine-col-duration">${item.duration}s</span>
    `;

    // Click or Enter key to select this class
    const selectHandler = () => {
      cancelDelayedAction();
      pauseTimer();
      setClassById(item.id);
      loadClassIntoTimer(getCurrentClass());
      renderRoutineList();
    };

    li.addEventListener('click', selectHandler);
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectHandler();
      }
    });

    routineListEl.appendChild(li);
  });
}

/**
 * Loads a class routine item into the upcoming banner and sets timer duration.
 * @param {Object} classItem 
 */
function loadClassIntoTimer(classItem) {
  currentSubjectVenueEl.textContent = formatClassTitle(classItem);
  setTimerDuration(classItem.duration);
  countdownDisplayEl.textContent = formatTime(classItem.duration);
  countdownDisplayEl.classList.remove('alert-active');
  updateStatus('Ready for next class.', 'ready');
}

/**
 * Triggered when a class countdown reaches 00:00.
 * Implements the prompt requirement to notify and transition classes.
 */
function handleTimerComplete() {
  const completedClass = getCurrentClass();
  countdownDisplayEl.textContent = '00:00';
  countdownDisplayEl.classList.remove('alert-active');

  // Display notification matching Fig. 1 caption: "Started: [Subject]!"
  updateStatus(`Started: ${completedClass.subject}!`, 'notification');

  // Use setTimeout() to hold the notification, then transition to the next upcoming class
  scheduleDelayedAction(() => {
    const nextClass = advanceToNextClass();
    loadClassIntoTimer(nextClass);
    renderRoutineList();
  }, 2800);
}

/**
 * Starts the countdown sequence.
 */
function handleStart() {
  cancelDelayedAction();

  if (getRemainingSeconds() <= 0) {
    resetTimer();
    countdownDisplayEl.textContent = formatTime(getRemainingSeconds());
  }

  if (isTimerRunning()) return;

  updateStatus('Countdown running...', 'running');

  startTimer({
    onTick: (remaining) => {
      countdownDisplayEl.textContent = formatTime(remaining);
      if (remaining <= 3 && remaining > 0) {
        countdownDisplayEl.classList.add('alert-active');
      } else {
        countdownDisplayEl.classList.remove('alert-active');
      }
    },
    onComplete: handleTimerComplete
  });
}

/**
 * Pauses the countdown sequence.
 */
function handlePause() {
  cancelDelayedAction();
  if (isTimerRunning()) {
    pauseTimer();
    countdownDisplayEl.classList.remove('alert-active');
    updateStatus('Countdown paused.', 'paused');
  }
}

/**
 * Resets the countdown back to the current class initial duration.
 */
function handleReset() {
  cancelDelayedAction();
  const resetSecs = resetTimer();
  countdownDisplayEl.textContent = formatTime(resetSecs);
  countdownDisplayEl.classList.remove('alert-active');
  updateStatus('Ready for next class.', 'ready');
}

/**
 * Sets a custom countdown duration entered by the user.
 */
function handleCustomSet() {
  cancelDelayedAction();
  const val = parseInt(customSecondsInput.value, 10);

  if (isNaN(val) || val <= 0) {
    updateStatus('Please enter a valid positive number of seconds.', 'alert');
    customSecondsInput.focus();
    return;
  }

  pauseTimer();
  setTimerDuration(val);
  countdownDisplayEl.textContent = formatTime(val);
  countdownDisplayEl.classList.remove('alert-active');
  updateStatus(`Custom timer set (${val}s). Ready for next class.`, 'ready');
  customSecondsInput.value = '';
}

/**
 * Application Initialization
 */
function init() {
  // 1. Initialize real-time live clock (uses setInterval inside clock.js)
  startLiveClock((formattedTime) => {
    currentTimeEl.textContent = formattedTime;
  });

  // 2. Load the initial upcoming class and render routine list
  const initialClass = getCurrentClass();
  loadClassIntoTimer(initialClass);
  renderRoutineList();

  // 3. Attach Event Listeners to controls
  btnStart.addEventListener('click', handleStart);
  btnPause.addEventListener('click', handlePause);
  btnReset.addEventListener('click', handleReset);
  btnSet.addEventListener('click', handleCustomSet);

  // Allow pressing Enter in the seconds input to set
  customSecondsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomSet();
    }
  });
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
