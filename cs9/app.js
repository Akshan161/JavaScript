/**
 * AuraTheme - Intelligent Theme Settings & Storage Manager
 * Handles Light/Dark modes, localStorage & sessionStorage persistence,
 * automatic restoration on reload, live storage inspection, and clean erasure.
 */

// Storage Keys
const THEME_KEY = 'aura_theme_preference';
const ENGINE_KEY = 'aura_storage_engine';
const TIMESTAMP_KEY = 'aura_theme_last_saved';

// DOM Element Selectors
const htmlElement = document.documentElement;
const optLight = document.getElementById('optLight');
const optDark = document.getElementById('optDark');
const radioLocalStorage = document.getElementById('radioLocalStorage');
const radioSessionStorage = document.getElementById('radioSessionStorage');
const saveThemeBtn = document.getElementById('saveThemeBtn');
const clearThemeBtn = document.getElementById('clearThemeBtn');
const autoSaveToggle = document.getElementById('autoSaveToggle');
const quickToggleBtn = document.getElementById('quickToggleBtn');
const quickToggleIcon = document.getElementById('quickToggleIcon');
const activeThemeBadge = document.getElementById('activeThemeBadge');
const themeBadgeText = document.getElementById('themeBadgeText');

// Showcase & Inspector DOM
const metricContrast = document.getElementById('metricContrast');
const metricRestored = document.getElementById('metricRestored');
const metricRestoredSub = document.getElementById('metricRestoredSub');
const metricEngine = document.getElementById('metricEngine');
const metricEngineStatus = document.getElementById('metricEngineStatus');
const storageDataViewer = document.getElementById('storageDataViewer');
const lastUpdatedTime = document.getElementById('lastUpdatedTime');
const storageStatusText = document.getElementById('storageStatusText');
const refreshInspectorBtn = document.getElementById('refreshInspectorBtn');
const testReloadBtn = document.getElementById('testReloadBtn');
const resetDemoBtn = document.getElementById('resetDemoBtn');
const toastContainer = document.getElementById('toastContainer');

// Modal Elements
const clearModal = document.getElementById('clearModal');
const cancelClearBtn = document.getElementById('cancelClearBtn');
const confirmClearBtn = document.getElementById('confirmClearBtn');

// Internal App State
const state = {
  selectedTheme: 'light',      // 'light' | 'dark'
  storageEngine: 'localStorage', // 'localStorage' | 'sessionStorage'
  autoSave: true,
  wasRestoredFromStorage: false,
  restoredFromEngine: null,
};

/**
 * Get active storage interface based on engine selection
 * @param {string} engine 
 * @returns {Storage}
 */
function getStorage(engine = state.storageEngine) {
  return engine === 'sessionStorage' ? sessionStorage : localStorage;
}

/**
 * Check if the browser supports Web Storage API safely
 * @param {string} type 
 * @returns {boolean}
 */
function isStorageAvailable(type) {
  try {
    const storage = window[type];
    const testKey = '__test_storage__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Initialize application state from browser storage or system default
 */
function initializeThemeSettings() {
  const localAvail = isStorageAvailable('localStorage');
  const sessionAvail = isStorageAvailable('sessionStorage');

  if (!localAvail && !sessionAvail) {
    showToast('Storage Disabled', 'Browser storage is restricted or disabled in your environment.', 'warning');
    storageStatusText.textContent = 'Storage Restricted';
    storageStatusText.className = 'info-val text-warning';
  }

  // 1. Determine which storage engine was previously saved
  let preferredEngine = 'localStorage';
  try {
    const savedEngine = localStorage.getItem(ENGINE_KEY) || sessionStorage.getItem(ENGINE_KEY);
    if (savedEngine === 'sessionStorage' || savedEngine === 'localStorage') {
      preferredEngine = savedEngine;
    }
  } catch (err) {
    console.warn('Error reading saved engine:', err);
  }
  state.storageEngine = preferredEngine;

  // Sync radio button
  if (preferredEngine === 'sessionStorage') {
    radioSessionStorage.checked = true;
  } else {
    radioLocalStorage.checked = true;
  }

  // 2. Read stored theme preference from the active storage engine or fallback
  let loadedTheme = null;
  let sourceEngine = null;

  try {
    const targetStorage = getStorage(preferredEngine);
    loadedTheme = targetStorage.getItem(THEME_KEY);

    // If not found in preferred, check the other engine just in case
    if (!loadedTheme) {
      const altEngine = preferredEngine === 'localStorage' ? 'sessionStorage' : 'localStorage';
      const altStorage = getStorage(altEngine);
      const altTheme = altStorage.getItem(THEME_KEY);
      if (altTheme) {
        loadedTheme = altTheme;
        sourceEngine = altEngine;
        state.storageEngine = altEngine;
        if (altEngine === 'sessionStorage') {
          radioSessionStorage.checked = true;
        } else {
          radioLocalStorage.checked = true;
        }
      }
    } else {
      sourceEngine = preferredEngine;
    }
  } catch (err) {
    console.warn('Error reading stored theme:', err);
  }

  // 3. Fallback to system preference if no stored theme
  if (loadedTheme === 'light' || loadedTheme === 'dark') {
    state.selectedTheme = loadedTheme;
    state.wasRestoredFromStorage = true;
    state.restoredFromEngine = sourceEngine;
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    state.selectedTheme = prefersDark ? 'dark' : 'light';
    state.wasRestoredFromStorage = false;
    state.restoredFromEngine = null;
  }

  // Apply visual theme to DOM
  applyTheme(state.selectedTheme, false);

  // Update UI cards & metrics
  updateOptionCardsUI();
  updateMetricsDisplay();
  updateStorageInspector();

  if (state.wasRestoredFromStorage) {
    showToast(
      'Preference Restored',
      `Restored "${capitalize(state.selectedTheme)}" mode automatically from ${state.restoredFromEngine}.`,
      'info'
    );
  }
}

/**
 * Apply theme to document and update quick toggle icons
 * @param {string} themeName 'light' | 'dark'
 * @param {boolean} triggerAutoSave 
 */
function applyTheme(themeName, triggerAutoSave = true) {
  state.selectedTheme = themeName;
  htmlElement.setAttribute('data-theme', themeName);

  // Update quick toggle icon
  if (themeName === 'dark') {
    quickToggleIcon.className = 'fa-solid fa-sun';
    quickToggleBtn.setAttribute('title', 'Switch to Light Mode');
    themeBadgeText.textContent = 'Active: Dark';
    metricContrast.textContent = '16.2:1';
  } else {
    quickToggleIcon.className = 'fa-solid fa-moon';
    quickToggleBtn.setAttribute('title', 'Switch to Dark Mode');
    themeBadgeText.textContent = 'Active: Light';
    metricContrast.textContent = '14.8:1';
  }

  updateOptionCardsUI();

  if (triggerAutoSave && state.autoSave) {
    savePreferences(false); // Silent save with no duplicate toasts
  } else {
    updateStorageInspector();
  }
}

/**
 * Update active state classes on the theme selector cards
 */
function updateOptionCardsUI() {
  if (state.selectedTheme === 'dark') {
    optDark.classList.add('active');
    optDark.setAttribute('aria-checked', 'true');
    optLight.classList.remove('active');
    optLight.setAttribute('aria-checked', 'false');
  } else {
    optLight.classList.add('active');
    optLight.setAttribute('aria-checked', 'true');
    optDark.classList.remove('active');
    optDark.setAttribute('aria-checked', 'false');
  }
}

/**
 * Save user theme preference to selected storage mechanism
 * @param {boolean} showUserToast 
 */
function savePreferences(showUserToast = true) {
  try {
    const selectedStorage = getStorage(state.storageEngine);
    const altStorage = getStorage(state.storageEngine === 'localStorage' ? 'sessionStorage' : 'localStorage');
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // Clean up alternative storage to avoid stale conflicting values
    altStorage.removeItem(THEME_KEY);
    altStorage.removeItem(ENGINE_KEY);
    altStorage.removeItem(TIMESTAMP_KEY);

    // Save to the chosen engine
    selectedStorage.setItem(THEME_KEY, state.selectedTheme);
    selectedStorage.setItem(ENGINE_KEY, state.storageEngine);
    selectedStorage.setItem(TIMESTAMP_KEY, now.toISOString());

    // Also keep engine hint in localStorage so head script can retrieve the right engine immediately
    localStorage.setItem(ENGINE_KEY, state.storageEngine);

    state.wasRestoredFromStorage = true;
    state.restoredFromEngine = state.storageEngine;

    updateMetricsDisplay();
    updateStorageInspector();

    if (showUserToast) {
      showToast(
        'Theme Saved Successfully',
        `"${capitalize(state.selectedTheme)}" mode saved in ${state.storageEngine}.`,
        'success'
      );
    }
  } catch (error) {
    console.error('Error saving theme preference:', error);
    showToast('Save Failed', 'Could not access browser storage.', 'danger');
  }
}

/**
 * Clear all stored preferences from both localStorage and sessionStorage
 */
function clearStoredPreferences() {
  try {
    localStorage.removeItem(THEME_KEY);
    localStorage.removeItem(ENGINE_KEY);
    localStorage.removeItem(TIMESTAMP_KEY);

    sessionStorage.removeItem(THEME_KEY);
    sessionStorage.removeItem(ENGINE_KEY);
    sessionStorage.removeItem(TIMESTAMP_KEY);

    state.wasRestoredFromStorage = false;
    state.restoredFromEngine = null;

    // Detect system default
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = prefersDark ? 'dark' : 'light';
    
    // Reset to default without saving
    state.selectedTheme = defaultTheme;
    applyTheme(defaultTheme, false);
    
    updateMetricsDisplay();
    updateStorageInspector();

    showToast(
      'Preferences Cleared',
      'All stored theme settings removed. Reverted to system appearance.',
      'info'
    );
  } catch (error) {
    console.error('Error clearing preferences:', error);
    showToast('Clear Failed', 'Failed to remove preferences from storage.', 'danger');
  }
}

/**
 * Update the Live Showcase Metrics Cards
 */
function updateMetricsDisplay() {
  metricEngine.textContent = state.storageEngine;
  
  if (state.wasRestoredFromStorage) {
    metricRestored.textContent = 'Yes';
    metricRestoredSub.textContent = `Via ${state.restoredFromEngine}`;
  } else {
    metricRestored.textContent = 'Default';
    metricRestoredSub.textContent = 'System default (unsaved)';
  }
}

/**
 * Refresh and render the JSON content of browser storage in the terminal viewer
 */
function updateStorageInspector() {
  const localData = {};
  const sessionData = {};

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('aura_')) {
        localData[key] = localStorage.getItem(key);
      }
    }
  } catch (e) {
    localData['error'] = 'localStorage access restricted';
  }

  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('aura_')) {
        sessionData[key] = sessionStorage.getItem(key);
      }
    }
  } catch (e) {
    sessionData['error'] = 'sessionStorage access restricted';
  }

  const inspectorOutput = {
    active_dom_theme: htmlElement.getAttribute('data-theme'),
    active_storage_engine: state.storageEngine,
    auto_save_mode: state.autoSave,
    is_persisted: state.wasRestoredFromStorage,
    localStorage: Object.keys(localData).length ? localData : '{ empty }',
    sessionStorage: Object.keys(sessionData).length ? sessionData : '{ empty }',
  };

  storageDataViewer.innerHTML = `<code>${formatSyntaxHighlight(JSON.stringify(inspectorOutput, null, 2))}</code>`;
  
  const savedTimestamp = getStorage(state.storageEngine).getItem(TIMESTAMP_KEY);
  if (savedTimestamp) {
    const dateObj = new Date(savedTimestamp);
    lastUpdatedTime.textContent = dateObj.toLocaleTimeString();
  } else {
    lastUpdatedTime.textContent = 'Not stored yet';
  }
}

/**
 * Simple syntax highlighter for JSON in terminal
 * @param {string} jsonStr 
 * @returns {string}
 */
function formatSyntaxHighlight(jsonStr) {
  return jsonStr
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'color: #38bdf8;'; // number/text
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'color: #a78bfa; font-weight: 600;'; // key
        } else {
          cls = 'color: #34d399;'; // string
        }
      } else if (/true|false/.test(match)) {
        cls = 'color: #fbbf24; font-weight: 600;'; // boolean
      } else if (/null/.test(match)) {
        cls = 'color: #f87171;';
      }
      return `<span style="${cls}">${match}</span>`;
    });
}

/**
 * Spawn a toast notification
 * @param {string} title 
 * @param {string} message 
 * @param {'success'|'info'|'warning'|'danger'} type 
 */
function showToast(title, message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: 'fa-solid fa-circle-check',
    info: 'fa-solid fa-circle-info',
    warning: 'fa-solid fa-triangle-exclamation',
    danger: 'fa-solid fa-circle-xmark',
  };

  toast.innerHTML = `
    <div class="toast-icon">
      <i class="${iconMap[type] || 'fa-solid fa-bell'}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${escapeHTML(title)}</div>
      <div class="toast-msg">${escapeHTML(message)}</div>
    </div>
  `;

  toastContainer.appendChild(toast);

  // Auto remove after 3.8s
  setTimeout(() => {
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    });
  }, 3800);
}

/**
 * Utility: Capitalize string
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Utility: Escape HTML for safe rendering
 */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ==========================================================================
   Event Listeners & User Interactions
   ========================================================================== */

// Theme Selection Cards
optLight.addEventListener('click', () => {
  applyTheme('light', true);
});

optLight.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    applyTheme('light', true);
  }
});

optDark.addEventListener('click', () => {
  applyTheme('dark', true);
});

optDark.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    applyTheme('dark', true);
  }
});

// Quick toggle button in header
quickToggleBtn.addEventListener('click', () => {
  const nextTheme = state.selectedTheme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme, true);
});

// Storage Engine Radio Buttons
radioLocalStorage.addEventListener('change', () => {
  if (radioLocalStorage.checked) {
    state.storageEngine = 'localStorage';
    metricEngine.textContent = 'localStorage';
    if (state.autoSave) savePreferences(false);
    updateStorageInspector();
    showToast('Storage Engine Changed', 'Preferences will now be stored in localStorage (persists across reloads).', 'info');
  }
});

radioSessionStorage.addEventListener('change', () => {
  if (radioSessionStorage.checked) {
    state.storageEngine = 'sessionStorage';
    metricEngine.textContent = 'sessionStorage';
    if (state.autoSave) savePreferences(false);
    updateStorageInspector();
    showToast('Storage Engine Changed', 'Preferences will now be stored in sessionStorage (persists for active tab session).', 'info');
  }
});

// Auto-Save Toggle
autoSaveToggle.addEventListener('change', (e) => {
  state.autoSave = e.target.checked;
  showToast(
    state.autoSave ? 'Auto-Save Enabled' : 'Auto-Save Disabled',
    state.autoSave 
      ? 'Theme choices will be saved automatically upon selection.' 
      : 'You must click "Save Preference" button to persist choices.',
    'info'
  );
  updateStorageInspector();
});

// Explicit Save Button
saveThemeBtn.addEventListener('click', () => {
  savePreferences(true);
});

// Clear Preferences Modal Interactions
clearThemeBtn.addEventListener('click', () => {
  clearModal.classList.add('active');
});

cancelClearBtn.addEventListener('click', () => {
  clearModal.classList.remove('active');
});

clearModal.addEventListener('click', (e) => {
  if (e.target === clearModal) {
    clearModal.classList.remove('active');
  }
});

confirmClearBtn.addEventListener('click', () => {
  clearModal.classList.remove('active');
  clearStoredPreferences();
});

// Reset All Demo Data link
resetDemoBtn.addEventListener('click', () => {
  clearStoredPreferences();
});

// Inspector Refresh button
refreshInspectorBtn.addEventListener('click', () => {
  updateStorageInspector();
  showToast('Inspector Refreshed', 'Storage state inspected.', 'info');
});

// Test Page Reload button
testReloadBtn.addEventListener('click', () => {
  showToast('Reloading...', 'Reloading page to demonstrate theme restoration.', 'info');
  setTimeout(() => {
    window.location.reload();
  }, 450);
});

// Listen to OS System Theme changes if user has not stored an explicit choice
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!state.wasRestoredFromStorage) {
    const newSystemTheme = e.matches ? 'dark' : 'light';
    applyTheme(newSystemTheme, false);
    showToast('System Theme Changed', `Applied OS default: ${newSystemTheme} mode.`, 'info');
  }
});

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initializeThemeSettings();
});
