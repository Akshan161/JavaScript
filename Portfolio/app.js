/**
 * PERSONA 3 RELOAD THEMED PORTFOLIO CONTROLLER
 * Candidate: Akshan Motghare (Symbiosis Institute of Technology Nagpur)
 * Features: Web Audio API SFX, Dynamic Transitions, Keyboard Navigation, Moon Phase HUD
 */

(function () {
  'use strict';

  // =========================================================================
  // AUDIO SYNTHESIZER (Web Audio API - No external audio files needed!)
  // =========================================================================
  class P3RSoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.init();
    }

    init() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      } catch (e) {
        console.warn('Web Audio API not supported on this browser.');
      }
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    // Crisp cursor movement tick
    playCursor() {
      if (!this.enabled || !this.ctx) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.035);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    }

    // Energetic Persona Confirm Chime (Dual harmonic sweep)
    playConfirm() {
      if (!this.enabled || !this.ctx) return;
      this.resume();
      const now = this.ctx.currentTime;

      [659.25, 1046.5].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = i === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + i * 0.04 + 0.12);

        gain.gain.setValueAtTime(0.12, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.2);
      });
    }

    // Dismiss / Back Tone
    playCancel() {
      if (!this.enabled || !this.ctx) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    }

    // Deep Slash / Shutter Whoosh
    playSlash() {
      if (!this.enabled || !this.ctx) return;
      this.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  const sfx = new P3RSoundEngine();

  // =========================================================================
  // DOM ELEMENTS
  // =========================================================================
  const slashOverlay = document.getElementById('transition-slash');
  const titleScreen = document.getElementById('title-screen');
  const mainMenuScreen = document.getElementById('main-menu-screen');
  const detailScreen = document.getElementById('detail-screen');

  const sfxToggleBtn = document.getElementById('sfx-toggle');
  const restartIntroBtn = document.getElementById('restart-intro-btn');
  const liveClockEl = document.getElementById('live-clock');
  const moonPhaseEl = document.getElementById('moon-phase');

  const wheelItems = Array.from(document.querySelectorAll('.wheel-item'));
  const previewTitle = document.getElementById('preview-title');
  const previewDesc = document.getElementById('preview-desc');

  const detailCategoryTitle = document.getElementById('detail-category-title');
  const navArrowLeft = document.getElementById('nav-arrow-left');
  const navArrowRight = document.getElementById('nav-arrow-right');
  const detailBackBtn = document.getElementById('detail-back-btn');
  const tabPanes = Array.from(document.querySelectorAll('.tab-pane'));

  const toastEl = document.getElementById('p3r-toast');
  const bgVideo = document.getElementById('bg-video');

  // Preview descriptions map for wheel items
  const itemDescriptions = {
    summary: {
      title: 'SUMMARY // CANDIDATE PROFILE',
      desc: 'Second Year Engineering Student of BE – Computer Science & Engineering at Symbiosis Institute of Technology Nagpur. Passionate scholar and AI specialist.'
    },
    skills: {
      title: 'TECHNICAL SKILLS // DOMAINS',
      desc: 'Certified in Artificial Intelligence, Machine Learning, Neural Networks, Natural Language Processing (NLP), Python, JavaScript, and C++.'
    },
    education: {
      title: 'EDUCATION // ACADEMICS',
      desc: 'Bachelor of Engineering (BE) in Computer Science & Engineering at Symbiosis Institute of Technology (SIT), Nagpur. 2nd Year (Sophomore).'
    },
    certifications: {
      title: 'CERTIFICATIONS // CREDENTIALS',
      desc: 'Mastering Agentic AI Automation, UI/UX Design, Linux System Administration, Data Analysis of Algorithms, and Database Management Systems.'
    },
    projects: {
      title: 'PROJECTS // LABS & SYSTEMS',
      desc: 'NLP Text Analysis Engines, Deep Learning Classifiers, Academic Portals, and High-Performance Web Applications.'
    },
    social: {
      title: 'SOCIAL LINKS // NETWORKS',
      desc: 'GitHub Code Repositories, LinkedIn Professional Network, Direct Email Dispatch, and Telephone Contact.'
    },
    interests: {
      title: 'READING & PASSIONS // LITERATURE',
      desc: 'Wings of Fire, Il Principe, The Art of War, The Complete Book of Yoga, Agatha Christie classics, Harry Potter series, and AI research.'
    },
    equipment: {
      title: 'TECH TOOLKIT // ENVIRONMENT',
      desc: 'Primary Languages: Python 3 & C++ | Foundation: Data Structures & Algorithms | Stack: AI Frameworks, Modern Web & Toolchains.'
    },
    contact: {
      title: 'CONTACT INFO // DISPATCH',
      desc: 'Direct Transmission Terminal: Nagpur, India | akshanm1611@gmail.com | +91-8010983863 | Ready for engineering opportunities.'
    }
  };

  const sectionsList = [
    'summary',
    'skills',
    'education',
    'certifications',
    'projects',
    'social',
    'interests',
    'equipment',
    'contact'
  ];

  let currentScreen = 'title'; // 'title' | 'menu' | 'detail'
  let activeWheelIndex = 0;
  let activeSectionIndex = 0;

  // =========================================================================
  // TRANSITION MANAGER (P3R SHUTTER SLICE)
  // =========================================================================
  function executeScreenTransition(fromScreenEl, toScreenEl, onMidpoint) {
    sfx.playSlash();

    // Trigger slash cover
    slashOverlay.classList.remove('exit');
    slashOverlay.classList.add('active');

    setTimeout(() => {
      // Midpoint: switch views
      fromScreenEl.classList.remove('active');
      fromScreenEl.classList.add('hidden');

      toScreenEl.classList.remove('hidden');
      toScreenEl.classList.add('active');

      if (onMidpoint) onMidpoint();

      // Ensure background video is running smoothly
      if (bgVideo && bgVideo.paused) {
        bgVideo.play().catch(() => {});
      }

      // Exit slash
      slashOverlay.classList.remove('active');
      slashOverlay.classList.add('exit');

      setTimeout(() => {
        slashOverlay.classList.remove('exit');
      }, 350);
    }, 240);
  }

  // =========================================================================
  // TITLE SCREEN INTERACTION
  // =========================================================================
  function startPortfolioFromTitle() {
    if (currentScreen !== 'title') return;
    currentScreen = 'menu';
    sfx.playConfirm();

    executeScreenTransition(titleScreen, mainMenuScreen, () => {
      updateWheelSelection(0);
    });
  }

  titleScreen.addEventListener('click', startPortfolioFromTitle);

  // Return to title screen
  restartIntroBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentScreen === 'title') return;
    sfx.playCancel();

    const fromEl = currentScreen === 'menu' ? mainMenuScreen : detailScreen;
    currentScreen = 'title';

    executeScreenTransition(fromEl, titleScreen, () => {});
  });

  // =========================================================================
  // WHEEL MENU SYSTEM
  // =========================================================================
  function updateWheelSelection(index) {
    if (index < 0) index = wheelItems.length - 1;
    if (index >= wheelItems.length) index = 0;

    activeWheelIndex = index;

    wheelItems.forEach((item, idx) => {
      if (idx === index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    const activeItem = wheelItems[index];
    const targetKey = activeItem.getAttribute('data-target');
    const info = itemDescriptions[targetKey];

    if (info) {
      previewTitle.textContent = info.title;
      previewDesc.textContent = info.desc;
    }
  }

  wheelItems.forEach((item, idx) => {
    item.addEventListener('mouseenter', () => {
      if (activeWheelIndex !== idx) {
        sfx.playCursor();
        updateWheelSelection(idx);
      }
    });

    item.addEventListener('click', () => {
      openDetailSection(idx);
    });
  });

  function openDetailSection(index) {
    currentScreen = 'detail';
    activeSectionIndex = index;
    sfx.playConfirm();

    executeScreenTransition(mainMenuScreen, detailScreen, () => {
      showDetailTab(index);
    });
  }

  // =========================================================================
  // DETAIL SCREEN SYSTEM
  // =========================================================================
  function showDetailTab(index) {
    if (index < 0) index = sectionsList.length - 1;
    if (index >= sectionsList.length) index = 0;

    activeSectionIndex = index;
    const targetKey = sectionsList[index];

    // Update Header
    const formattedTitle = targetKey.toUpperCase().replace('-', ' & ');
    if (formattedTitle === 'INTERESTS') {
      detailCategoryTitle.textContent = 'READING & PASSIONS';
    } else if (formattedTitle === 'EQUIPMENT') {
      detailCategoryTitle.textContent = 'TECH TOOLKIT';
    } else {
      detailCategoryTitle.textContent = formattedTitle;
    }

    // Toggle Panes
    tabPanes.forEach((pane) => {
      if (pane.id === `content-${targetKey}`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  }

  navArrowLeft.addEventListener('click', () => {
    sfx.playCursor();
    showDetailTab(activeSectionIndex - 1);
  });

  navArrowRight.addEventListener('click', () => {
    sfx.playCursor();
    showDetailTab(activeSectionIndex + 1);
  });

  function returnToWheelMenu() {
    if (currentScreen !== 'detail') return;
    currentScreen = 'menu';
    sfx.playCancel();

    executeScreenTransition(detailScreen, mainMenuScreen, () => {
      updateWheelSelection(activeSectionIndex);
    });
  }

  detailBackBtn.addEventListener('click', returnToWheelMenu);

  // =========================================================================
  // KEYBOARD NAVIGATION (AUTHENTIC CONTROLLER / GAMEPAD FEEL)
  // =========================================================================
  window.addEventListener('keydown', (e) => {
    // If user is currently typing in an input/textarea, skip game hotkeys
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      if (e.key === 'Escape') {
        document.activeElement.blur();
      }
      return;
    }

    if (currentScreen === 'title') {
      startPortfolioFromTitle();
      return;
    }

    if (currentScreen === 'menu') {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        sfx.playCursor();
        updateWheelSelection(activeWheelIndex - 1);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        sfx.playCursor();
        updateWheelSelection(activeWheelIndex + 1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDetailSection(activeWheelIndex);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        restartIntroBtn.click();
      } else if (e.key === 'm' || e.key === 'M') {
        sfxToggleBtn.click();
      }
      return;
    }

    if (currentScreen === 'detail') {
      if (e.key === 'ArrowLeft' || e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        sfx.playCursor();
        showDetailTab(activeSectionIndex - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        sfx.playCursor();
        showDetailTab(activeSectionIndex + 1);
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        returnToWheelMenu();
      } else if (e.key === 'm' || e.key === 'M') {
        sfxToggleBtn.click();
      }
    }
  });

  // =========================================================================
  // TOAST & CLIPBOARD SYSTEM
  // =========================================================================
  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    sfx.playConfirm();
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2200);
  }

  document.querySelectorAll('.btn-copy').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`COPIED: ${textToCopy}`);
      }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`COPIED: ${textToCopy}`);
      });
    });
  });

  // Audio Toggle Button
  sfxToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isEnabled = sfx.toggle();
    const label = sfxToggleBtn.querySelector('.label');
    const icon = sfxToggleBtn.querySelector('.icon');
    if (isEnabled) {
      label.textContent = 'SFX: ON';
      icon.textContent = '🔊';
      sfx.playConfirm();
    } else {
      label.textContent = 'SFX: OFF';
      icon.textContent = '🔇';
    }
  });

  // =========================================================================
  // CONTACT FORM DISPATCH
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const senderName = document.getElementById('sender-name').value.trim();
      const senderEmail = document.getElementById('sender-email').value.trim();
      const senderMsg = document.getElementById('sender-msg').value.trim();

      if (!senderName || !senderEmail || !senderMsg) {
        sfx.playCancel();
        formFeedback.style.color = 'var(--p3r-crimson)';
        formFeedback.textContent = 'ERROR: Please fill out all required transmission parameters.';
        return;
      }

      sfx.playConfirm();
      formFeedback.style.color = 'var(--p3r-cyan-bright)';
      formFeedback.textContent = 'TRANSMISSION READY: Launching default mail client...';

      const mailtoUrl = `mailto:akshanm1611@gmail.com?subject=${encodeURIComponent(
        `Portfolio Inquiry from ${senderName}`
      )}&body=${encodeURIComponent(
        `From: ${senderName} (${senderEmail})\n\nMessage:\n${senderMsg}`
      )}`;

      setTimeout(() => {
        window.location.href = mailtoUrl;
        showToast('MAIL CLIENT DISPATCHED');
        contactForm.reset();
        formFeedback.textContent = 'STATUS: DISPATCH SUCCESSFUL';
      }, 700);
    });
  }

  // =========================================================================
  // LIVE HUD CLOCK & MOON PHASE CALCULATOR
  // =========================================================================
  function updateLiveClock() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    if (liveClockEl) {
      liveClockEl.textContent = `${hrs}:${mins}:${secs}`;
    }
  }

  function calculateMoonPhase() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    // Approximate Moon Age formula
    let c = 0, e = 0, jd = 0, b = 0;
    if (month < 3) {
      year - 1;
      month + 12;
    }
    ++c;
    c = 365.25 * year;
    e = 30.6 * month;
    jd = c + e + day - 694039.09; // Julian date relative
    jd /= 29.5305882; // Lunar cycle in days
    b = parseInt(jd);
    jd -= b; // Fraction of cycle
    b = Math.round(jd * 8);
    if (b >= 8) b = 0;

    const phases = [
      '🌑 NEW MOON',
      '🌒 WAXING CRESCENT',
      '🌓 FIRST QUARTER',
      '🌔 WAXING GIBBOUS',
      '🌕 FULL MOON',
      '🌖 WANING GIBBOUS',
      '🌗 LAST QUARTER',
      '🌘 WANING CRESCENT'
    ];

    const percentage = Math.round(jd * 100);
    if (moonPhaseEl) {
      moonPhaseEl.textContent = `${phases[b]} ${percentage}%`;
    }
  }

  setInterval(updateLiveClock, 1000);
  updateLiveClock();
  calculateMoonPhase();

  // Ensure robust background video autoplay & looping
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.defaultMuted = true;
    bgVideo.playsInline = true;

    const startVideo = () => {
      const p = bgVideo.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    };

    startVideo();

    // Browser interaction fallback listeners
    ['click', 'keydown', 'touchstart', 'mousemove'].forEach((evt) => {
      window.addEventListener(evt, startVideo, { once: true });
    });
  }
})();
