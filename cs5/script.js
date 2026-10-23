// DOM Elements
const numbersInput = document.getElementById('numbersInput');
const sampleBtn = document.getElementById('sampleBtn');
const computeBtn = document.getElementById('computeBtn');
const clearBtn = document.getElementById('clearBtn');
const errorBox = document.getElementById('errorBox');
const resultBox = document.getElementById('resultBox');

const arrayOutput = document.getElementById('arrayOutput');
const minOutput = document.getElementById('minOutput');
const maxOutput = document.getElementById('maxOutput');
const countOutput = document.getElementById('countOutput');
const sumOutput = document.getElementById('sumOutput');
const avgOutput = document.getElementById('avgOutput');

// Sample arrays that users can cycle through
const sampleArrays = [
  '12, 45, 2, 89, 34',
  '100, -15, 42, 0, 999, -4',
  '7, 14, 21, 28, 35, 42',
  '3.14, 2.71, 1.41, 1.73, 0.57',
  '50, 50, 50, 50'
];

let sampleIndex = 0;

/**
 * Parses user input string into an array of numbers.
 * Supports comma, space, tab, and newline separators.
 * @param {string} text 
 * @returns {{ numbers: number[], error: string | null }}
 */
function parseInput(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return { numbers: [], error: 'Please enter at least one number.' };
  }

  // Split by commas, newlines, tabs, and spaces
  const tokens = trimmed.split(/[\s,]+/);
  const numbers = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '') continue;

    const num = Number(token);
    if (isNaN(num)) {
      return { 
        numbers: [], 
        error: `"${token}" is not a valid number. Please check your input.` 
      };
    }
    numbers.push(num);
  }

  if (numbers.length === 0) {
    return { numbers: [], error: 'Please enter at least one valid number.' };
  }

  return { numbers, error: null };
}

/**
 * Computes minimum, maximum, and additional statistics from an array of numbers.
 */
function computeMinMax() {
  const { numbers, error } = parseInput(numbersInput.value);

  if (error) {
    showError(error);
    return;
  }

  hideError();

  // Find min and max
  let min = numbers[0];
  let max = numbers[0];
  let sum = 0;

  for (let i = 0; i < numbers.length; i++) {
    const val = numbers[i];
    if (val < min) min = val;
    if (val > max) max = val;
    sum += val;
  }

  const count = numbers.length;
  const avg = Number((sum / count).toFixed(2));

  // Format array representation
  arrayOutput.textContent = `[${numbers.join(', ')}]`;
  minOutput.textContent = min;
  maxOutput.textContent = max;
  countOutput.textContent = count;
  sumOutput.textContent = Number(sum.toFixed(4));
  avgOutput.textContent = avg;

  resultBox.style.display = 'block';
}

/**
 * Displays error message and hides the results container.
 * @param {string} message 
 */
function showError(message) {
  errorBox.textContent = `⚠️ ${message}`;
  errorBox.style.display = 'flex';
  resultBox.style.display = 'none';
}

/**
 * Hides error message.
 */
function hideError() {
  errorBox.style.display = 'none';
}

// Event Listeners
sampleBtn.addEventListener('click', () => {
  numbersInput.value = sampleArrays[sampleIndex];
  sampleIndex = (sampleIndex + 1) % sampleArrays.length;
  hideError();
  computeMinMax();
});

computeBtn.addEventListener('click', computeMinMax);

clearBtn.addEventListener('click', () => {
  numbersInput.value = '';
  numbersInput.focus();
  hideError();
  resultBox.style.display = 'none';
});

// Shortcut: Ctrl+Enter or Cmd+Enter to compute
numbersInput.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    computeMinMax();
  }
});

// Initialize on page load
computeMinMax();
