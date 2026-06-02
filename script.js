/**
 * SUSHANT MISHRA PORTFOLIO — script.js
 * World-class futuristic developer portfolio
 * Pure vanilla JS — no frameworks
 */

'use strict';

/* ============================================================
   1. PRELOADER
   ============================================================ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Hide after animation completes
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2000);
  });

  // Fallback: hide after 3s regardless
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 3000);

  document.body.style.overflow = 'hidden';
})();

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const glow = document.getElementById('cursor-glow');
  const dot  = document.getElementById('cursor-dot');
  if (!glow || !dot) return;

  // Only on pointer devices
  if (!window.matchMedia('(hover: hover)').matches) return;

  let mouseX = 0, mouseY = 0;
  let glowX  = 0, glowY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth glow follow
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // Expand cursor on interactive elements
  const interactives = 'a, button, .btn, .project-card, .contact-card, .skill-tag, input, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) dot.classList.add('expanded');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) dot.classList.remove('expanded');
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; });
})();

/* ============================================================
   3. SCROLL PROGRESS BAR
   ============================================================ */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
})();

/* ============================================================
   4. NAVBAR — scroll state + active section tracking
   ============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('section[id]');
  if (!navbar) return;

  // Scrolled state
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
    updateScrollTopBtn();
  }

  // Active link based on scroll position
  function updateActiveLink() {
    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ============================================================
   5. HAMBURGER MENU
   ============================================================ */
(function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  function toggleMenu(open) {
    btn.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Close on link click
  menu.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      toggleMenu(false);
    }
  });
})();

/* ============================================================
   6. THEME TOGGLE
   ============================================================ */
(function initTheme() {
  const btn  = document.getElementById('theme-toggle');
  const body = document.body;
  if (!btn) return;

  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const current = body.dataset.theme;
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(theme) {
    body.dataset.theme = theme;
    body.className     = theme + '-theme';
    const icon = btn.querySelector('.theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
})();

/* ============================================================
   7. TYPED TEXT ANIMATION
   ============================================================ */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Frontend Engineer',
    'React Developer',
    'UI Engineer',
    'Real-Time Systems Builder',
    'Frontend-Focused Software Developer',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  const TYPING_SPEED  = 80;
  const DELETING_SPEED = 45;
  const PAUSE_AFTER   = 1800;
  const PAUSE_BEFORE  = 400;

  function type() {
    if (paused) return;

    const phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; setTimeout(type, DELETING_SPEED); }, PAUSE_AFTER);
        return;
      }
      setTimeout(type, TYPING_SPEED);
    } else {
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        paused    = true;
        setTimeout(() => { paused = false; setTimeout(type, TYPING_SPEED); }, PAUSE_BEFORE);
        return;
      }
      setTimeout(type, DELETING_SPEED);
    }
  }

  setTimeout(type, 1000);
})();

/* ============================================================
   8. SCROLL REVEAL (Intersection Observer)
   ============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
})();

/* ============================================================
   9. ANIMATED STATISTICS COUNTERS
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const dur    = 1800;
        const start  = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / dur, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
})();

/* ============================================================
   10. ANIMATED SKILL BARS
   ============================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        // Small delay for stagger feel
        setTimeout(() => {
          bar.style.width = bar.dataset.width + '%';
        }, 200);
        observer.unobserve(bar);
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((bar) => observer.observe(bar));
})();

/* ============================================================
   11. PROJECT CARD TILT EFFECT
   ============================================================ */
(function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length) return;

  // Only on pointer devices
  if (!window.matchMedia('(hover: hover)').matches) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -8;
      const rotateY = ((x - cx) / cx) *  8;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

      // Move glow to cursor position
      const glow = card.querySelector('.project-card-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(108,99,255,0.2) 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      const glow = card.querySelector('.project-card-glow');
      if (glow) glow.style.background = '';
    });
  });
})();

/* ============================================================
   12. MAGNETIC BUTTONS
   ============================================================ */
(function initMagneticButtons() {
  const btns = document.querySelectorAll('.magnetic-btn');
  if (!btns.length) return;

  if (!window.matchMedia('(hover: hover)').matches) return;

  btns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x    = e.clientX - rect.left - rect.width  / 2;
      const y    = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ============================================================
   13. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ============================================================
   14. SCROLL TO TOP BUTTON
   ============================================================ */
function updateScrollTopBtn() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}

(function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   15. CONTACT FORM VALIDATION
   ============================================================ */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const submit  = document.getElementById('form-submit');
  if (!form) return;

  const fields = {
    name:    { el: document.getElementById('form-name'),    err: document.getElementById('name-error') },
    email:   { el: document.getElementById('form-email'),   err: document.getElementById('email-error') },
    subject: { el: document.getElementById('form-subject'), err: document.getElementById('subject-error') },
    message: { el: document.getElementById('form-message'), err: document.getElementById('message-error') },
  };

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validateField(key) {
    const { el, err } = fields[key];
    const val = el.value.trim();
    let msg = '';

    if (!val) {
      msg = 'This field is required.';
    } else if (key === 'email' && !validateEmail(val)) {
      msg = 'Please enter a valid email address.';
    } else if (key === 'name' && val.length < 2) {
      msg = 'Name must be at least 2 characters.';
    } else if (key === 'message' && val.length < 10) {
      msg = 'Message must be at least 10 characters.';
    }

    err.textContent = msg;
    el.classList.toggle('error', !!msg);
    return !msg;
  }

  // Live validation on blur
  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('error')) validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    const valid = Object.keys(fields).map(validateField).every(Boolean);
    if (!valid) return;

    // Simulate async submission
    submit.classList.add('loading');
    submit.disabled = true;

    setTimeout(() => {
      submit.classList.remove('loading');
      submit.disabled = false;
      success.classList.add('visible');
      form.reset();

      // Hide success after 5s
      setTimeout(() => success.classList.remove('visible'), 5000);
    }, 1500);
  });
})();

/* ============================================================
   16. PARTICLES BACKGROUND
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const CONFIG = {
    count:       60,
    maxRadius:   2.5,
    minRadius:   0.5,
    speed:       0.3,
    connectDist: 120,
    colors:      ['#6C63FF', '#8B5CF6', '#00D4FF'],
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomColor() {
    return CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
  }

  function createParticle() {
    return {
      x:   Math.random() * W,
      y:   Math.random() * H,
      r:   CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius),
      vx:  (Math.random() - 0.5) * CONFIG.speed * 2,
      vy:  (Math.random() - 0.5) * CONFIG.speed * 2,
      clr: randomColor(),
      alpha: 0.3 + Math.random() * 0.5,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update & draw particles
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.clr;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });

    // Draw connections
    ctx.globalAlpha = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectDist) {
          const alpha = (1 - dist / CONFIG.connectDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].clr;
          ctx.globalAlpha = alpha;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(draw);
  }

  // Pause when tab is hidden (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });

  window.addEventListener('resize', () => {
    resize();
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }, { passive: true });

  init();
  draw();
})();

/* ============================================================
   17. PARALLAX EFFECT (hero visual)
   ============================================================ */
(function initParallax() {
  const heroVisual = document.querySelector('.hero-visual');
  if (!heroVisual) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroVisual.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
})();

/* ============================================================
   18. SECTION ENTRANCE ANIMATIONS (stagger children)
   ============================================================ */
(function initSectionAnimations() {
  // Stagger skill categories
  const skillCats = document.querySelectorAll('.skill-category');
  skillCats.forEach((cat, i) => {
    cat.style.setProperty('--delay', `${i * 0.1}s`);
  });

  // Stagger project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, i) => {
    card.style.setProperty('--delay', `${i * 0.15}s`);
  });
})();

/* ============================================================
   19. LAZY LOADING IMAGES (future-proof)
   ============================================================ */
(function initLazyLoad() {
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach((img) => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img));
  }
})();

/* ============================================================
   20. KEYBOARD NAVIGATION ACCESSIBILITY
   ============================================================ */
(function initA11y() {
  // Skip to main content on Tab
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close mobile menu on Escape
      const menu = document.getElementById('mobile-menu');
      const btn  = document.getElementById('hamburger');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        btn.focus();
      }
    }
  });
})();

/* ============================================================
   21. HERO CODE WINDOW — TYPING ANIMATION
   ============================================================ */
(function initCodeAnimation() {
  const codeEl = document.querySelector('.code-body code');
  if (!codeEl) return;

  // Add a subtle glow pulse to the code window
  const codeWindow = document.querySelector('.code-window');
  if (!codeWindow) return;

  let glowDir = 1;
  let glowVal = 0.15;

  function pulseGlow() {
    glowVal += 0.002 * glowDir;
    if (glowVal >= 0.3) glowDir = -1;
    if (glowVal <= 0.1) glowDir =  1;
    codeWindow.style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), 0 0 60px rgba(108,99,255,${glowVal})`;
    requestAnimationFrame(pulseGlow);
  }

  pulseGlow();
})();

/* ============================================================
   22. CONTACT CARD HOVER GLOW
   ============================================================ */
(function initContactGlow() {
  const cards = document.querySelectorAll('.contact-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(108,99,255,0.08) 0%, rgba(255,255,255,0.04) 60%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();

/* ============================================================
   23. PERFORMANCE — requestIdleCallback for non-critical tasks
   ============================================================ */
(function initIdleTasks() {
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));

  idle(() => {
    // Pre-warm font rendering
    document.fonts && document.fonts.ready.then(() => {
      document.body.classList.add('fonts-loaded');
    });
  });
})();

/* ============================================================
   24. INIT LOG
   ============================================================ */
console.log(
  '%c Sushant Mishra Portfolio %c v1.0.0 ',
  'background:#6C63FF;color:#fff;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:700',
  'background:#0F172A;color:#6C63FF;padding:4px 8px;border-radius:0 4px 4px 0;border:1px solid #6C63FF'
);
console.log('%c Built with ❤️ using pure HTML, CSS & JS', 'color:#94A3B8;font-size:12px');
