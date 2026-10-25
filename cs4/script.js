/**
 * =========================================================================
 * ASSIGNMENT: Interactive Palindrome Checker ("Mirror Line")
 * Student Name : Akshan Motghare
 * PRN          : 24070521276
 * File Path    : C:\Users\HP\OneDrive\Desktop\Akshan\JavaScript\cs_4
 *
 * Concepts Demonstrated:
 * 1. Different Function Types:
 *    - Function Declarations (hoisted, named)
 *    - Function Expressions (anonymous or named assigned to variables)
 *    - Arrow Functions (concise syntax, lexical this)
 *    - Higher-Order Functions & Callbacks
 * 2. Variable Scope Isolation:
 *    - Global Scope (presets, DOM references, closure instances)
 *    - Function Scope (local variables within helper routines)
 *    - Block Scope (let/const inside if/loops/try-catch blocks)
 * 3. Closures to Preserve Internal State:
 *    - History & Metric Tracker Closure (preserves execution count & history)
 *    - Configured Palindrome Factory Closure (preserves options state)
 * 4. Exception Handling (Try-Catch-Finally):
 *    - Rigorous validation against unexpected/empty/malformed inputs
 * =========================================================================
 */

// =========================================================================
// 1. GLOBAL SCOPE DEFINITIONS
// =========================================================================
const PRESET_DATA = [
  { label: "Racecar / 12321", text: "Racecar", seq: "12321" },
  { label: "Panama / 9876789", text: "A man, a plan, a canal: Panama", seq: "9876789" },
  { label: "Step on no pets / 100001", text: "Step on no pets", seq: "100001" },
  { label: "Madam / 20202", text: "Madam", seq: "20202" },
  { label: "Non-palindrome", text: "Palindrome", seq: "12345" }
];

// DOM Element References (Cached in Global Scope)
const textInput = document.getElementById("textInput");
const sequenceInput = document.getElementById("sequenceInput");
const ignoreSpacesCheckbox = document.getElementById("ignoreSpaces");
const caseSensitiveCheckbox = document.getElementById("caseSensitive");
const verifyBtn = document.getElementById("verifyBtn");
const clearBtn = document.getElementById("clearBtn");
const presetsGrid = document.getElementById("presetsGrid");
const statusToast = document.getElementById("statusToast");

// Reflection Output References
const textOriginalEl = document.getElementById("textOriginal");
const textProcessedEl = document.getElementById("textProcessed");
const textReversedEl = document.getElementById("textReversed");
const textLengthEl = document.getElementById("textLength");
const textBadgeEl = document.getElementById("textBadge");
const textAlignTilesEl = document.getElementById("textAlignTiles");

const seqOriginalEl = document.getElementById("seqOriginal");
const seqProcessedEl = document.getElementById("seqProcessed");
const seqReversedEl = document.getElementById("seqReversed");
const seqLengthEl = document.getElementById("seqLength");
const seqBadgeEl = document.getElementById("seqBadge");
const seqAlignTilesEl = document.getElementById("seqAlignTiles");


// =========================================================================
// 2. CLOSURE: INTERNAL STATE PRESERVATION
// =========================================================================

/**
 * Closure 1: State Tracker Factory
 * Encapsulates verification count and audit log within a private lexical scope.
 * The outer variables cannot be accessed or modified from the outside.
 */
function createVerificationTracker() {
  // Private enclosed state variables (Closure scope)
  let totalVerifications = 0;
  const historyLog = [];

  return {
    recordVerification: function (inputData, isSuccess) {
      totalVerifications++;
      const record = {
        id: totalVerifications,
        timestamp: new Date().toISOString(),
        input: inputData,
        isSuccess: isSuccess
      };
      historyLog.push(record);
      return record;
    },
    getTotalCount: function () {
      return totalVerifications;
    },
    getHistory: function () {
      return [...historyLog]; // Return shallow copy to prevent external mutation
    },
    reset: function () {
      totalVerifications = 0;
      historyLog.length = 0;
    }
  };
}

// Instantiate closure tracker in global scope
const appStateTracker = createVerificationTracker();


/**
 * Closure 2: Configured Checker Factory
 * Generates an evaluation closure with locked-in processing parameters.
 */
const createPalindromeEngine = function (options) {
  // Enclosed configurations
  const config = { ...options };

  return function (rawString) {
    // Normalization logic utilizing enclosed config
    return processAndVerify(rawString, config);
  };
};


// =========================================================================
// 3. DEMONSTRATION OF DIFFERENT FUNCTION TYPES
// =========================================================================

/**
 * Type A: FUNCTION DECLARATION
 * Hoisted function to clean and normalize a given raw string.
 * Demonstrates local function scope & block scoping.
 */
function cleanString(input, ignorePunctuation, caseSensitive) {
  // Function-scoped variable
  let sanitized = String(input);

  // Block scope demonstration
  if (!caseSensitive) {
    sanitized = sanitized.toLowerCase();
  }

  if (ignorePunctuation) {
    // Remove all whitespace and non-alphanumeric punctuation
    sanitized = sanitized.replace(/[^a-zA-Z0-9]/g, "");
  }

  return sanitized;
}

/**
 * Type B: FUNCTION EXPRESSION
 * Assigned to a const variable. Reverses a string using array manipulations.
 */
const reverseString = function (str) {
  if (typeof str !== "string") {
    str = String(str);
  }
  return str.split("").reverse().join("");
};

/**
 * Type C: ARROW FUNCTION
 * Concise arrow function syntax for equivalence testing.
 */
const checkEquivalence = (strA, strB) => strA === strB;

/**
 * Type D: HIGHER-ORDER PROCESSING FUNCTION
 * Core verification routine coordinating normalization, reversal, and alignment.
 */
function processAndVerify(rawString, options) {
  // Validate and normalize
  const processed = cleanString(rawString, options.ignorePunctuation, options.caseSensitive);
  const reversed = reverseString(processed);
  const isMatch = checkEquivalence(processed, reversed);

  // Character alignment matrix (to display mirrored tiles)
  const alignment = [];
  const len = processed.length;
  for (let i = 0; i < len; i++) {
    const charForward = processed[i];
    const charBackward = processed[len - 1 - i];
    alignment.push({
      char: charForward,
      isMatching: charForward === charBackward
    });
  }

  return {
    original: rawString,
    processed: processed,
    reversed: reversed,
    length: processed.length,
    isPalindrome: isMatch,
    alignment: alignment
  };
}


// =========================================================================
// 4. TRY-CATCH ERROR HANDLING & VALIDATION
// =========================================================================

/**
 * Validates input safely with comprehensive try-catch exception handling.
 */
function safelyVerifyInput(rawInput, inputFieldName, options) {
  try {
    // Check for null or undefined
    if (rawInput === null || rawInput === undefined) {
      throw new Error(`The ${inputFieldName} value is undefined.`);
    }

    const trimmed = String(rawInput).trim();
    if (trimmed.length === 0) {
      throw new Error(`Please provide a valid ${inputFieldName} to verify.`);
    }

    if (trimmed.length > 500) {
      throw new Error(`The ${inputFieldName} exceeds the maximum length limit of 500 characters.`);
    }

    // Process palindrome through engine
    const engine = createPalindromeEngine(options);
    const result = engine(rawInput);

    // Record verification into closure state
    appStateTracker.recordVerification(rawInput, result.isPalindrome);

    return { success: true, data: result };
  } catch (error) {
    // Catch, log, and propagate user-friendly error object
    console.error(`Verification error for ${inputFieldName}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  } finally {
    // Finally block executes cleanups or telemetry if needed
  }
}


// =========================================================================
// 5. UI CONTROLLER & RENDERING
// =========================================================================

/**
 * Updates UI Card with verification results
 */
const renderCardOutput = (result, originalEl, processedEl, reversedEl, lengthEl, badgeEl, tilesContainer) => {
  if (!result || !result.success) {
    // Handle error or empty state
    originalEl.textContent = "-";
    processedEl.textContent = "-";
    reversedEl.textContent = "-";
    lengthEl.textContent = "0";
    badgeEl.className = "status-badge status-non-palindrome";
    badgeEl.innerHTML = `<span class="badge-icon">&#x2715;</span> Invalid Input`;
    tilesContainer.innerHTML = `<span style="font-size: 11px; color: #94a3b8; font-style: italic;">No characters to align</span>`;
    return;
  }

  const data = result.data;

  originalEl.textContent = data.original;
  processedEl.textContent = data.processed || "(empty)";
  reversedEl.textContent = data.reversed || "(empty)";
  lengthEl.textContent = data.length;

  if (data.isPalindrome && data.length > 0) {
    badgeEl.className = "status-badge status-palindrome";
    badgeEl.innerHTML = `<span class="badge-icon">&#x2713;</span> Palindrome`;
  } else {
    badgeEl.className = "status-badge status-non-palindrome";
    badgeEl.innerHTML = `<span class="badge-icon">&#x2715;</span> Not Palindrome`;
  }

  // Render alignment tiles
  tilesContainer.innerHTML = "";
  if (data.alignment.length === 0) {
    tilesContainer.innerHTML = `<span style="font-size: 11px; color: #94a3b8; font-style: italic;">Empty sequence</span>`;
  } else {
    data.alignment.forEach((item) => {
      const tile = document.createElement("span");
      tile.className = `char-tile ${item.isMatching ? "match" : "mismatch"}`;
      tile.textContent = item.char;
      tilesContainer.appendChild(tile);
    });
  }
};

/**
 * Displays or hides toast alert messages
 */
function showStatusToast(message, isError = false) {
  if (!message) {
    statusToast.className = "status-toast hidden";
    statusToast.textContent = "";
    return;
  }
  statusToast.className = `status-toast ${isError ? "error" : "success"}`;
  statusToast.textContent = message;
}

/**
 * Main Controller Execution Function
 */
function executeVerification() {
  showStatusToast(null);

  const options = {
    ignorePunctuation: ignoreSpacesCheckbox.checked,
    caseSensitive: caseSensitiveCheckbox.checked
  };

  const textVal = textInput.value;
  const seqVal = sequenceInput.value;

  let hasError = false;
  let errorMsgs = [];

  // Verify Text
  const textResult = safelyVerifyInput(textVal, "Text / word", options);
  if (!textResult.success) {
    hasError = true;
    errorMsgs.push(textResult.error);
  }
  renderCardOutput(
    textResult,
    textOriginalEl,
    textProcessedEl,
    textReversedEl,
    textLengthEl,
    textBadgeEl,
    textAlignTilesEl
  );

  // Verify Sequence
  const seqResult = safelyVerifyInput(seqVal, "Number / sequence", options);
  if (!seqResult.success) {
    hasError = true;
    errorMsgs.push(seqResult.error);
  }
  renderCardOutput(
    seqResult,
    seqOriginalEl,
    seqProcessedEl,
    seqReversedEl,
    seqLengthEl,
    seqBadgeEl,
    seqAlignTilesEl
  );

  if (hasError) {
    showStatusToast(errorMsgs.join(" | "), true);
  }
}

/**
 * Clear All Functionality
 */
function handleClearAll() {
  textInput.value = "";
  sequenceInput.value = "";
  showStatusToast(null);

  // Clear presets active styling
  document.querySelectorAll(".preset-btn").forEach((btn) => btn.classList.remove("active"));

  // Reset cards display
  [textOriginalEl, textProcessedEl, textReversedEl, seqOriginalEl, seqProcessedEl, seqReversedEl].forEach(
    (el) => (el.textContent = "-")
  );
  textLengthEl.textContent = "0";
  seqLengthEl.textContent = "0";

  textBadgeEl.className = "status-badge status-non-palindrome";
  textBadgeEl.innerHTML = `<span class="badge-icon">&#x2014;</span> Cleared`;

  seqBadgeEl.className = "status-badge status-non-palindrome";
  seqBadgeEl.innerHTML = `<span class="badge-icon">&#x2014;</span> Cleared`;

  textAlignTilesEl.innerHTML = `<span style="font-size: 11px; color: #94a3b8; font-style: italic;">Cleared</span>`;
  seqAlignTilesEl.innerHTML = `<span style="font-size: 11px; color: #94a3b8; font-style: italic;">Cleared</span>`;
}


// =========================================================================
// 6. EVENT LISTENERS & INITIALIZATION
// =========================================================================

// Preset button handlers
document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".preset-btn").forEach((b) => b.classList.remove("active"));
    this.classList.add("active");

    const text = this.getAttribute("data-text");
    const seq = this.getAttribute("data-seq");

    textInput.value = text;
    sequenceInput.value = seq;

    executeVerification();
  });
});

// Verify & Clear Buttons
verifyBtn.addEventListener("click", executeVerification);
clearBtn.addEventListener("click", handleClearAll);

// Real-time updates on checkbox change
ignoreSpacesCheckbox.addEventListener("change", executeVerification);
caseSensitiveCheckbox.addEventListener("change", executeVerification);

// Enable Enter key on inputs
textInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") executeVerification();
});
sequenceInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") executeVerification();
});

// Initial load: Set initial values ("Madam" / "20202") and run verification to mirror the screenshot exactly
window.addEventListener("DOMContentLoaded", () => {
  textInput.value = "Madam";
  sequenceInput.value = "20202";
  ignoreSpacesCheckbox.checked = true;
  caseSensitiveCheckbox.checked = false;
  executeVerification();
});
