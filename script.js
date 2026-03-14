/* ============================================================
   SAMBHAV PORTFOLIO — script.js
   Animations: Matrix Rain · Cursor Trail · Glitch · Typewriter
               Tilt Cards · Magnetic Buttons · Scroll Reveals
               Counters · Terminal · Ripple · Form
   ============================================================ */

'use strict';

/* ════════════════════════════════════════
   0. CONSTANTS
════════════════════════════════════════ */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const CYAN    = '#00f5c4';
const GREEN   = '#39ff14';
const SURFACE = '#0c1120';


/* ════════════════════════════════════════
   1. LOADER
════════════════════════════════════════ */
(function initLoader() {
  const loader  = $('#loader');
  const bar     = $('#loader-bar');
  const lines   = ['#l1','#l2','#l3','#l4'].map(id => $(id));
  const canvas  = $('#loader-canvas');
  const ctx     = canvas.getContext('2d');

  // Loader canvas - fast matrix
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 14);
  const drops = Array(cols).fill(1);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,./<>?';

  function drawLoaderMatrix() {
    ctx.fillStyle = 'rgba(3,5,8,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = CYAN;
    ctx.font = '12px "Share Tech Mono"';
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 14, y * 14);
      if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }
  const loaderInterval = setInterval(drawLoaderMatrix, 30);

  // Progress bar + line reveals
  let progress = 0;
  const barInterval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 3, 100);
    bar.style.width = progress + '%';
    if (progress >= 100) clearInterval(barInterval);
  }, 50);

  // Show lines sequentially
  const delays = [200, 700, 1200, 1700];
  lines.forEach((line, i) => {
    setTimeout(() => line && line.classList.add('show'), delays[i]);
  });

  // Hide loader
  setTimeout(() => {
    clearInterval(loaderInterval);
    loader.classList.add('hide');
    document.body.style.overflow = '';
    initAll();
  }, 2600);

  document.body.style.overflow = 'hidden';
})();


/* ════════════════════════════════════════
   2. INIT ALL (after loader)
════════════════════════════════════════ */
function initAll() {
  initMatrixRain();
  initCursor();
  initCursorTrail();
  initNav();
  initTypewriter();
  initScrollReveal();
  initMagnetic();
  initTiltCards();
  initSkillBars();
  initCounters();
  initForm();
  initRipple();
}


/* ════════════════════════════════════════
   3. MATRIX RAIN (background)
════════════════════════════════════════ */
function initMatrixRain() {
  const canvas = $('#matrix-canvas');
  const ctx    = canvas.getContext('2d');

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const FONT_SIZE = 13;
  const chars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%';

  let cols = Math.floor(canvas.width / FONT_SIZE);
  let drops = Array(cols).fill(1);

  window.addEventListener('resize', () => {
    cols  = Math.floor(canvas.width / FONT_SIZE);
    drops = Array(cols).fill(1);
  }, { passive: true });

  let frame = 0;
  function drawMatrix() {
    frame++;
    if (frame % 2 !== 0) { requestAnimationFrame(drawMatrix); return; } // 30fps

    ctx.fillStyle = 'rgba(3,5,8,0.055)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const alpha = Math.random() > 0.5 ? 1 : 0.3;

      // Top of column is brighter
      ctx.fillStyle = y === 1 ? '#ffffff' : `rgba(0,245,196,${alpha})`;
      ctx.font = `${FONT_SIZE}px "Share Tech Mono"`;
      ctx.fillText(char, i * FONT_SIZE, y * FONT_SIZE);

      if (y * FONT_SIZE > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });

    requestAnimationFrame(drawMatrix);
  }
  requestAnimationFrame(drawMatrix);
}


/* ════════════════════════════════════════
   4. CUSTOM CURSOR
════════════════════════════════════════ */
function initCursor() {
  const dot  = $('#cursor-dot');
  const ring = $('#cursor-ring');

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Smooth ring follow
  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover state on clickables
  const interactives = 'a,button,.magnetic,.project-card,.social-link,.contact-item,.skill-panel,.stat-card,.tag,.tool-chip,.soft-tag';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) document.body.classList.remove('cursor-hover');
  });
}


/* ════════════════════════════════════════
   5. CURSOR TRAIL (particle)
════════════════════════════════════════ */
function initCursorTrail() {
  const canvas = $('#cursor-trail');
  const ctx    = canvas.getContext('2d');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }, { passive: true });

  const particles = [];
  let mx = -100, my = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  class Particle {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 6;
      this.y = y + (Math.random() - 0.5) * 6;
      this.size  = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.speedY = (Math.random() - 0.5) * 1.5 - 0.5;
      this.life  = 1;
      this.decay = Math.random() * 0.04 + 0.02;
      this.hue   = Math.random() > 0.3 ? CYAN : GREEN;
    }
    update() {
      this.x    += this.speedX;
      this.y    += this.speedY;
      this.life -= this.decay;
      this.size *= 0.97;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life * 0.6;
      ctx.fillStyle   = this.hue;
      ctx.shadowColor = this.hue;
      ctx.shadowBlur  = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let spawnFrame = 0;
  function animateTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    spawnFrame++;

    if (spawnFrame % 2 === 0) {
      particles.push(new Particle(mx, my));
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0) particles.splice(i, 1);
    }

    requestAnimationFrame(animateTrail);
  }
  requestAnimationFrame(animateTrail);
}


/* ════════════════════════════════════════
   6. NAVBAR
════════════════════════════════════════ */
function initNav() {
  const navbar  = $('#navbar');
  const burger  = $('#hamburger');
  const mobileM = $('#mobile-menu');

  // Scroll → add class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  // Hamburger
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileM.classList.toggle('open');
  });

  // Close mobile menu on link click
  $$('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileM.classList.remove('open');
    });
  });

  // Active nav link on scroll
  const sections = $$('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = $(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          $$('.nav-link').forEach(l => l.style.color = '');
          link.style.color = 'var(--cyan)';
        }
      }
    });
  }, { passive: true });
}


/* ════════════════════════════════════════
   7. TYPEWRITER
════════════════════════════════════════ */
function initTypewriter() {
  const el = $('#typewriter-text');
  if (!el) return;

  const phrases = [
    'CS Student @ PDEU',
    'Cybersecurity Enthusiast',
    'Web Developer',
    'Hackathon Participant',
    'Problem Solver',
    'Open Source Learner',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let deleting    = false;
  let paused      = false;

  function type() {
    if (paused) return;
    const current = phrases[phraseIndex];

    if (deleting) {
      el.textContent = current.slice(0, charIndex--);
      if (charIndex < 0) {
        deleting    = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex   = 0;
        setTimeout(type, 500);
        return;
      }
      setTimeout(type, 45);
    } else {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 80 + Math.random() * 40);
    }
  }

  setTimeout(type, 2200);
}


/* ════════════════════════════════════════
   8. SCROLL REVEAL
════════════════════════════════════════ */
function initScrollReveal() {
  const elements = $$('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}


/* ════════════════════════════════════════
   9. MAGNETIC BUTTONS
════════════════════════════════════════ */
function initMagnetic() {
  const magnetics = $$('.magnetic');

  magnetics.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect    = el.getBoundingClientRect();
      const cx      = rect.left + rect.width  / 2;
      const cy      = rect.top  + rect.height / 2;
      const dx      = e.clientX - cx;
      const dy      = e.clientY - cy;
      const strength = 0.35;

      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  });
}


/* ════════════════════════════════════════
   10. TILT CARDS (3D)
════════════════════════════════════════ */
function initTiltCards() {
  const cards = $$('.tilt-card');

  cards.forEach(card => {
    const inner = card.querySelector('.project-card-inner');
    if (!inner) return;

    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotY   = ((x - cx) / cx) * 10;
      const rotX   = -((y - cy) / cy) * 10;

      inner.style.transform    = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
      inner.style.transition   = 'transform 0.05s ease';
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      inner.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
    });
  });
}


/* ════════════════════════════════════════
   11. SKILL BARS
════════════════════════════════════════ */
function initSkillBars() {
  const fills = $$('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.dataset.width;
        setTimeout(() => {
          fill.style.width = width + '%';
          fill.classList.add('animated');
        }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
}


/* ════════════════════════════════════════
   12. COUNTERS
════════════════════════════════════════ */
function initCounters() {
  const counters = $$('.counter');

  const easeOut = t => 1 - Math.pow(1 - t, 4);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target);
        const dur    = 1600;
        const start  = performance.now();

        function tick(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / dur, 1);
          el.textContent = Math.round(easeOut(progress) * target);
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}


/* ════════════════════════════════════════
   13. CONTACT FORM
════════════════════════════════════════ */
function initForm() {
  const form    = $('#contact-form');
  const success = $('#form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name  = $('#name').value.trim();
    const email = $('#email').value.trim();
    const msg   = $('#message').value.trim();

    if (!name || !email || !msg) return;

    // Simulate send (replace with real API call)
    const btn = form.querySelector('.btn-submit');
    btn.querySelector('.btn-text').textContent = 'SENDING...';
    btn.disabled = true;

    setTimeout(() => {
      btn.querySelector('.btn-text').textContent = 'SENT ✓';
      success.classList.add('show');
      form.reset();
      setTimeout(() => {
        btn.querySelector('.btn-text').textContent = 'SEND MESSAGE';
        btn.disabled = false;
        success.classList.remove('show');
      }, 4000);
    }, 1500);
  });
}


/* ════════════════════════════════════════
   14. RIPPLE EFFECT
════════════════════════════════════════ */
function initRipple() {
  const targets = $$('.btn-primary, .btn-secondary, .contact-item');

  targets.forEach(el => {
    el.style.overflow = 'hidden';
    el.style.position = el.style.position || 'relative';

    el.addEventListener('click', e => {
      const rect = el.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `
        width:${size}px;
        height:${size}px;
        left:${x - size/2}px;
        top:${y - size/2}px;
      `;
      el.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}


/* ════════════════════════════════════════
   15. RANDOM GLITCH TRIGGER
════════════════════════════════════════ */
(function randomGlitch() {
  const glitchables = $$('.glitch, .glitch-small, .section-title');

  setInterval(() => {
    const el = glitchables[Math.floor(Math.random() * glitchables.length)];
    if (!el) return;
    el.style.animation = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.animation = '';
      });
    });
  }, 4000);
})();


/* ════════════════════════════════════════
   16. TERMINAL BODY EXTRA ANIM
════════════════════════════════════════ */
(function terminalFlicker() {
  const terminal = $('.terminal-body');
  if (!terminal) return;

  setInterval(() => {
    if (Math.random() > 0.85) {
      terminal.style.opacity = '0.85';
      setTimeout(() => { terminal.style.opacity = '1'; }, 80);
    }
  }, 3000);
})();


/* ════════════════════════════════════════
   17. PARALLAX HERO ELEMENTS
════════════════════════════════════════ */
(function initParallax() {
  const hero = $('#hero');
  if (!hero) return;

  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    const overlay = $('.hero-grid-overlay');
    const badges  = $$('.badge');

    if (overlay) {
      overlay.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
    }
    badges.forEach((badge, i) => {
      const depth = (i + 1) * 5;
      badge.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  });
})();


/* ════════════════════════════════════════
   18. SECTION GLOW on SCROLL
════════════════════════════════════════ */
(function sectionGlow() {
  const panels = $$('.skill-panel, .project-card-inner, .stat-card');

  window.addEventListener('scroll', () => {
    const centerY = window.innerHeight / 2 + window.scrollY;

    panels.forEach(panel => {
      const rect     = panel.getBoundingClientRect();
      const panelCY  = rect.top + rect.height / 2 + window.scrollY;
      const distance = Math.abs(centerY - panelCY);
      const maxDist  = window.innerHeight;
      const glow     = Math.max(0, 1 - distance / maxDist);

      panel.style.boxShadow = glow > 0.7
        ? `0 0 ${glow * 25}px rgba(0,245,196,${glow * 0.06}), 0 15px 40px rgba(0,0,0,0.4)`
        : '';
    });
  }, { passive: true });
})();


/* ════════════════════════════════════════
   19. PAGE VISIBILITY — PAUSE ANIMATIONS
════════════════════════════════════════ */
document.addEventListener('visibilitychange', () => {
  document.body.style.animationPlayState =
    document.hidden ? 'paused' : 'running';
});


/* ════════════════════════════════════════
   20. KEYBOARD NAV EASTER EGG
════════════════════════════════════════ */
(function konamiCode() {
  const code = [38,38,40,40,37,39,37,39,66,65];
  let idx = 0;

  document.addEventListener('keydown', e => {
    if (e.keyCode === code[idx]) {
      idx++;
      if (idx === code.length) {
        idx = 0;
        // Easter egg: rainbow glitch for 3s
        document.body.style.filter = 'hue-rotate(0deg)';
        let deg = 0;
        const interval = setInterval(() => {
          deg += 5;
          document.body.style.filter = `hue-rotate(${deg}deg)`;
          if (deg >= 360) {
            clearInterval(interval);
            document.body.style.filter = '';
          }
        }, 16);
      }
    } else {
      idx = 0;
    }
  });
})();


/* ════════════════════════════════════════
   21. SMOOTH ANCHOR SCROLL
════════════════════════════════════════ */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const target = $(link.getAttribute('href'));
  if (target) {
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  }
});


/* ════════════════════════════════════════
   22. WINDOW RESIZE DEBOUNCE
════════════════════════════════════════ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Re-init magnetic on resize (rect changes)
    initMagnetic();
  }, 250);
}, { passive: true });


/* ════════════════════════════════════════
   23. FOOTER YEAR
════════════════════════════════════════ */
(function setYear() {
  const copy = $('.footer-copy');
  if (copy) copy.innerHTML = copy.innerHTML.replace('2025', new Date().getFullYear());
})();


/* ════════════════════════════════════════
   24. CONSOLE SIGNATURE
════════════════════════════════════════ */
console.log(`%c
 ███████╗ █████╗ ███╗   ███╗██████╗ ██╗  ██╗ █████╗ ██╗   ██╗
 ██╔════╝██╔══██╗████╗ ████║██╔══██╗██║  ██║██╔══██╗██║   ██║
 ███████╗███████║██╔████╔██║██████╔╝███████║███████║██║   ██║
 ╚════██║██╔══██║██║╚██╔╝██║██╔══██╗██╔══██║██╔══██║╚██╗ ██╔╝
 ███████║██║  ██║██║ ╚═╝ ██║██████╔╝██║  ██║██║  ██║ ╚████╔╝ 
 ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝ 
`, 'color: #00f5c4; font-family: monospace;');
console.log('%c👾 Portfolio by Sambhav | CS Student @ PDEU', 'color: #39ff14; font-size: 14px;');
console.log('%c💡 Try the Konami Code: ↑↑↓↓←→←→BA', 'color: #4a5878; font-size: 12px;');