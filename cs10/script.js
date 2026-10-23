/**
 * Student Records Analytics Portal
 * Comprehensive Implementation for JSON Data Ingestion (fetch vs $.getJSON),
 * Filtering, Searching, Dynamic Sorting, Benchmarking, and CSV Export.
 */

// Application State
const state = {
  allRecords: [],
  filteredRecords: [],
  currentSort: {
    column: 'id',
    direction: 'asc' // 'asc' | 'desc'
  },
  filters: {
    searchQuery: '',
    course: 'ALL',
    status: 'ALL',
    minGpa: 0
  },
  lastLoadMethod: null, // 'fetch' | 'jquery'
  responseTimeMs: null
};

// DOM Element Cache
const elements = {
  // Buttons
  btnFetch: document.getElementById('btn-fetch'),
  btnJquery: document.getElementById('btn-jquery'),
  btnClear: document.getElementById('btn-clear'),
  btnExport: document.getElementById('btn-export'),
  btnResetFilters: document.getElementById('btn-reset-filters'),
  
  // Search & Filter Inputs
  searchInput: document.getElementById('search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  filterCourse: document.getElementById('filter-course'),
  filterStatus: document.getElementById('filter-status'),
  filterGpa: document.getElementById('filter-gpa'),
  sortSelect: document.getElementById('sort-select'),
  activeFiltersBar: document.getElementById('active-filters-bar'),
  filterPillsList: document.getElementById('filter-pills-list'),
  
  // Metric Counters
  statResponseTime: document.getElementById('stat-response-time'),
  statMethodTag: document.getElementById('stat-method-tag'),
  statRecordCount: document.getElementById('stat-record-count'),
  statRecordHint: document.getElementById('stat-record-hint'),
  statAvgGpa: document.getElementById('stat-avg-gpa'),
  statAvgAttendance: document.getElementById('stat-avg-attendance'),
  
  // Table Elements
  table: document.getElementById('students-table'),
  tableBody: document.getElementById('table-body'),
  tableHeaders: document.querySelectorAll('#students-table th.sortable'),
  footerCountText: document.getElementById('footer-count-text'),
  
  // Toast
  toastContainer: document.getElementById('toast-container')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
});

/**
 * Attach UI event listeners
 */
function setupEventListeners() {
  // Ingestion Trigger 1: Native ES6 fetch()
  elements.btnFetch.addEventListener('click', () => loadRecordsViaFetch());

  // Ingestion Trigger 2: jQuery $.getJSON()
  elements.btnJquery.addEventListener('click', () => loadRecordsViaJQuery());

  // Table Actions
  elements.btnClear.addEventListener('click', () => clearTableData());
  elements.btnExport.addEventListener('click', () => exportVisibleToCSV());

  // Search Input
  elements.searchInput.addEventListener('input', (e) => {
    state.filters.searchQuery = e.target.value.trim();
    elements.searchClearBtn.style.display = state.filters.searchQuery ? 'flex' : 'none';
    applyFiltersAndSort();
  });

  elements.searchClearBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    state.filters.searchQuery = '';
    elements.searchClearBtn.style.display = 'none';
    applyFiltersAndSort();
    elements.searchInput.focus();
  });

  // Filter Dropdowns
  elements.filterCourse.addEventListener('change', (e) => {
    state.filters.course = e.target.value;
    applyFiltersAndSort();
  });

  elements.filterStatus.addEventListener('change', (e) => {
    state.filters.status = e.target.value;
    applyFiltersAndSort();
  });

  elements.filterGpa.addEventListener('change', (e) => {
    state.filters.minGpa = parseFloat(e.target.value) || 0;
    applyFiltersAndSort();
  });

  // Sort Dropdown
  elements.sortSelect.addEventListener('change', (e) => {
    const [column, direction] = e.target.value.split('-');
    setSort(column, direction);
  });

  // Table Column Header Click (Sort)
  elements.tableHeaders.forEach(th => {
    th.addEventListener('click', () => {
      if (!state.allRecords.length) return;
      const column = th.getAttribute('data-column');
      let direction = 'asc';
      if (state.currentSort.column === column && state.currentSort.direction === 'asc') {
        direction = 'desc';
      }
      setSort(column, direction);
    });
  });

  // Reset all filters button
  elements.btnResetFilters.addEventListener('click', () => resetAllFilters());
}

/* ==========================================================================
   Data Ingestion Implementations
   ========================================================================== */

/**
 * 1. Load data using standard native fetch() API
 */
async function loadRecordsViaFetch() {
  setLoadingState(true, 'fetch');
  const startTime = performance.now();

  try {
    const response = await fetch('students.json', { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const endTime = performance.now();
    const elapsed = (endTime - startTime).toFixed(2);

    handleDataLoaded(data, 'fetch', elapsed);
    showToast(`Loaded ${data.length} records in ${elapsed} ms via fetch()`, 'success');
  } catch (error) {
    console.error('Fetch error:', error);
    showToast(`Failed to load via fetch(): ${error.message}`, 'danger');
    setLoadingState(false);
  }
}

/**
 * 2. Load data using jQuery $.getJSON() API
 */
function loadRecordsViaJQuery() {
  setLoadingState(true, 'jquery');
  const startTime = performance.now();

  // Ensuring jQuery is available
  if (typeof $ === 'undefined' || typeof $.getJSON !== 'function') {
    showToast('jQuery is not loaded in the runtime.', 'danger');
    setLoadingState(false);
    return;
  }

  $.getJSON('students.json?nocache=' + Date.now())
    .done((data) => {
      const endTime = performance.now();
      const elapsed = (endTime - startTime).toFixed(2);

      handleDataLoaded(data, 'jquery', elapsed);
      showToast(`Loaded ${data.length} records in ${elapsed} ms via $.getJSON()`, 'success');
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      console.error('jQuery getJSON error:', textStatus, errorThrown);
      showToast(`Failed to load via $.getJSON(): ${textStatus}`, 'danger');
      setLoadingState(false);
    });
}

/**
 * Handle successful load from either source
 */
function handleDataLoaded(data, method, elapsed) {
  state.allRecords = Array.isArray(data) ? [...data] : [];
  state.lastLoadMethod = method;
  state.responseTimeMs = elapsed;

  // Populate dynamic course options
  populateCourseFilterOptions();

  // Enable controls
  enableControls(true);

  // Update response time badge
  elements.statResponseTime.textContent = `${elapsed} ms`;
  elements.statMethodTag.textContent = method === 'fetch' ? 'fetch()' : '$.getJSON()';
  elements.statMethodTag.className = `method-tag badge-${method}`;

  // Reset filters to defaults or re-apply
  applyFiltersAndSort();
  setLoadingState(false);
}

/**
 * Dynamically extract unique courses and populate the course select
 */
function populateCourseFilterOptions() {
  const currentVal = elements.filterCourse.value;
  const uniqueCourses = [...new Set(state.allRecords.map(r => r.course).filter(Boolean))].sort();

  // Retain the 'ALL' option
  elements.filterCourse.innerHTML = '<option value="ALL">All Courses</option>';
  uniqueCourses.forEach(course => {
    const opt = document.createElement('option');
    opt.value = course;
    opt.textContent = course;
    elements.filterCourse.appendChild(opt);
  });

  if (uniqueCourses.includes(currentVal)) {
    elements.filterCourse.value = currentVal;
  }
}

/* ==========================================================================
   Search, Filter & Sorting Engine
   ========================================================================== */

/**
 * Filter, sort, and render records
 */
function applyFiltersAndSort() {
  if (!state.allRecords.length) {
    renderEmptyState();
    updateMetrics([]);
    return;
  }

  const query = state.filters.searchQuery.toLowerCase();
  const selectedCourse = state.filters.course;
  const selectedStatus = state.filters.status;
  const minGpa = state.filters.minGpa;

  // 1. Filtering
  state.filteredRecords = state.allRecords.filter(item => {
    // Search match across ID, Name, Email, Course
    if (query) {
      const matchId = item.id.toLowerCase().includes(query);
      const matchName = item.name.toLowerCase().includes(query);
      const matchEmail = item.email.toLowerCase().includes(query);
      const matchCourse = item.course.toLowerCase().includes(query);
      if (!matchId && !matchName && !matchEmail && !matchCourse) {
        return false;
      }
    }

    // Course match
    if (selectedCourse !== 'ALL' && item.course !== selectedCourse) {
      return false;
    }

    // Status match
    if (selectedStatus !== 'ALL' && item.status !== selectedStatus) {
      return false;
    }

    // GPA match
    if (minGpa > 0 && Number(item.gpa) < minGpa) {
      return false;
    }

    return true;
  });

  // 2. Sorting
  const { column, direction } = state.currentSort;
  state.filteredRecords.sort((a, b) => {
    let valA = a[column];
    let valB = b[column];

    // Numeric sorting
    if (typeof valA === 'number' && typeof valB === 'number') {
      return direction === 'asc' ? valA - valB : valB - valA;
    }

    // String sorting
    valA = (valA || '').toString().toLowerCase();
    valB = (valB || '').toString().toLowerCase();

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  // 3. Render Table
  renderTable(state.filteredRecords);

  // 4. Update Header & Dropdown Sort Indicators
  updateSortIndicators();

  // 5. Update Metrics & Active Pills
  updateMetrics(state.filteredRecords);
  renderActiveFilterPills();
}

/**
 * Change sort column and direction
 */
function setSort(column, direction) {
  state.currentSort.column = column;
  state.currentSort.direction = direction;
  applyFiltersAndSort();
}

/**
 * Synchronize table header sort icons and Sort dropdown
 */
function updateSortIndicators() {
  const { column, direction } = state.currentSort;

  // Update header classes
  elements.tableHeaders.forEach(th => {
    const colName = th.getAttribute('data-column');
    const iconContainer = th.querySelector('.sort-icon');
    
    th.classList.remove('sort-asc', 'sort-desc');

    if (colName === column) {
      th.classList.add(direction === 'asc' ? 'sort-asc' : 'sort-desc');
      iconContainer.innerHTML = direction === 'asc' 
        ? '<i class="fa-solid fa-arrow-up-long"></i>' 
        : '<i class="fa-solid fa-arrow-down-long"></i>';
    } else {
      iconContainer.innerHTML = '<i class="fa-solid fa-sort"></i>';
    }
  });

  // Update dropdown value if match exists
  const matchingOption = `${column}-${direction}`;
  if (elements.sortSelect.querySelector(`option[value="${matchingOption}"]`)) {
    elements.sortSelect.value = matchingOption;
  }
}

/* ==========================================================================
   Table Rendering Engine
   ========================================================================== */

/**
 * Render array of student records into the DOM
 */
function renderTable(records) {
  if (!records.length) {
    elements.tableBody.innerHTML = `
      <tr class="empty-state-row">
        <td colspan="8">
          <div class="empty-state">
            <div class="empty-state-icon">
              <i class="fa-solid fa-filter-circle-xmark"></i>
            </div>
            <h3>No Matching Records Found</h3>
            <p>None of the student records match your current search and filter criteria.</p>
            <button class="btn btn-primary" onclick="resetAllFilters()">Reset All Filters</button>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  const query = state.filters.searchQuery;
  const rowsHtml = records.map(student => {
    // Format helpers
    const idHtml = highlightMatch(escapeHtml(student.id), query);
    const nameHtml = highlightMatch(escapeHtml(student.name), query);
    const emailHtml = highlightMatch(escapeHtml(student.email), query);
    const courseHtml = highlightMatch(escapeHtml(student.course), query);
    
    // GPA badge class
    const gpaNum = Number(student.gpa);
    let gpaClass = 'gpa-mid';
    if (gpaNum >= 3.7) gpaClass = 'gpa-high';
    else if (gpaNum < 3.0) gpaClass = 'gpa-low';

    // Attendance bar class
    const attNum = Number(student.attendance);
    let attColorClass = 'att-good';
    if (attNum < 75) attColorClass = 'att-danger';
    else if (attNum < 85) attColorClass = 'att-warning';

    // Status badge class
    const statusLower = (student.status || '').toLowerCase();
    let statusClass = 'status-active';
    if (statusLower.includes('prob')) statusClass = 'status-probation';
    else if (statusLower.includes('grad')) statusClass = 'status-graduating';

    return `
      <tr>
        <td><span class="stu-id">${idHtml}</span></td>
        <td><div class="stu-name">${nameHtml}</div></td>
        <td><span class="stu-email">${emailHtml}</span></td>
        <td><span class="stu-course"><i class="fa-solid fa-graduation-cap"></i> ${courseHtml}</span></td>
        <td class="text-center"><span class="stu-semester">Sem ${escapeHtml(student.semester)}</span></td>
        <td class="text-center">
          <span class="gpa-badge ${gpaClass}">${student.gpa.toFixed(2)}</span>
        </td>
        <td>
          <div class="attendance-cell">
            <div class="attendance-progress" title="Attendance: ${student.attendance}%">
              <div class="attendance-bar ${attColorClass}" style="width: ${student.attendance}%;"></div>
            </div>
            <span class="attendance-pct">${student.attendance}%</span>
          </div>
        </td>
        <td class="text-center">
          <span class="status-badge ${statusClass}">${escapeHtml(student.status)}</span>
        </td>
      </tr>
    `;
  }).join('');

  elements.tableBody.innerHTML = rowsHtml;
}

/**
 * Render empty state when table is explicitly cleared
 */
function renderEmptyState() {
  elements.tableBody.innerHTML = `
    <tr class="empty-state-row">
      <td colspan="8">
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fa-solid fa-database"></i>
          </div>
          <h3>No Student Records Loaded</h3>
          <p>Click <strong>"Load with fetch()"</strong> or <strong>"Load with $.getJSON()"</strong> above to fetch the dataset from <code>students.json</code>.</p>
        </div>
      </td>
    </tr>
  `;
}

/* ==========================================================================
   Metrics & Calculations
   ========================================================================== */

function updateMetrics(visibleRecords) {
  const total = state.allRecords.length;
  const count = visibleRecords.length;

  if (total === 0) {
    elements.statRecordCount.textContent = '0 / 0';
    elements.statRecordHint.textContent = 'No data loaded';
    elements.statAvgGpa.textContent = '--';
    elements.statAvgAttendance.textContent = '--%';
    elements.footerCountText.textContent = 'Ready to ingest student records';
    return;
  }

  // Count
  elements.statRecordCount.textContent = `${count} / ${total}`;
  elements.statRecordHint.textContent = count === total ? 'All visible' : `Filtered (${total - count} hidden)`;

  // Footer text
  elements.footerCountText.textContent = `Displaying ${count} of ${total} student records (${state.lastLoadMethod === 'fetch' ? 'Native fetch()' : 'jQuery $.getJSON()'})`;

  // Averages
  if (count > 0) {
    const sumGpa = visibleRecords.reduce((acc, curr) => acc + Number(curr.gpa || 0), 0);
    const avgGpa = (sumGpa / count).toFixed(2);
    elements.statAvgGpa.textContent = avgGpa;

    const sumAtt = visibleRecords.reduce((acc, curr) => acc + Number(curr.attendance || 0), 0);
    const avgAtt = Math.round(sumAtt / count);
    elements.statAvgAttendance.textContent = `${avgAtt}%`;
  } else {
    elements.statAvgGpa.textContent = '0.00';
    elements.statAvgAttendance.textContent = '0%';
  }
}

/**
 * Render interactive active filter pills
 */
function renderActiveFilterPills() {
  const pills = [];

  if (state.filters.searchQuery) {
    pills.push({
      label: `Search: "${state.filters.searchQuery}"`,
      clear: () => {
        elements.searchInput.value = '';
        state.filters.searchQuery = '';
        elements.searchClearBtn.style.display = 'none';
      }
    });
  }

  if (state.filters.course !== 'ALL') {
    pills.push({
      label: `Course: ${state.filters.course}`,
      clear: () => {
        elements.filterCourse.value = 'ALL';
        state.filters.course = 'ALL';
      }
    });
  }

  if (state.filters.status !== 'ALL') {
    pills.push({
      label: `Status: ${state.filters.status}`,
      clear: () => {
        elements.filterStatus.value = 'ALL';
        state.filters.status = 'ALL';
      }
    });
  }

  if (state.filters.minGpa > 0) {
    pills.push({
      label: `Min GPA: ≥ ${state.filters.minGpa}`,
      clear: () => {
        elements.filterGpa.value = '0';
        state.filters.minGpa = 0;
      }
    });
  }

  if (pills.length > 0) {
    elements.activeFiltersBar.style.display = 'flex';
    elements.filterPillsList.innerHTML = '';
    
    pills.forEach(pill => {
      const span = document.createElement('span');
      span.className = 'filter-pill';
      span.innerHTML = `
        <span>${escapeHtml(pill.label)}</span>
        <i class="fa-solid fa-xmark remove-pill" title="Remove filter"></i>
      `;
      span.querySelector('.remove-pill').addEventListener('click', () => {
        pill.clear();
        applyFiltersAndSort();
      });
      elements.filterPillsList.appendChild(span);
    });
  } else {
    elements.activeFiltersBar.style.display = 'none';
    elements.filterPillsList.innerHTML = '';
  }
}

/**
 * Reset all active filter controls
 */
function resetAllFilters() {
  state.filters.searchQuery = '';
  elements.searchInput.value = '';
  elements.searchClearBtn.style.display = 'none';

  state.filters.course = 'ALL';
  elements.filterCourse.value = 'ALL';

  state.filters.status = 'ALL';
  elements.filterStatus.value = 'ALL';

  state.filters.minGpa = 0;
  elements.filterGpa.value = '0';

  applyFiltersAndSort();
  showToast('All filters have been reset', 'info');
}

/* ==========================================================================
   Table Operations: Clear & Export CSV
   ========================================================================== */

/**
 * Clear all table records and reset dashboard
 */
function clearTableData() {
  if (!state.allRecords.length) return;

  const previousCount = state.allRecords.length;
  state.allRecords = [];
  state.filteredRecords = [];
  state.lastLoadMethod = null;
  state.responseTimeMs = null;

  // Reset inputs
  elements.searchInput.value = '';
  state.filters.searchQuery = '';
  elements.searchClearBtn.style.display = 'none';
  elements.filterCourse.value = 'ALL';
  state.filters.course = 'ALL';
  elements.filterStatus.value = 'ALL';
  state.filters.status = 'ALL';
  elements.filterGpa.value = '0';
  state.filters.minGpa = 0;

  // Reset badges
  elements.statResponseTime.textContent = '-- ms';
  elements.statMethodTag.textContent = 'Idle';
  elements.statMethodTag.className = 'method-tag';

  // Disable controls
  enableControls(false);

  // Render empty state
  renderEmptyState();
  updateMetrics([]);
  renderActiveFilterPills();

  showToast(`Cleared ${previousCount} records from table`, 'info');
}

/**
 * Export visible records as CSV
 */
function exportVisibleToCSV() {
  if (!state.filteredRecords.length) {
    showToast('No records visible to export', 'danger');
    return;
  }

  const headers = ['Student ID', 'Full Name', 'Email', 'Major / Course', 'Semester', 'GPA', 'Attendance (%)', 'Status'];
  
  const csvRows = [];
  // 1. Add headers
  csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));

  // 2. Add rows
  state.filteredRecords.forEach(s => {
    const row = [
      s.id,
      s.name,
      s.email,
      s.course,
      s.semester,
      s.gpa.toFixed(2),
      s.attendance,
      s.status
    ];
    csvRows.push(row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));
  });

  const csvString = csvRows.join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  downloadLink.href = url;
  downloadLink.setAttribute('download', `students_export_${timestamp}.csv`);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);

  showToast(`Exported ${state.filteredRecords.length} records to CSV`, 'success');
}

/* ==========================================================================
   Utility Functions & UI Helpers
   ========================================================================== */

/**
 * Enable or disable interactive controls based on data presence
 */
function enableControls(enable) {
  elements.btnClear.disabled = !enable;
  elements.btnExport.disabled = !enable;
  elements.searchInput.disabled = !enable;
  elements.filterCourse.disabled = !enable;
  elements.filterStatus.disabled = !enable;
  elements.filterGpa.disabled = !enable;
  elements.sortSelect.disabled = !enable;
}

/**
 * Loading state visual helper
 */
function setLoadingState(isLoading, method = null) {
  if (isLoading) {
    if (method === 'fetch') {
      elements.btnFetch.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Fetching...';
      elements.btnFetch.disabled = true;
      elements.btnJquery.disabled = true;
    } else if (method === 'jquery') {
      elements.btnJquery.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
      elements.btnFetch.disabled = true;
      elements.btnJquery.disabled = true;
    }
  } else {
    elements.btnFetch.innerHTML = '<span class="btn-icon"><i class="fa-solid fa-cloud-arrow-down"></i></span><span>Load with <code>fetch()</code></span>';
    elements.btnJquery.innerHTML = '<span class="btn-icon"><i class="fa-brands fa-js"></i></span><span>Load with <code>$.getJSON()</code></span>';
    elements.btnFetch.disabled = false;
    elements.btnJquery.disabled = false;
  }
}

/**
 * Toast notification dispatcher
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'circle-info';
  if (type === 'success') icon = 'circle-check';
  if (type === 'danger') icon = 'circle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid fa-${icon}"></i>
    <span>${escapeHtml(message)}</span>
  `;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Highlight matched search query in string
 */
function highlightMatch(text, query) {
  if (!query) return text;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

/**
 * Basic HTML escaping for security
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
