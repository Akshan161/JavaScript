/**
 * SIT Nagpur - Interactive Scripts (CS1 Assignment / Website)
 */

document.addEventListener('DOMContentLoaded', () => {
  initApplyModal();
  initSmoothScroll();
});

/**
 * Triggered by the "🔔 Click Me for a Greeting!" button in the Hero section.
 */
function triggerGreeting() {
  const currentHour = new Date().getHours();
  let timeGreeting = "Welcome";

  if (currentHour < 12) {
    timeGreeting = "Good morning";
  } else if (currentHour < 17) {
    timeGreeting = "Good afternoon";
  } else {
    timeGreeting = "Good evening";
  }

  const greetingMessage = `${timeGreeting}! Welcome to Symbiosis Institute of Technology (SIT), Nagpur!\n\nEmpowering students with world-class engineering education, cutting-edge research, and boundless global opportunities.`;

  // Display standard JavaScript alert (standard for CS1 labs/assignments)
  alert(greetingMessage);

  // Also display toast for premium visual feedback
  showToast(`🔔 ${timeGreeting}! Welcome to SIT Nagpur!`);
}

/**
 * Apply Now Modal Management
 */
function initApplyModal() {
  const applyBtn = document.getElementById('apply-btn');
  const modal = document.getElementById('apply-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!applyBtn || !modal) return;

  applyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function closeModal() {
  const modal = document.getElementById('apply-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('applicant-name').value;
  const programSelect = document.getElementById('applicant-program');
  const program = programSelect.options[programSelect.selectedIndex].text;

  closeModal();
  showToast(`✅ Thank you, ${name}! Your application enquiry for ${program} has been submitted.`);
  event.target.reset();
}

/**
 * Display toast notification
 */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.style.display = 'block';

  toastTimeout = setTimeout(() => {
    toast.style.display = 'none';
  }, 4500);
}

/**
 * Smooth scrolling offset for fixed header
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#apply') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
