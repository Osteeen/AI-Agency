/* ============================================================
   AUSMARK AI AGENCY — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Sticky Header ──────────────────────────────────────── */
  const header = document.getElementById('header');

  function handleScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ── Mobile Nav Toggle ──────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    nav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close nav when a link is clicked
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    }
  });


  /* ── Scroll Animations ──────────────────────────────────── */
  const animElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // stagger siblings in the same parent
          const siblings = entry.target.parentElement.querySelectorAll('[data-animate]');
          let delay = 0;
          siblings.forEach((el, idx) => {
            if (el === entry.target) delay = idx * 80;
          });
          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  animElements.forEach(el => observer.observe(el));


  /* ── Active Nav Link on Scroll ──────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.style.color = href === `#${id}` ? 'var(--white)' : '';
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(s => sectionObserver.observe(s));


  /* ── Form Validation ────────────────────────────────────── */
  const form        = document.getElementById('auditForm');
  const formSuccess = document.getElementById('formSuccess');

  const rules = {
    businessName:    { required: true, label: 'Business name' },
    businessType:    { required: true, label: 'Business type' },
    timeWaster:      { required: true, minLength: 10, label: 'This field' },
    usingAutomation: { required: true, label: 'This selection' },
    success90:       { required: true, minLength: 10, label: 'This field' },
    teamSize:        { required: true, label: 'Team size' },
    email:           { required: true, email: true, label: 'Email address' },
  };

  function getFieldValue(name) {
    const el = form.elements[name];
    if (!el) return '';
    // Radio group
    if (el instanceof RadioNodeList) {
      return el.value || '';
    }
    return el.value.trim();
  }

  function showError(name, msg) {
    const errEl = document.getElementById(`err-${name}`);
    const fieldEl = form.elements[name];
    if (errEl) errEl.textContent = msg;
    if (fieldEl && !(fieldEl instanceof RadioNodeList)) {
      fieldEl.classList.add('invalid');
    }
  }

  function clearError(name) {
    const errEl = document.getElementById(`err-${name}`);
    const fieldEl = form.elements[name];
    if (errEl) errEl.textContent = '';
    if (fieldEl && !(fieldEl instanceof RadioNodeList)) {
      fieldEl.classList.remove('invalid');
    }
  }

  function validateEmail(str) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  }

  function validateForm() {
    let valid = true;

    Object.entries(rules).forEach(([name, rule]) => {
      clearError(name);
      const val = getFieldValue(name);

      if (rule.required && !val) {
        showError(name, `${rule.label} is required.`);
        valid = false;
        return;
      }

      if (val && rule.minLength && val.length < rule.minLength) {
        showError(name, `Please provide a bit more detail (min ${rule.minLength} characters).`);
        valid = false;
        return;
      }

      if (val && rule.email && !validateEmail(val)) {
        showError(name, 'Please enter a valid email address.');
        valid = false;
        return;
      }
    });

    return valid;
  }

  // Live validation on blur
  Object.keys(rules).forEach(name => {
    const el = form.elements[name];
    if (!el) return;

    if (el instanceof RadioNodeList) {
      el.forEach(radio => {
        radio.addEventListener('change', () => clearError(name));
      });
      return;
    }

    el.addEventListener('blur', () => {
      const val = el.value.trim();
      const rule = rules[name];
      clearError(name);

      if (rule.required && !val) {
        showError(name, `${rule.label} is required.`);
        return;
      }
      if (val && rule.minLength && val.length < rule.minLength) {
        showError(name, `Please provide a bit more detail (min ${rule.minLength} characters).`);
        return;
      }
      if (val && rule.email && !validateEmail(val)) {
        showError(name, 'Please enter a valid email address.');
      }
    });

    el.addEventListener('input', () => {
      if (el.classList.contains('invalid')) clearError(name);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstInvalid = form.querySelector('.invalid, [aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      } else {
        // Scroll to first error message
        const firstErr = form.querySelector('.form-error:not(:empty)');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Simulate submission — replace with real endpoint as needed
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.classList.add('show');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 900);
  });


  /* ── Smooth Scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerOffset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
        10
      ) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
