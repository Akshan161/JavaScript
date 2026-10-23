// Student Grading System Logic
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('gradingForm');
  const btnReset = document.getElementById('btnReset');

  // Subjects configuration
  const subjectConfigs = [
    { id: 'subEnglish', name: 'English', max: 100 },
    { id: 'subMath', name: 'Mathematics', max: 100 },
    { id: 'subCS', name: 'Computer Science (CS)', max: 200 },
    { id: 'subPhysics', name: 'Physics', max: 100 },
    { id: 'subChemistry', name: 'Chemistry', max: 100 }
  ];

  // Grade classification based on percentage
  function getFinalGrade(percentage, isAllPassed) {
    if (!isAllPassed) return 'F';
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 35) return 'D';
    return 'F';
  }

  // Calculate and update the report card
  function calculateAndRender() {
    const studentName = document.getElementById('studentName').value.trim() || 'Student';
    const rollNo = document.getElementById('rollNo').value.trim() || 'N/A';

    let totalScore = 0;
    let totalMaxScore = 0;
    let distinctionCount = 0;
    let allPassed = true;

    const subjectResults = subjectConfigs.map(config => {
      const inputEl = document.getElementById(config.id);
      let val = parseFloat(inputEl.value);

      // Clamp between 0 and max
      if (isNaN(val)) val = 0;
      if (val < 0) val = 0;
      if (val > config.max) val = config.max;

      const percentage = (val / config.max) * 100;
      const isPass = percentage >= 35; // 35% passing benchmark
      if (!isPass) allPassed = false;
      if (percentage >= 75) distinctionCount++;

      totalScore += val;
      totalMaxScore += config.max;

      return {
        name: config.name,
        score: val,
        max: config.max,
        percentage: percentage,
        isPass: isPass
      };
    });

    const overallPercentage = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
    const finalGrade = getFinalGrade(overallPercentage, allPassed);

    // Update Header Meta
    document.getElementById('displayStudentName').textContent = studentName;
    document.getElementById('displayRollNo').textContent = `Roll No: ${rollNo}`;

    const statusBadge = document.getElementById('displayOverallStatus');
    if (allPassed) {
      statusBadge.textContent = 'PASS';
      statusBadge.className = 'overall-status-badge';
    } else {
      statusBadge.textContent = 'FAIL';
      statusBadge.className = 'overall-status-badge failed';
    }

    // Render Table Rows
    const tbody = document.getElementById('reportTableBody');
    tbody.innerHTML = '';

    subjectResults.forEach(sub => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td class="td-subject">${sub.name}</td>
        <td class="td-score"><strong>${sub.score}</strong> <span class="score-denominator">/ ${sub.max}</span></td>
        <td class="td-bar">
          <div class="progress-track">
            <div class="progress-fill" style="width: 0%"></div>
          </div>
        </td>
        <td class="td-status">
          <span class="status-pill ${sub.isPass ? 'pass' : 'fail'}">${sub.isPass ? 'PASS' : 'FAIL'}</span>
        </td>
      `;

      tbody.appendChild(tr);

      // Trigger width transition smoothly
      requestAnimationFrame(() => {
        const fill = tr.querySelector('.progress-fill');
        if (fill) {
          fill.style.width = `${Math.min(sub.percentage, 100)}%`;
        }
      });
    });

    // Update Summary Box
    document.getElementById('displayTotalScore').textContent = `${totalScore} / ${totalMaxScore}`;
    document.getElementById('displayPercentage').textContent = `${overallPercentage.toFixed(2)}%`;
    document.getElementById('displayGrade').textContent = finalGrade;
    document.getElementById('displayDistinctions').textContent = `${distinctionCount} / ${subjectConfigs.length}`;
  }

  // Event Listeners
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateAndRender();
  });

  btnReset.addEventListener('click', () => {
    document.getElementById('studentName').value = '';
    document.getElementById('rollNo').value = '';
    subjectConfigs.forEach(cfg => {
      document.getElementById(cfg.id).value = '';
    });

    // Reset displays
    document.getElementById('displayStudentName').textContent = '—';
    document.getElementById('displayRollNo').textContent = 'Roll No: —';
    document.getElementById('displayOverallStatus').textContent = 'PENDING';
    document.getElementById('displayOverallStatus').className = 'overall-status-badge';
    document.getElementById('reportTableBody').innerHTML = '';
    document.getElementById('displayTotalScore').textContent = '0 / 600';
    document.getElementById('displayPercentage').textContent = '0.00%';
    document.getElementById('displayGrade').textContent = '—';
    document.getElementById('displayDistinctions').textContent = '0 / 5';
  });

  // Initial render with default loaded values matching screenshots
  calculateAndRender();
});
