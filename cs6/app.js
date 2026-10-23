/**
 * EXPERIMENT 6: STRING FUNCTIONS & REGEX ANALYTICS STUDIO
 * Interactive Suite for Email Validation, Unstructured Data Extraction,
 * Deep Text Analytics & Regex Parsing.
 * Developer: Akshan
 */

// =============================================================================
// State Management
// =============================================================================
const AppState = {
  theme: localStorage.getItem('cs6_theme') || 'dark',
  studentName: localStorage.getItem('cs6_student_name') || 'AKSHAN',
  studentPRN: localStorage.getItem('cs6_student_prn') || '24070521000',
  transformationCount: 7,
  activeFilter: 'all',
  extractedEntities: [],
  stringHistory: [
    { method: 'toUpperCase()', preview: 'WELCOME TO EXPERIMENT 6...' },
    { method: 'replaceAll()', preview: 'Replaced target words' }
  ]
};

// Benchmark Sample Text (as seen in lab experiment specifications)
const BENCHMARK_TEXT_WITH_MAIL = 
`WELCOME TO EXPERIMENT 6! PLEASE SEND YOUR QUESTIONS TO DEVELOPER AT AKSHAN.DEV@GMAIL.COM AND SUPPORT@UNIVERSITY.EDU.IN. REGULAR EXPRESSIONS AND STRING METHODS ALLOW DEVELOPERS TO EASILY PARSE, SANITIZE, AND ANALYZE TEXTUAL DATA FOR MAIL PRESENCE.`;

const BENCHMARK_TEXT_WITHOUT_MAIL = 
`WELCOME TO EXPERIMENT 6! REGULAR EXPRESSIONS AND STRING METHODS ALLOW DEVELOPERS TO EASILY PARSE, SANITIZE, AND ANALYZE TEXTUAL DATA. ALL SENSITIVE CONTACT CHANNELS HAVE BEEN STRIPPED FROM THIS TEXT STREAM.`;

const UNSTRUCTURED_DOCUMENT_SAMPLE = 
`ACADEMIC PROJECT REPORT - EXPERIMENT 6
Submitted by: Lead Developer Akshan (akshan.dev@university.edu.in)
Emergency contact: +91-9876543210 or alternate (022) 2854-9988.
Project repository: https://github.com/akshan/web-dev-lab
Official documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript
Server Gateway IP: 192.168.1.104
Database Host IP: 10.0.0.45
Social tags: #WebDev #JavaScript #Experiment6 @CodingLab @DeanOffice
Please also reach secondary auditor at audit.verify@cert-authority.org for compliance confirmation.`;

// =============================================================================
// Initialization
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initStudentInfo();
  initNavigationTabs();
  initAnalysisModule();
  initEmailValidatorModule();
  initExtractionModule();
  initStringFunctionsModule();
  initRegexTesterModule();
  initModals();

  // Load benchmark text into analysis module by default
  const analysisInput = document.getElementById('analysisTextInput');
  if (analysisInput) {
    analysisInput.value = BENCHMARK_TEXT_WITH_MAIL;
    runTextAnalysis();
  }
});

// =============================================================================
// 1. Theme Engine & Student Credentials
// =============================================================================
function initThemeEngine() {
  const themeSelect = document.getElementById('themeSelect');
  document.documentElement.setAttribute('data-theme', AppState.theme);
  if (themeSelect) {
    themeSelect.value = AppState.theme;
    themeSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      AppState.theme = selected;
      document.documentElement.setAttribute('data-theme', selected);
      localStorage.setItem('cs6_theme', selected);
    });
  }
}

function initStudentInfo() {
  updateStudentDisplay();

  const chip = document.getElementById('studentChip');
  const editBtn = document.getElementById('editStudentBtn');
  const modal = document.getElementById('studentModal');

  const openModal = () => {
    document.getElementById('inputModalName').value = AppState.studentName;
    document.getElementById('inputModalPRN').value = AppState.studentPRN;
    modal.style.display = 'flex';
  };

  if (chip) chip.addEventListener('click', openModal);
  if (editBtn) editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal();
  });
}

function updateStudentDisplay() {
  document.getElementById('studentName').textContent = AppState.studentName;
  document.getElementById('studentPRN').textContent = AppState.studentPRN;
  document.getElementById('footerAuthor').textContent = AppState.studentName;
  document.getElementById('footerPRN').textContent = AppState.studentPRN;
}

// =============================================================================
// 2. Navigation Tabs System
// =============================================================================
function initNavigationTabs() {
  const tabButtons = document.querySelectorAll('.nav-tab-pill');
  const panels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const targetId = btn.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      // If switching to regex or email, trigger live evaluation
      if (targetId === 'panel-regex') runRegexTesting();
      if (targetId === 'panel-email') validateCurrentEmail();
      if (targetId === 'panel-extract') runDataExtraction();
    });
  });

  // Global Presets & Resets
  const btnLoadBenchmark = document.getElementById('loadLabPresetBtn');
  if (btnLoadBenchmark) {
    btnLoadBenchmark.addEventListener('click', () => {
      const input = document.getElementById('analysisTextInput');
      input.value = BENCHMARK_TEXT_WITH_MAIL;
      // Switch to analysis tab
      document.getElementById('tab-btn-analysis').click();
      runTextAnalysis();
    });
  }

  const btnClearAll = document.getElementById('clearAllBtn');
  if (btnClearAll) {
    btnClearAll.addEventListener('click', () => {
      document.getElementById('analysisTextInput').value = '';
      runTextAnalysis();
    });
  }
}

// =============================================================================
// 3. TAB 4: Text Analysis & Mail Check (Primary Lab Component)
// =============================================================================
function initAnalysisModule() {
  const textarea = document.getElementById('analysisTextInput');
  const testBtn = document.getElementById('btnTestMailPresence');
  const sampleWithMailBtn = document.getElementById('btnSampleWithMail');
  const sampleWithoutMailBtn = document.getElementById('btnSampleWithoutMail');

  if (textarea) {
    textarea.addEventListener('input', () => {
      updateCharCounter();
      runTextAnalysis();
    });
  }

  if (testBtn) {
    testBtn.addEventListener('click', runTextAnalysis);
  }

  if (sampleWithMailBtn) {
    sampleWithMailBtn.addEventListener('click', () => {
      textarea.value = BENCHMARK_TEXT_WITH_MAIL;
      updateCharCounter();
      runTextAnalysis();
    });
  }

  if (sampleWithoutMailBtn) {
    sampleWithoutMailBtn.addEventListener('click', () => {
      textarea.value = BENCHMARK_TEXT_WITHOUT_MAIL;
      updateCharCounter();
      runTextAnalysis();
    });
  }
}

function updateCharCounter() {
  const text = document.getElementById('analysisTextInput').value;
  document.getElementById('analysisCharCounter').textContent = `${text.length} characters`;
}

function runTextAnalysis() {
  const text = document.getElementById('analysisTextInput').value;
  updateCharCounter();

  // 1. Core Metrics Breakdown
  const wordsArray = text.trim() ? text.trim().match(/\b[a-zA-Z0-9_\'-]+\b/g) || [] : [];
  const totalWords = wordsArray.length;
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+/g) || [text]).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
  const readTimeMin = Math.max(1, Math.ceil(totalWords / 200));

  document.getElementById('metricTotalWords').textContent = totalWords;
  document.getElementById('metricCharsSpaces').textContent = charsWithSpaces;
  document.getElementById('metricCharsNoSpaces').textContent = charsNoSpaces;
  document.getElementById('metricSentences').textContent = sentences;
  document.getElementById('metricParagraphs').textContent = paragraphs;
  document.getElementById('metricReadTime').textContent = `${readTimeMin} min`;

  // Update Global KPI Banner
  document.getElementById('kpiWordsVal').textContent = totalWords;

  // 2. Flesch Reading Ease Score
  calculateFleschScore(text, totalWords, sentences);

  // 3. Character Distribution (Uppercase, Lowercase, Digits, Symbols, Spaces)
  analyzeCharacterDistribution(text);

  // 4. Keyword Frequencies
  analyzeKeywordFrequencies(wordsArray);

  // 5. Mail Presence & Entity Footprint
  analyzeMailPresence(text);
}

function calculateFleschScore(text, totalWords, sentences) {
  const fleschBadge = document.getElementById('fleschBadge');
  if (totalWords === 0 || sentences === 0) {
    fleschBadge.textContent = 'Flesch Score: N/A';
    fleschBadge.className = 'pill-badge';
    return;
  }

  // Count approximate syllables
  let syllableCount = 0;
  const words = text.toLowerCase().match(/[a-z]+/g) || [];
  words.forEach(w => {
    let wordSyllables = (w.match(/[aeiouy]{1,2}/g) || []).length;
    if (w.endsWith('e') && !w.endsWith('le') && wordSyllables > 1) wordSyllables--;
    syllableCount += Math.max(1, wordSyllables);
  });

  // Flesch formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
  const score = Math.round(206.835 - 1.015 * (totalWords / sentences) - 84.6 * (syllableCount / totalWords));
  const clampedScore = Math.min(100, Math.max(0, score));

  let label = 'Standard';
  let badgeClass = 'pill-badge badge-flesch';

  if (clampedScore >= 90) label = 'Very Easy';
  else if (clampedScore >= 70) label = 'Easy';
  else if (clampedScore >= 50) label = 'Fairly Difficult';
  else if (clampedScore >= 30) label = 'Difficult';
  else {
    label = 'Very Confusing';
  }

  fleschBadge.textContent = `Flesch Score: ${clampedScore} (${label})`;
}

function analyzeCharacterDistribution(text) {
  const total = text.length || 1;
  const upperCount = (text.match(/[A-Z]/g) || []).length;
  const lowerCount = (text.match(/[a-z]/g) || []).length;
  const digitsCount = (text.match(/[0-9]/g) || []).length;
  const spacesCount = (text.match(/\s/g) || []).length;
  const symbolsCount = (text.match(/[^A-Za-z0-9\s]/g) || []).length;

  document.getElementById('cntUpper').textContent = upperCount;
  document.getElementById('cntLower').textContent = lowerCount;
  document.getElementById('cntDigits').textContent = digitsCount;
  document.getElementById('cntSymbols').textContent = symbolsCount;
  document.getElementById('cntSpaces').textContent = spacesCount;

  // Track bar segments
  document.getElementById('segUpper').style.width = `${(upperCount / total) * 100}%`;
  document.getElementById('segLower').style.width = `${(lowerCount / total) * 100}%`;
  document.getElementById('segDigits').style.width = `${(digitsCount / total) * 100}%`;
  document.getElementById('segSymbols').style.width = `${(symbolsCount / total) * 100}%`;
  document.getElementById('segSpaces').style.width = `${(spacesCount / total) * 100}%`;
}

function analyzeKeywordFrequencies(wordsArray) {
  const chartList = document.getElementById('keywordsChartList');
  chartList.innerHTML = '';

  if (wordsArray.length === 0) {
    chartList.innerHTML = '<span style="font-size: 0.85rem; color: var(--text-subtle);">No keywords to analyze.</span>';
    return;
  }

  // Count frequencies (case-insensitive)
  const freqMap = {};
  wordsArray.forEach(w => {
    const cleaned = w.toLowerCase();
    freqMap[cleaned] = (freqMap[cleaned] || 0) + 1;
  });

  // Sort descending
  const sortedWords = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);
  const maxFreq = sortedWords[0] ? sortedWords[0][1] : 1;
  const topList = sortedWords.slice(0, 7);

  topList.forEach(([word, count]) => {
    const percentage = Math.round((count / maxFreq) * 100);
    const row = document.createElement('div');
    row.className = 'keyword-row';
    row.innerHTML = `
      <div class="keyword-word" title="${word}">${word}</div>
      <div class="keyword-bar-track">
        <div class="keyword-bar-fill" style="width: ${percentage}%;"></div>
      </div>
      <div class="keyword-count">${count}x</div>
    `;
    chartList.appendChild(row);
  });
}

function analyzeMailPresence(text) {
  // Email regex
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  const emails = text.match(emailRegex) || [];
  // Deduplicate
  const uniqueEmails = [...new Set(emails.map(e => e.toUpperCase()))];

  // Phone regex
  const phoneRegex = /\+?[0-9]{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
  const phones = (text.match(phoneRegex) || []).filter(p => p.trim().length >= 7);

  // URL regex
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
  const urls = text.match(urlRegex) || [];

  // Tags & Mentions regex
  const tagsRegex = /[@#][a-zA-Z0-9_.-]+/g;
  const tags = text.match(tagsRegex) || [];

  // Mail Status Banner & List
  const banner = document.getElementById('mailStatusBanner');
  const bannerTitle = document.getElementById('mailBannerTitle');
  const bannerDesc = document.getElementById('mailBannerDesc');
  const detectedList = document.getElementById('detectedMailsList');
  const kpiEmailVal = document.getElementById('kpiEmailVal');

  if (uniqueEmails.length > 0) {
    banner.className = 'status-banner banner-success';
    bannerTitle.textContent = `MAIL DETECTED: YES (${uniqueEmails.length} email address(es) found)`;
    bannerDesc.textContent = 'Analyzed text contains valid email/mail address data matching RFC criteria.';
    kpiEmailVal.textContent = 'Pass (Valid)';
    kpiEmailVal.className = 'kpi-val status-pass';

    detectedList.innerHTML = uniqueEmails.map(mail => `
      <div class="email-chip">
        <span class="chip-icon">📧</span>
        <span class="chip-text">${mail}</span>
        <button class="chip-copy-btn" title="Copy email" onclick="navigator.clipboard.writeText('${mail}')">📋</button>
      </div>
    `).join('');
  } else {
    banner.className = 'status-banner banner-fail';
    bannerTitle.textContent = 'NO MAIL DETECTED: (0 email addresses found)';
    bannerDesc.textContent = 'The analyzed content does not contain any valid email address patterns.';
    kpiEmailVal.textContent = 'Fail (None)';
    kpiEmailVal.className = 'kpi-val status-fail';
    detectedList.innerHTML = `<span style="font-size: 0.85rem; color: var(--text-subtle);">No email addresses detected.</span>`;
  }

  // Update Entity Footprint Flags
  updateFlag('valPhone', phones.length > 0 ? `YES (${phones.length})` : 'NO', phones.length > 0);
  updateFlag('valUrl', urls.length > 0 ? `YES (${urls.length})` : 'NO', urls.length > 0);
  updateFlag('valTags', tags.length > 0 ? `YES (${tags.length})` : 'NO', tags.length > 0);

  // Update Global KPI entities count
  const totalEntitiesFound = uniqueEmails.length + phones.length + urls.length + tags.length;
  document.getElementById('kpiEntitiesVal').textContent = totalEntitiesFound;
}

function updateFlag(elementId, text, isPositive) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = text;
    el.className = isPositive ? 'flag-val status-pos' : 'flag-val status-neg';
  }
}

// =============================================================================
// 4. TAB 1: Email Validator & RFC Syntax Inspector
// =============================================================================
function initEmailValidatorModule() {
  const input = document.getElementById('singleEmailInput');
  const btn = document.getElementById('btnValidateEmail');

  if (input) {
    input.addEventListener('input', validateCurrentEmail);
  }
  if (btn) {
    btn.addEventListener('click', validateCurrentEmail);
  }

  validateCurrentEmail();
}

window.setEmailPreset = function(presetEmail) {
  const input = document.getElementById('singleEmailInput');
  if (input) {
    input.value = presetEmail;
    validateCurrentEmail();
  }
};

function validateCurrentEmail() {
  const input = document.getElementById('singleEmailInput');
  const rawEmail = input ? input.value.trim() : '';

  const quickStatus = document.getElementById('emailQuickStatus');
  const checklist = document.getElementById('emailChecklist');
  const anatomyBox = document.getElementById('emailAnatomyDisplay');
  const localVal = document.getElementById('emailLocalVal');
  const domainVal = document.getElementById('emailDomainVal');
  const tldVal = document.getElementById('emailTldVal');
  const totalLen = document.getElementById('emailTotalLength');
  const regexResult = document.getElementById('emailRegexResult');

  totalLen.textContent = rawEmail.length;

  // RFC Email Regex
  const rfcRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = rfcRegex.test(rawEmail);

  // Deconstruct Parts
  const parts = rawEmail.split('@');
  const localPart = parts[0] || '';
  const domainAndTld = parts[1] || '';
  const domainParts = domainAndTld.split('.');
  const tld = domainParts.length > 1 ? domainParts.slice(1).join('.') : '';
  const domainName = domainParts[0] || '';

  localVal.textContent = localPart || '(empty)';
  domainVal.textContent = domainName || '(empty)';
  tldVal.textContent = tld || '(empty)';
  regexResult.textContent = isValid ? 'VALID RFC 5322 MATCH' : 'INVALID PATTERN';
  regexResult.style.color = isValid ? 'var(--color-success)' : 'var(--color-danger)';

  if (isValid) {
    quickStatus.textContent = 'Valid Email ✅';
    quickStatus.style.background = 'rgba(16, 185, 129, 0.2)';
    quickStatus.style.color = 'var(--color-success)';
  } else {
    quickStatus.textContent = 'Invalid Email ❌';
    quickStatus.style.background = 'rgba(239, 68, 68, 0.2)';
    quickStatus.style.color = 'var(--color-danger)';
  }

  // Render Visual Anatomy
  if (parts.length === 2 && localPart && domainName) {
    anatomyBox.innerHTML = `
      <span class="anatomy-part part-local" title="Local username">${escapeHtml(localPart)}</span>
      <span class="anatomy-part part-at">@</span>
      <span class="anatomy-part part-domain" title="Domain server">${escapeHtml(domainName)}</span>
      <span class="anatomy-part part-at">.</span>
      <span class="anatomy-part part-tld" title="Top-Level Domain">${escapeHtml(tld)}</span>
    `;
  } else {
    anatomyBox.innerHTML = `<span style="color: var(--text-subtle);">Unable to parse anatomy: malformed syntax.</span>`;
  }

  // Verification Checklist Items
  const checks = [
    { label: "Contains '@' symbol", pass: rawEmail.includes('@') },
    { label: "Exactly one '@' symbol", pass: (rawEmail.match(/@/g) || []).length === 1 },
    { label: "Valid local-part (username)", pass: /^[a-zA-Z0-9._%+-]+$/.test(localPart) },
    { label: "No consecutive dots '..'", pass: !rawEmail.includes('..') },
    { label: "Valid domain name structure", pass: /^[a-zA-Z0-9.-]+$/.test(domainAndTld) && domainParts.length >= 2 },
    { label: "Top-level domain (TLD) length >= 2", pass: tld.length >= 2 }
  ];

  checklist.innerHTML = checks.map(c => `
    <li class="check-item">
      <span class="${c.pass ? 'check-icon-valid' : 'check-icon-invalid'}">${c.pass ? '✔' : '✖'}</span>
      <span>${c.label}</span>
    </li>
  `).join('');
}

// =============================================================================
// 5. TAB 2: Unstructured Data Extraction
// =============================================================================
function initExtractionModule() {
  const input = document.getElementById('extractionInput');
  const btnLoad = document.getElementById('btnLoadDocPreset');
  const btnRun = document.getElementById('btnRunExtraction');
  const btnCopyJson = document.getElementById('btnCopyAllEntities');
  const filterBtns = document.querySelectorAll('.filter-tab-btn');

  if (input) {
    input.value = UNSTRUCTURED_DOCUMENT_SAMPLE;
    input.addEventListener('input', () => {
      document.getElementById('extractInputCharCount').textContent = `${input.value.length} chars`;
    });
    document.getElementById('extractInputCharCount').textContent = `${input.value.length} chars`;
  }

  if (btnLoad) {
    btnLoad.addEventListener('click', () => {
      input.value = UNSTRUCTURED_DOCUMENT_SAMPLE;
      document.getElementById('extractInputCharCount').textContent = `${input.value.length} chars`;
      runDataExtraction();
    });
  }

  if (btnRun) {
    btnRun.addEventListener('click', runDataExtraction);
  }

  if (btnCopyJson) {
    btnCopyJson.addEventListener('click', () => {
      navigator.clipboard.writeText(JSON.stringify(AppState.extractedEntities, null, 2));
      alert('Extracted entities copied to clipboard as JSON!');
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.activeFilter = btn.getAttribute('data-filter');
      renderExtractedEntities();
    });
  });

  runDataExtraction();
}

function runDataExtraction() {
  const text = document.getElementById('extractionInput').value;

  // Extraction Regex Engines
  const patterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    phone: /\+?[0-9]{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
    url: /https?:\/\/[^\s/$.?#].[^\s]*/gi,
    tag: /[@#][a-zA-Z0-9_.-]+/g,
    ip: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g
  };

  const results = [];

  // Emails
  (text.match(patterns.email) || []).forEach(val => results.push({ type: 'email', value: val }));

  // Phones
  (text.match(patterns.phone) || []).forEach(val => {
    if (val.trim().length >= 7) results.push({ type: 'phone', value: val.trim() });
  });

  // URLs
  (text.match(patterns.url) || []).forEach(val => results.push({ type: 'url', value: val }));

  // Tags & Mentions (exclude plain emails)
  (text.match(patterns.tag) || []).forEach(val => {
    if (!val.includes('@') || !val.includes('.')) {
      results.push({ type: 'tag', value: val });
    }
  });

  // IPs
  (text.match(patterns.ip) || []).forEach(val => results.push({ type: 'ip', value: val }));

  AppState.extractedEntities = results;

  // Counts
  document.getElementById('countAllEntities').textContent = results.length;
  document.getElementById('countEmails').textContent = results.filter(r => r.type === 'email').length;
  document.getElementById('countPhones').textContent = results.filter(r => r.type === 'phone').length;
  document.getElementById('countUrls').textContent = results.filter(r => r.type === 'url').length;
  document.getElementById('countTags').textContent = results.filter(r => r.type === 'tag').length;
  document.getElementById('countIps').textContent = results.filter(r => r.type === 'ip').length;

  renderExtractedEntities();
}

function renderExtractedEntities() {
  const container = document.getElementById('extractedCardsList');
  container.innerHTML = '';

  const filtered = AppState.activeFilter === 'all'
    ? AppState.extractedEntities
    : AppState.extractedEntities.filter(e => e.type === AppState.activeFilter);

  if (filtered.length === 0) {
    container.innerHTML = `<span style="font-size: 0.88rem; color: var(--text-subtle); padding: 1rem;">No entities found for this filter.</span>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'entity-item-card';
    card.innerHTML = `
      <div class="entity-meta-left">
        <span class="entity-type-badge type-${item.type}">${item.type}</span>
        <span class="entity-value">${escapeHtml(item.value)}</span>
      </div>
      <button class="chip-copy-btn" title="Copy entity" onclick="navigator.clipboard.writeText('${item.value}')">📋</button>
    `;
    container.appendChild(card);
  });
}

// =============================================================================
// 6. TAB 3: String Functions & Transformation Lab
// =============================================================================
function initStringFunctionsModule() {
  renderStringHistory();

  const btnCopy = document.getElementById('btnCopyTransformOutput');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const output = document.getElementById('stringTransformOutput').textContent;
      navigator.clipboard.writeText(output);
      alert('Transformed result copied to clipboard!');
    });
  }
}

window.applyStringTransform = function(action) {
  const input = document.getElementById('stringMethodInput').value;
  let result = '';
  let snippet = '';

  switch (action) {
    case 'upper':
      result = input.toUpperCase();
      snippet = `const result = input.toUpperCase();`;
      break;
    case 'lower':
      result = input.toLowerCase();
      snippet = `const result = input.toLowerCase();`;
      break;
    case 'title':
      result = input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      snippet = `const result = input.replace(/\\w\\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());`;
      break;
    case 'camel':
      result = input
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase())
        .replace(/\s+/g, '');
      snippet = `const result = input.replace(/(?:^\\w|[A-Z]|\\b\\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\\s+/g, '');`;
      break;
    case 'snake':
      result = input.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        ?.map(x => x.toLowerCase()).join('_') || input.toLowerCase().replace(/\s+/g, '_');
      snippet = `const result = input.toLowerCase().replace(/\\s+/g, '_');`;
      break;
    case 'kebab':
      result = input.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        ?.map(x => x.toLowerCase()).join('-') || input.toLowerCase().replace(/\s+/g, '-');
      snippet = `const result = input.toLowerCase().replace(/\\s+/g, '-');`;
      break;
    case 'pascal':
      result = input.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()).replace(/\s+/g, '');
      snippet = `const result = input.replace(/\\w\\S*/g, w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()).replace(/\\s+/g, '');`;
      break;
    case 'toggle':
      result = input.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
      snippet = `const result = input.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');`;
      break;
    case 'reverse':
      result = input.split('').reverse().join('');
      snippet = `const result = input.split('').reverse().join('');`;
      break;
    case 'palindrome':
      const clean = input.toLowerCase().replace(/[^a-z0-9]/g, '');
      const isPalin = clean === clean.split('').reverse().join('');
      result = isPalin ? `✅ TRUE (Palindrome)` : `❌ FALSE (Not a Palindrome)`;
      snippet = `const clean = input.toLowerCase().replace(/[^a-z0-9]/g, '');\nconst isPalindrome = clean === clean.split('').reverse().join('');`;
      break;
    case 'trim':
      result = input.trim();
      snippet = `const result = input.trim();`;
      break;
    case 'removeSpaces':
      result = input.replace(/\s+/g, '');
      snippet = `const result = input.replace(/\\s+/g, '');`;
      break;
    case 'base64Encode':
      result = btoa(unescape(encodeURIComponent(input)));
      snippet = `const result = btoa(unescape(encodeURIComponent(input)));`;
      break;
    case 'base64Decode':
      try {
        result = decodeURIComponent(escape(atob(input)));
        snippet = `const result = decodeURIComponent(escape(atob(input)));`;
      } catch (e) {
        result = 'Error: Invalid Base64 input string';
        snippet = `// Error decoding Base64`;
      }
      break;
  }

  displayTransformResult(result, snippet, action);
};

window.applySlice = function() {
  const input = document.getElementById('stringMethodInput').value;
  const start = parseInt(document.getElementById('sliceStart').value, 10) || 0;
  const end = parseInt(document.getElementById('sliceEnd').value, 10) || input.length;

  const result = input.slice(start, end);
  const snippet = `const result = input.slice(${start}, ${end});`;
  displayTransformResult(result, snippet, `.slice(${start}, ${end})`);
};

window.applyReplace = function() {
  const input = document.getElementById('stringMethodInput').value;
  const target = document.getElementById('replaceTarget').value;
  const replacement = document.getElementById('replaceWith').value;

  if (!target) {
    alert('Please enter a target word or character to find.');
    return;
  }

  const result = input.replaceAll(target, replacement);
  const snippet = `const result = input.replaceAll('${target}', '${replacement}');`;
  displayTransformResult(result, snippet, `.replaceAll('${target}', '${replacement}')`);
};

function displayTransformResult(result, snippet, methodLabel) {
  document.getElementById('stringTransformOutput').textContent = result;
  document.getElementById('jsExecutionSnippet').textContent = snippet;

  AppState.transformationCount++;
  document.getElementById('kpiTransformsVal').textContent = AppState.transformationCount;

  // Add to history
  AppState.stringHistory.unshift({
    method: methodLabel,
    preview: result.length > 28 ? result.slice(0, 28) + '...' : result
  });
  renderStringHistory();
}

function renderStringHistory() {
  const list = document.getElementById('stringHistoryList');
  list.innerHTML = AppState.stringHistory.slice(0, 6).map(h => `
    <div class="history-entry">
      <span style="color: var(--accent-secondary);">${escapeHtml(h.method)}</span>
      <span style="color: var(--text-muted);">${escapeHtml(h.preview)}</span>
    </div>
  `).join('');
}

window.clearStringHistory = function() {
  AppState.stringHistory = [];
  renderStringHistory();
};

// =============================================================================
// 7. TAB 5: Regex Tester & Parser Studio
// =============================================================================
function initRegexTesterModule() {
  const patternInput = document.getElementById('regexPatternInput');
  const flagsInput = document.getElementById('regexFlagsInput');
  const testTextInput = document.getElementById('regexTestText');

  const flagG = document.getElementById('flagG');
  const flagI = document.getElementById('flagI');
  const flagM = document.getElementById('flagM');
  const flagS = document.getElementById('flagS');

  const updateFlagsFromCheckboxes = () => {
    let f = '';
    if (flagG.checked) f += 'g';
    if (flagI.checked) f += 'i';
    if (flagM.checked) f += 'm';
    if (flagS.checked) f += 's';
    flagsInput.value = f;
    runRegexTesting();
  };

  const updateCheckboxesFromFlags = () => {
    const f = flagsInput.value;
    flagG.checked = f.includes('g');
    flagI.checked = f.includes('i');
    flagM.checked = f.includes('m');
    flagS.checked = f.includes('s');
    runRegexTesting();
  };

  patternInput.addEventListener('input', runRegexTesting);
  flagsInput.addEventListener('input', updateCheckboxesFromFlags);
  testTextInput.addEventListener('input', runRegexTesting);

  flagG.addEventListener('change', updateFlagsFromCheckboxes);
  flagI.addEventListener('change', updateFlagsFromCheckboxes);
  flagM.addEventListener('change', updateFlagsFromCheckboxes);
  flagS.addEventListener('change', updateFlagsFromCheckboxes);

  runRegexTesting();
}

window.setRegexPreset = function(pattern, flags) {
  document.getElementById('regexPatternInput').value = pattern;
  document.getElementById('regexFlagsInput').value = flags;

  const flagG = document.getElementById('flagG');
  const flagI = document.getElementById('flagI');
  const flagM = document.getElementById('flagM');
  const flagS = document.getElementById('flagS');

  flagG.checked = flags.includes('g');
  flagI.checked = flags.includes('i');
  flagM.checked = flags.includes('m');
  flagS.checked = flags.includes('s');

  runRegexTesting();
};

function runRegexTesting() {
  const pattern = document.getElementById('regexPatternInput').value;
  const flags = document.getElementById('regexFlagsInput').value;
  const text = document.getElementById('regexTestText').value;

  const matchBadge = document.getElementById('regexMatchCountBadge');
  const errorBadge = document.getElementById('regexErrorBadge');
  const highlightDisplay = document.getElementById('regexHighlightDisplay');
  const tbody = document.getElementById('regexMatchesTbody');

  tbody.innerHTML = '';
  errorBadge.style.display = 'none';

  if (!pattern) {
    matchBadge.textContent = '0 matches';
    highlightDisplay.textContent = text;
    return;
  }

  let regex;
  try {
    regex = new RegExp(pattern, flags);
  } catch (err) {
    errorBadge.style.display = 'inline-block';
    errorBadge.textContent = 'Invalid Regex: ' + err.message;
    matchBadge.textContent = 'Error';
    highlightDisplay.textContent = text;
    return;
  }

  const matches = [];
  let match;

  if (flags.includes('g')) {
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        value: match[0],
        index: match.index,
        length: match[0].length
      });
      if (match.index === regex.lastIndex) regex.lastIndex++; // Avoid infinite loop on zero-width match
    }
  } else {
    match = regex.exec(text);
    if (match) {
      matches.push({
        value: match[0],
        index: match.index,
        length: match[0].length
      });
    }
  }

  matchBadge.textContent = `${matches.length} match${matches.length === 1 ? '' : 'es'}`;

  // Build Highlighted HTML
  if (matches.length > 0) {
    let highlightedHTML = '';
    let lastIndex = 0;

    matches.forEach(m => {
      highlightedHTML += escapeHtml(text.slice(lastIndex, m.index));
      highlightedHTML += `<mark class="regex-match">${escapeHtml(m.value)}</mark>`;
      lastIndex = m.index + m.length;
    });
    highlightedHTML += escapeHtml(text.slice(lastIndex));
    highlightDisplay.innerHTML = highlightedHTML;

    // Matches Table Rows
    tbody.innerHTML = matches.map((m, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><code>${escapeHtml(m.value)}</code></td>
        <td>${m.index}</td>
        <td>${m.length}</td>
      </tr>
    `).join('');
  } else {
    highlightDisplay.textContent = text;
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-subtle);">No matches found for current pattern.</td></tr>`;
  }
}

// =============================================================================
// 8. Modals: Student Info & Export Lab Summary Report
// =============================================================================
function initModals() {
  // Student Credential Modal
  const studentModal = document.getElementById('studentModal');
  const btnCloseModal = document.getElementById('closeModalBtn');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const btnSaveModal = document.getElementById('btnSaveModal');

  const closeStudentModal = () => { studentModal.style.display = 'none'; };

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeStudentModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeStudentModal);

  if (btnSaveModal) {
    btnSaveModal.addEventListener('click', () => {
      const name = document.getElementById('inputModalName').value.trim() || 'AKSHAN';
      const prn = document.getElementById('inputModalPRN').value.trim() || '24070521000';

      AppState.studentName = name;
      AppState.studentPRN = prn;

      localStorage.setItem('cs6_student_name', name);
      localStorage.setItem('cs6_student_prn', prn);

      updateStudentDisplay();
      closeStudentModal();
    });
  }

  // Export Report Modal
  const reportModal = document.getElementById('reportModal');
  const exportBtn = document.getElementById('exportReportBtn');
  const closeReportBtn = document.getElementById('closeReportModalBtn');
  const doneReportBtn = document.getElementById('btnCloseReport');
  const copyReportBtn = document.getElementById('btnCopyReport');

  const closeReportModal = () => { reportModal.style.display = 'none'; };

  if (closeReportBtn) closeReportBtn.addEventListener('click', closeReportModal);
  if (doneReportBtn) doneReportBtn.addEventListener('click', closeReportModal);

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const reportContent = generateLabReportSummary();
      document.getElementById('reportContentArea').value = reportContent;
      reportModal.style.display = 'flex';
    });
  }

  if (copyReportBtn) {
    copyReportBtn.addEventListener('click', () => {
      const text = document.getElementById('reportContentArea').value;
      navigator.clipboard.writeText(text);
      alert('Lab report summary copied to clipboard!');
    });
  }

  // Close modals on background click
  window.addEventListener('click', (e) => {
    if (e.target === studentModal) closeStudentModal();
    if (e.target === reportModal) closeReportModal();
  });
}

function generateLabReportSummary() {
  const text = document.getElementById('analysisTextInput').value;
  const words = document.getElementById('metricTotalWords').textContent;
  const chars = document.getElementById('metricCharsSpaces').textContent;
  const sentences = document.getElementById('metricSentences').textContent;
  const flesch = document.getElementById('fleschBadge').textContent;
  const emailIntegrity = document.getElementById('kpiEmailVal').textContent;

  return `======================================================================
EXPERIMENT 6: WEB DEVELOPMENT LABORATORY REPORT
TOPIC: String Functions, Email Verification, Text Analytics & Regex Studio
======================================================================
DEVELOPER INFORMATION:
• Student Name: ${AppState.studentName}
• PRN / Roll: ${AppState.studentPRN}
• Lab Experiment: 6
• Date of Execution: ${new Date().toLocaleDateString()}

1. TEXT ANALYTICS & MAIL DETECTION BENCHMARK:
--------------------------------------------------
• Total Words Analyzed: ${words}
• Total Characters (w/ spaces): ${chars}
• Total Sentences: ${sentences}
• Reading Ease Metric: ${flesch}
• Mail Presence Status: ${emailIntegrity}

2. TARGET CORPUS EXCERPT:
--------------------------------------------------
${text.slice(0, 300)}...

3. REGULAR EXPRESSIONS IMPLEMENTED:
--------------------------------------------------
• RFC 5322 Email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/
• Phone Number: /\\+?[0-9]{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}/
• URL / Web Link: /https?:\\/\\/[^\\s/$.?#].[^\\s]*/gi
• Tags / Mentions: /[@#][a-zA-Z0-9_.-]+/g
• IPv4 Address: /\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b/

4. CONCLUSION:
--------------------------------------------------
The String Functions & Regex Analytics Studio successfully parses, sanitizes,
validates email addresses, extracts multi-pattern entities, and computes
lexical distribution benchmarks in real-time.
======================================================================`;
}

// =============================================================================
// Helper Utilities
// =============================================================================
function escapeHtml(string) {
  if (typeof string !== 'string') return '';
  return string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
