/**
 * TITANPULSE GYM ADMISSION PORTAL - JAVASCRIPT EVENT ARCHITECTURE
 * Demonstrates: input, change, focus, blur, submit, reset events
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements - Form & Controls
  const form = document.getElementById('gymAdmissionForm');
  const btnAutofill = document.getElementById('btnAutofill');
  const btnSubmit = document.getElementById('btnSubmit');
  const btnReset = document.getElementById('btnReset');
  const btnPrintSlip = document.getElementById('btnPrintSlip');
  const btnNewAdmission = document.getElementById('btnNewAdmission');

  // Input Fields
  const fullNameInput = document.getElementById('fullName');
  const prnInput = document.getElementById('prn');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const ageInput = document.getElementById('age');
  const genderSelect = document.getElementById('gender');
  const bloodGroupSelect = document.getElementById('bloodGroup');
  const planTierSelect = document.getElementById('planTier');
  const billingDurationSelect = document.getElementById('billingDuration');
  const trainingSlotSelect = document.getElementById('trainingSlot');
  const fitnessGoalSelect = document.getElementById('fitnessGoal');
  const addonCheckboxes = document.querySelectorAll('input[name="addons"]');
  const emergencyContactInput = document.getElementById('emergencyContact');
  const startDateInput = document.getElementById('startDate');
  const agreeTermsCheckbox = document.getElementById('agreeTerms');

  // Metrics Bar Elements
  const metricValidationStatus = document.getElementById('metricValidationStatus');
  const metricTier = document.getElementById('metricTier');
  const metricTotal = document.getElementById('metricTotal');
  const metricApplicantName = document.getElementById('metricApplicantName');

  // Billing Engine Elements
  const billBasePlanLabel = document.getElementById('billBasePlanLabel');
  const billBasePlanPrice = document.getElementById('billBasePlanPrice');
  const billTermDuration = document.getElementById('billTermDuration');
  const billDiscountRow = document.getElementById('billDiscountRow');
  const billDiscountVal = document.getElementById('billDiscountVal');
  const billAddonsPrice = document.getElementById('billAddonsPrice');
  const billPayableTotal = document.getElementById('billPayableTotal');

  // Digital Membership Card Elements
  const cardStatusBadge = document.getElementById('cardStatusBadge');
  const cardTierBadge = document.getElementById('cardTierBadge');
  const cardAvatarInitials = document.getElementById('cardAvatarInitials');
  const cardMemberName = document.getElementById('cardMemberName');
  const cardMemberPRN = document.getElementById('cardMemberPRN');
  const cardMemberCardNo = document.getElementById('cardMemberCardNo');
  const cardSlot = document.getElementById('cardSlot');
  const cardBlood = document.getElementById('cardBlood');
  const cardGoal = document.getElementById('cardGoal');
  const cardValidFrom = document.getElementById('cardValidFrom');
  const cardBarcodeSerial = document.getElementById('cardBarcodeSerial');

  // Confirmation Elements
  const confirmationCard = document.getElementById('confirmationCard');
  const confirmWelcomeLead = document.getElementById('confirmWelcomeLead');
  const recReceiptId = document.getElementById('recReceiptId');
  const recApplicantName = document.getElementById('recApplicantName');
  const recPRN = document.getElementById('recPRN');
  const recTier = document.getElementById('recTier');
  const recValidity = document.getElementById('recValidity');
  const recSlot = document.getElementById('recSlot');
  const recEmergency = document.getElementById('recEmergency');
  const recAmountPaid = document.getElementById('recAmountPaid');
  const recTimestamp = document.getElementById('recTimestamp');

  // Event Monitor
  const eventChipsList = document.getElementById('eventChipsList');

  // Set default date to today
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  startDateInput.value = formattedDate;
  cardValidFrom.textContent = formattedDate;

  // Track validation status
  const fieldValidationState = {
    fullName: false,
    prn: false,
    email: false,
    phone: false,
    age: false,
    emergencyContact: false,
    agreeTerms: true
  };

  /**
   * Helper: Log dynamic event chips in footer monitor
   */
  function logEvent(eventName, targetName, info = '') {
    const chip = document.createElement('span');
    chip.className = 'event-chip active';
    chip.textContent = `${eventName} -> ${targetName} ${info ? `(${info})` : ''}`;
    
    eventChipsList.prepend(chip);

    // Keep max 7 chips
    while (eventChipsList.children.length > 7) {
      eventChipsList.removeChild(eventChipsList.lastChild);
    }

    setTimeout(() => {
      chip.classList.remove('active');
    }, 1200);
  }

  /**
   * Helper: Update input feedback UI
   */
  function setFieldFeedback(inputElem, isValid, message, isHint = false) {
    const parentGroup = inputElem.closest('.form-group') || inputElem.closest('.terms-agreement-box');
    const msgElem = document.getElementById(`msg-${inputElem.id}`);

    if (parentGroup) {
      parentGroup.classList.remove('is-valid', 'is-invalid');
      if (!isHint) {
        if (isValid) {
          parentGroup.classList.add('is-valid');
        } else {
          parentGroup.classList.add('is-invalid');
        }
      }
    }

    if (msgElem) {
      msgElem.className = 'feedback-msg';
      if (isHint) {
        msgElem.classList.add('hint');
        msgElem.textContent = message;
      } else if (isValid) {
        msgElem.classList.add('valid');
        msgElem.textContent = message || '✓ Looks good';
      } else {
        msgElem.classList.add('error');
        msgElem.textContent = message || 'Please check this field';
      }
    }

    updateOverallValidationStatus();
  }

  /**
   * Helper: Update Top Metric 1 (Form Validation Status)
   */
  function updateOverallValidationStatus() {
    const keys = Object.keys(fieldValidationState);
    const validCount = keys.filter(k => fieldValidationState[k]).length;
    const totalCount = keys.length;

    if (validCount === 0) {
      metricValidationStatus.textContent = 'Awaiting Input';
      metricValidationStatus.style.color = 'var(--text-muted)';
    } else if (validCount === totalCount) {
      metricValidationStatus.textContent = `All Valid (${validCount}/${totalCount}) ✓`;
      metricValidationStatus.style.color = 'var(--success)';
    } else {
      metricValidationStatus.textContent = `In Progress (${validCount}/${totalCount})`;
      metricValidationStatus.style.color = 'var(--primary)';
    }
  }

  /**
   * Calculation: Recalculate Billing Engine & Pass Preview
   */
  function recalculateBilling() {
    const selectedTierOption = planTierSelect.options[planTierSelect.selectedIndex];
    const baseMonthlyPrice = parseFloat(selectedTierOption.dataset.price) || 29;
    const planName = selectedTierOption.dataset.name || 'Standard Starter';

    const selectedDurationOption = billingDurationSelect.options[billingDurationSelect.selectedIndex];
    const durationMonths = parseInt(billingDurationSelect.value, 10) || 1;
    const discountRate = parseFloat(selectedDurationOption.dataset.discount) || 0;

    // Calculate Add-ons
    let addonsMonthlySum = 0;
    addonCheckboxes.forEach(cb => {
      const card = cb.closest('.addon-card');
      if (cb.checked) {
        addonsMonthlySum += parseFloat(cb.dataset.price) || 0;
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });

    // Subtotal
    const monthlyTotal = baseMonthlyPrice + addonsMonthlySum;
    const grossTotal = monthlyTotal * durationMonths;
    const discountAmount = grossTotal * discountRate;
    const netTotal = grossTotal - discountAmount;

    // Update UI elements
    billBasePlanLabel.textContent = `Base Plan (${planName}):`;
    billBasePlanPrice.textContent = `$${baseMonthlyPrice.toFixed(2)} / mo`;
    billTermDuration.textContent = selectedDurationOption.textContent;

    if (discountRate > 0) {
      billDiscountRow.style.display = 'flex';
      billDiscountVal.textContent = `-$${discountAmount.toFixed(2)} (${discountRate * 100}% Off)`;
    } else {
      billDiscountRow.style.display = 'none';
    }

    billAddonsPrice.textContent = `+$${addonsMonthlySum.toFixed(2)} / mo`;
    const formattedTotal = `$${netTotal.toFixed(2)}`;
    billPayableTotal.textContent = formattedTotal;

    // Update top metrics
    metricTotal.textContent = formattedTotal;
    metricTier.textContent = `${planName} ($${baseMonthlyPrice}/mo)`;

    // Update digital pass tier badge
    cardTierBadge.textContent = planTierSelect.value.toUpperCase();
  }

  /**
   * Helper: Update initials & member name on card
   */
  function updateMemberNameAndCard(nameVal) {
    const trimmed = nameVal.trim();
    if (trimmed) {
      cardMemberName.textContent = trimmed;
      metricApplicantName.textContent = trimmed;

      // Extract initials
      const parts = trimmed.split(' ').filter(Boolean);
      let initials = parts[0] ? parts[0][0].toUpperCase() : 'M';
      if (parts.length > 1) {
        initials += parts[parts.length - 1][0].toUpperCase();
      }
      cardAvatarInitials.textContent = initials;
    } else {
      cardMemberName.textContent = 'Applicant Name';
      cardAvatarInitials.textContent = 'TP';
      metricApplicantName.textContent = 'Not Registered';
    }
  }

  // =========================================================================
  // 1. INPUT EVENTS (Real-time live typing & validation)
  // =========================================================================

  // Full Name
  fullNameInput.addEventListener('input', (e) => {
    const val = e.target.value;
    updateMemberNameAndCard(val);
    const isValid = val.trim().length >= 3;
    fieldValidationState.fullName = isValid;
    if (isValid) {
      setFieldFeedback(fullNameInput, true, '✓ Looks good');
    }
    logEvent('input', 'fullName', `${val.length} chars`);
  });

  // PRN
  prnInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val) {
      cardMemberPRN.textContent = val;
      cardMemberCardNo.textContent = `TP-${val}`;
      cardBarcodeSerial.textContent = `TP-${val}-OFFICIAL`;
    } else {
      cardMemberPRN.textContent = '24070521276';
      cardMemberCardNo.textContent = 'TP-24070521276';
      cardBarcodeSerial.textContent = 'TP-24070521276-OFFICIAL';
    }
    const isValid = /^[0-9a-zA-Z]{6,16}$/.test(val);
    fieldValidationState.prn = isValid;
    if (isValid) {
      setFieldFeedback(prnInput, true, '✓ Valid PRN / ID');
    }
    logEvent('input', 'prn', val);
  });

  // Email
  emailInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    fieldValidationState.email = isValid;
    if (isValid) {
      setFieldFeedback(emailInput, true, '✓ Looks good');
    }
    logEvent('input', 'email');
  });

  // Phone
  phoneInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const isValid = /^\+?[0-9]{8,15}$/.test(val);
    fieldValidationState.phone = isValid;
    if (isValid) {
      setFieldFeedback(phoneInput, true, '✓ Looks good');
    }
    logEvent('input', 'phone');
  });

  // Age
  ageInput.addEventListener('input', (e) => {
    const ageNum = parseInt(e.target.value, 10);
    const isValid = !isNaN(ageNum) && ageNum >= 14 && ageNum <= 80;
    fieldValidationState.age = isValid;
    if (isValid) {
      setFieldFeedback(ageInput, true, '✓ Eligible Age');
    }
    logEvent('input', 'age', ageNum);
  });

  // Emergency Contact
  emergencyContactInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const isValid = val.length >= 6;
    fieldValidationState.emergencyContact = isValid;
    if (isValid) {
      setFieldFeedback(emergencyContactInput, true, '✓ Looks good');
    }
    logEvent('input', 'emergencyContact');
  });

  // =========================================================================
  // 2. FOCUS EVENTS (Contextual Hint & Active Highlight)
  // =========================================================================

  fullNameInput.addEventListener('focus', () => {
    setFieldFeedback(fullNameInput, false, 'Enter official legal name as registered in college records.', true);
    logEvent('focus', 'fullName');
  });

  prnInput.addEventListener('focus', () => {
    setFieldFeedback(prnInput, false, 'Enter your 8-12 character university PRN or Member ID.', true);
    logEvent('focus', 'prn');
  });

  emailInput.addEventListener('focus', () => {
    setFieldFeedback(emailInput, false, 'Admission confirmation & invoice will be sent here.', true);
    logEvent('focus', 'email');
  });

  phoneInput.addEventListener('focus', () => {
    setFieldFeedback(phoneInput, false, 'Enter a reachable mobile phone number.', true);
    logEvent('focus', 'phone');
  });

  ageInput.addEventListener('focus', () => {
    setFieldFeedback(ageInput, false, 'Minimum age is 14 years; maximum eligible age is 80 years.', true);
    logEvent('focus', 'age');
  });

  emergencyContactInput.addEventListener('focus', () => {
    setFieldFeedback(emergencyContactInput, false, 'Guardian / Emergency contact person name and mobile number.', true);
    logEvent('focus', 'emergencyContact');
  });

  startDateInput.addEventListener('focus', () => {
    logEvent('focus', 'startDate');
  });

  // =========================================================================
  // 3. BLUR EVENTS (Validation evaluation on field exit)
  // =========================================================================

  fullNameInput.addEventListener('blur', () => {
    const val = fullNameInput.value.trim();
    const isValid = val.length >= 3;
    fieldValidationState.fullName = isValid;
    setFieldFeedback(fullNameInput, isValid, isValid ? '✓ Looks good' : 'Full Name must be at least 3 characters.');
    logEvent('blur', 'fullName');
  });

  prnInput.addEventListener('blur', () => {
    const val = prnInput.value.trim();
    const isValid = /^[0-9a-zA-Z]{6,16}$/.test(val);
    fieldValidationState.prn = isValid;
    setFieldFeedback(prnInput, isValid, isValid ? '✓ Valid PRN' : 'PRN must be 6-16 alphanumeric characters.');
    logEvent('blur', 'prn');
  });

  emailInput.addEventListener('blur', () => {
    const val = emailInput.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    fieldValidationState.email = isValid;
    setFieldFeedback(emailInput, isValid, isValid ? '✓ Looks good' : 'Please provide a valid email address.');
    logEvent('blur', 'email');
  });

  phoneInput.addEventListener('blur', () => {
    const val = phoneInput.value.trim();
    const isValid = /^\+?[0-9]{8,15}$/.test(val);
    fieldValidationState.phone = isValid;
    setFieldFeedback(phoneInput, isValid, isValid ? '✓ Looks good' : 'Phone number must be between 8 and 15 digits.');
    logEvent('blur', 'phone');
  });

  ageInput.addEventListener('blur', () => {
    const ageNum = parseInt(ageInput.value, 10);
    const isValid = !isNaN(ageNum) && ageNum >= 14 && ageNum <= 80;
    fieldValidationState.age = isValid;
    setFieldFeedback(ageInput, isValid, isValid ? '✓ Eligible Age' : 'Age must be between 14 and 80.');
    logEvent('blur', 'age');
  });

  emergencyContactInput.addEventListener('blur', () => {
    const val = emergencyContactInput.value.trim();
    const isValid = val.length >= 6;
    fieldValidationState.emergencyContact = isValid;
    setFieldFeedback(emergencyContactInput, isValid, isValid ? '✓ Looks good' : 'Please enter emergency contact name and phone.');
    logEvent('blur', 'emergencyContact');
  });

  // =========================================================================
  // 4. CHANGE EVENTS (Selects, Dates, Checkboxes triggering calculations)
  // =========================================================================

  planTierSelect.addEventListener('change', () => {
    recalculateBilling();
    logEvent('change', 'planTier', planTierSelect.value);
  });

  billingDurationSelect.addEventListener('change', () => {
    recalculateBilling();
    logEvent('change', 'billingDuration', `${billingDurationSelect.value} mo`);
  });

  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      recalculateBilling();
      logEvent('change', 'addon', `${cb.value}: ${cb.checked}`);
    });
  });

  genderSelect.addEventListener('change', () => {
    logEvent('change', 'gender', genderSelect.value);
  });

  bloodGroupSelect.addEventListener('change', () => {
    cardBlood.textContent = bloodGroupSelect.value;
    logEvent('change', 'bloodGroup', bloodGroupSelect.value);
  });

  trainingSlotSelect.addEventListener('change', () => {
    // Short format for card
    let slotText = trainingSlotSelect.value;
    if (slotText.includes('06:00 AM')) slotText = 'Morning (6-9 AM)';
    else if (slotText.includes('11:00 AM')) slotText = 'Mid-day (11-2 PM)';
    else if (slotText.includes('05:00 PM')) slotText = 'Evening (5-8 PM)';
    else if (slotText.includes('08:00 PM')) slotText = 'Night (8-11 PM)';

    cardSlot.textContent = slotText;
    logEvent('change', 'trainingSlot', slotText);
  });

  fitnessGoalSelect.addEventListener('change', () => {
    let goalShort = fitnessGoalSelect.value.split(' ')[0];
    if (fitnessGoalSelect.value.includes('Hypertrophy')) goalShort = 'Hypertrophy';
    else if (fitnessGoalSelect.value.includes('Weight Loss')) goalShort = 'Weight Loss';
    else if (fitnessGoalSelect.value.includes('Strength')) goalShort = 'Strength';
    else if (fitnessGoalSelect.value.includes('Endurance')) goalShort = 'Endurance';
    cardGoal.textContent = goalShort;
    logEvent('change', 'fitnessGoal', goalShort);
  });

  startDateInput.addEventListener('change', () => {
    cardValidFrom.textContent = startDateInput.value || formattedDate;
    logEvent('change', 'startDate', startDateInput.value);
  });

  agreeTermsCheckbox.addEventListener('change', () => {
    fieldValidationState.agreeTerms = agreeTermsCheckbox.checked;
    setFieldFeedback(agreeTermsCheckbox, agreeTermsCheckbox.checked, agreeTermsCheckbox.checked ? '' : 'You must accept the terms.');
    logEvent('change', 'agreeTerms', agreeTermsCheckbox.checked);
  });

  // =========================================================================
  // 5. SUBMIT EVENT (Verification, receipt generation, pass activation)
  // =========================================================================

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    logEvent('submit', 'gymAdmissionForm');

    // Run full validation check
    const isNameValid = fullNameInput.value.trim().length >= 3;
    const isPrnValid = /^[0-9a-zA-Z]{6,16}$/.test(prnInput.value.trim());
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
    const isPhoneValid = /^\+?[0-9]{8,15}$/.test(phoneInput.value.trim());
    const ageVal = parseInt(ageInput.value, 10);
    const isAgeValid = !isNaN(ageVal) && ageVal >= 14 && ageVal <= 80;
    const isEmergencyValid = emergencyContactInput.value.trim().length >= 6;
    const isTermsValid = agreeTermsCheckbox.checked;

    fieldValidationState.fullName = isNameValid;
    fieldValidationState.prn = isPrnValid;
    fieldValidationState.email = isEmailValid;
    fieldValidationState.phone = isPhoneValid;
    fieldValidationState.age = isAgeValid;
    fieldValidationState.emergencyContact = isEmergencyValid;
    fieldValidationState.agreeTerms = isTermsValid;

    // Trigger visual feedback on all fields
    setFieldFeedback(fullNameInput, isNameValid, isNameValid ? '✓ Looks good' : 'Full Name is required (3+ chars).');
    setFieldFeedback(prnInput, isPrnValid, isPrnValid ? '✓ Valid PRN' : 'Valid PRN is required.');
    setFieldFeedback(emailInput, isEmailValid, isEmailValid ? '✓ Looks good' : 'Valid email is required.');
    setFieldFeedback(phoneInput, isPhoneValid, isPhoneValid ? '✓ Looks good' : 'Valid phone number is required.');
    setFieldFeedback(ageInput, isAgeValid, isAgeValid ? '✓ Eligible Age' : 'Valid age between 14-80 is required.');
    setFieldFeedback(emergencyContactInput, isEmergencyValid, isEmergencyValid ? '✓ Looks good' : 'Emergency contact details required.');
    setFieldFeedback(agreeTermsCheckbox, isTermsValid, isTermsValid ? '' : 'You must confirm and accept the safety terms.');

    const allValid = isNameValid && isPrnValid && isEmailValid && isPhoneValid && isAgeValid && isEmergencyValid && isTermsValid;

    if (!allValid) {
      // Find first invalid input and focus it
      if (!isNameValid) fullNameInput.focus();
      else if (!isPrnValid) prnInput.focus();
      else if (!isEmailValid) emailInput.focus();
      else if (!isPhoneValid) phoneInput.focus();
      else if (!isAgeValid) ageInput.focus();
      else if (!isEmergencyValid) emergencyContactInput.focus();
      else if (!isTermsValid) agreeTermsCheckbox.focus();
      return;
    }

    // Generate dynamic receipt ID & timestamp
    const receiptNum = Math.floor(1000 + Math.random() * 9000);
    const receiptId = `REC-TP-${prnInput.value.trim()}-${receiptNum}`;
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    // Populate receipt data
    confirmWelcomeLead.innerHTML = `Welcome to TitanPulse Gym, <strong>${fullNameInput.value.trim()}</strong>! Your admission registration under PRN <strong>${prnInput.value.trim()}</strong> is confirmed and entered into the master roster.`;
    recReceiptId.textContent = receiptId;
    recApplicantName.textContent = fullNameInput.value.trim();
    recPRN.textContent = prnInput.value.trim();
    recTier.textContent = planTierSelect.options[planTierSelect.selectedIndex].dataset.name;
    recValidity.textContent = `${billingDurationSelect.options[billingDurationSelect.selectedIndex].textContent} (Starts ${startDateInput.value})`;
    recSlot.textContent = trainingSlotSelect.value;
    recEmergency.textContent = emergencyContactInput.value.trim();
    recAmountPaid.textContent = `${billPayableTotal.textContent} USD`;
    recTimestamp.textContent = timestamp;

    // Update status badge on pass card
    cardStatusBadge.className = 'badge-status-verified';
    cardStatusBadge.textContent = 'Verified Member';

    // Update metric validation card
    metricValidationStatus.textContent = 'Registration Confirmed ✓';
    metricValidationStatus.style.color = 'var(--success)';

    // Show confirmation card smoothly
    confirmationCard.style.display = 'block';
    confirmationCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // =========================================================================
  // 6. RESET EVENT (Restores default state)
  // =========================================================================

  function resetAdmissionPortal() {
    form.reset();
    startDateInput.value = formattedDate;

    // Reset validation states
    Object.keys(fieldValidationState).forEach(k => {
      fieldValidationState[k] = false;
    });
    fieldValidationState.agreeTerms = true;

    // Reset feedback UI
    document.querySelectorAll('.form-group, .terms-agreement-box').forEach(g => {
      g.classList.remove('is-valid', 'is-invalid');
    });
    document.querySelectorAll('.feedback-msg').forEach(m => {
      m.textContent = '';
      m.className = 'feedback-msg';
    });

    // Reset default card preview
    updateMemberNameAndCard('Akshan Motghare');
    cardMemberPRN.textContent = '24070521276';
    cardMemberCardNo.textContent = 'TP-24070521276';
    cardSlot.textContent = 'Morning (6-9 AM)';
    cardBlood.textContent = 'A+';
    cardGoal.textContent = 'Hypertrophy';
    cardValidFrom.textContent = formattedDate;
    cardBarcodeSerial.textContent = 'TP-24070521276-OFFICIAL';
    cardStatusBadge.className = 'badge-status-awaiting';
    cardStatusBadge.textContent = 'Awaiting Submission';

    // Hide confirmation
    confirmationCard.style.display = 'none';

    // Recalculate
    recalculateBilling();
    updateOverallValidationStatus();

    logEvent('reset', 'gymAdmissionForm');
  }

  btnReset.addEventListener('click', () => {
    resetAdmissionPortal();
  });

  btnNewAdmission.addEventListener('click', () => {
    resetAdmissionPortal();
    fullNameInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =========================================================================
  // 7. QUICK AUTOFILL (Exact Sample Data from Screenshot)
  // =========================================================================

  function fillSampleData() {
    fullNameInput.value = 'Akshan Motghare';
    prnInput.value = '24070521276';
    emailInput.value = 'akshan.motghare.official@gmail.com';
    phoneInput.value = '9876543210';
    ageInput.value = '20';
    genderSelect.value = 'Male';
    bloodGroupSelect.value = 'A+';
    planTierSelect.value = 'standard';
    billingDurationSelect.value = '1';
    trainingSlotSelect.value = 'Morning (06:00 AM - 09:00 AM)';
    fitnessGoalSelect.value = 'Hypertrophy & Muscle Building';
    emergencyContactInput.value = 'Motghare (Parent) - 9876543211';
    startDateInput.value = '2026-10-04';
    agreeTermsCheckbox.checked = true;

    // Addons: check only dedicated locker
    addonCheckboxes.forEach(cb => {
      cb.checked = (cb.value === 'locker');
    });

    // Fire simulated input events
    updateMemberNameAndCard(fullNameInput.value);
    cardMemberPRN.textContent = prnInput.value;
    cardMemberCardNo.textContent = `TP-${prnInput.value}`;
    cardBarcodeSerial.textContent = `TP-${prnInput.value}-OFFICIAL`;
    cardSlot.textContent = 'Morning (6-9 AM)';
    cardBlood.textContent = 'A+';
    cardGoal.textContent = 'Hypertrophy';
    cardValidFrom.textContent = startDateInput.value;

    // Validate states
    Object.keys(fieldValidationState).forEach(k => {
      fieldValidationState[k] = true;
    });

    setFieldFeedback(fullNameInput, true, '✓ Looks good');
    setFieldFeedback(prnInput, true, '✓ Looks good');
    setFieldFeedback(emailInput, true, '✓ Looks good');
    setFieldFeedback(phoneInput, true, '✓ Looks good');
    setFieldFeedback(ageInput, true, '✓ Looks good');
    setFieldFeedback(emergencyContactInput, true, '✓ Looks good');
    setFieldFeedback(agreeTermsCheckbox, true, '');

    recalculateBilling();
    updateOverallValidationStatus();
    logEvent('autofill', 'Akshan Motghare', 'PRN: 24070521276');
  }

  btnAutofill.addEventListener('click', fillSampleData);

  // =========================================================================
  // 8. PRINT OFFICIAL ADMISSION SLIP
  // =========================================================================

  btnPrintSlip.addEventListener('click', () => {
    logEvent('click', 'Print Slip');
    window.print();
  });

  // Initial Calculation on Page Load
  recalculateBilling();
  updateMemberNameAndCard('Akshan Motghare');
  logEvent('ready', 'TitanPulse Engine');
});
