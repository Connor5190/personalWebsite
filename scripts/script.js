document.addEventListener('DOMContentLoaded', () => {

  // D3 selection refs — declared here so updateD3Colors() can safely reference
  // them before the D3 section runs (avoids TDZ crash when applyTheme() fires).
  let d3Dots = null, d3Lines = null;

  // ── Theme toggle ─────────────────────────────────────────────
  const html         = document.documentElement;
  const themeToggle  = document.getElementById('theme-toggle');
  const savedTheme   = localStorage.getItem('theme') || 'dark';

  function applyTheme(theme) {
    if (theme === 'light') {
      html.dataset.theme = 'light';
    } else {
      delete html.dataset.theme;
    }
    localStorage.setItem('theme', theme);
    updateD3Colors(theme);
    // If already scrolled past hero, update nav bg immediately on theme change.
    // Uses a local query to avoid TDZ on the outer `navbar` const.
    const nav = document.querySelector('.navbar');
    if (nav && nav.style.background) {
      nav.style.background = theme === 'light'
        ? 'rgba(245, 240, 232, 0.92)'
        : 'rgba(10, 10, 8, 0.92)';
      nav.style.borderBottom = theme === 'light'
        ? '1px solid rgba(208, 203, 195, 1)'
        : '1px solid rgba(37, 35, 32, 1)';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = (html.dataset.theme === 'light') ? 'dark' : 'light';
      applyTheme(next);
    });
  }

  applyTheme(savedTheme);

  // ── Smooth anchor scrolling ──────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ── Custom cursor ────────────────────────────────────────────
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');

  if (window.matchMedia('(pointer: fine)').matches && cursor && cursorRing) {
    let rx = 0, ry = 0; // ring position (lagged)
    let cx = 0, cy = 0; // cursor position

    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    });

    // Lagged ring
    (function animateRing() {
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    })();

    // Hover state on interactive elements
    document.querySelectorAll('a, button, .ff-card, .exp-row, .project-feature-image').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursorRing.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); cursorRing.classList.remove('hover'); });
    });
  }

  // ── Scroll progress bar ──────────────────────────────────────
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      progressBar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

  // ── Hero name clip-reveal ────────────────────────────────────
  const nameLines = document.querySelectorAll('.hero-name-line');
  nameLines.forEach((line, i) => {
    const delay = parseInt(line.dataset.delay || 0, 10);
    setTimeout(() => line.classList.add('revealed'), 200 + delay);
  });

  // ── Scroll-triggered fade-in ─────────────────────────────────
  const fadeTargets = [
    '.about-marker', '.about-lead', '.about-para', '.about-stack',
    '.exp-header', '.exp-row',
    '.projects-header', '.project-feature',
    '.ff-header', '.ff-card',
    '.contact-eyebrow', '.contact-headline', '.contact-email-btn', '.contact-links',
  ].join(', ');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(fadeTargets).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.65s ease ${(i % 4) * 0.07}s, transform 0.65s ease ${(i % 4) * 0.07}s`;
    io.observe(el);
  });

  // Apply in-view class
  const styleTag = document.createElement('style');
  styleTag.textContent = '.in-view { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(styleTag);

  // Stagger exp-rows specifically
  document.querySelectorAll('.exp-row').forEach((row, i) => {
    row.style.transitionDelay = `${i * 0.08}s`;
  });

  // ── D3 hero background — amber constellation ─────────────────
  function updateD3Colors(theme) {
    // dark: bright gold / light: deeper amber, slightly more opaque
    const nodeColor  = theme === 'light' ? '#9A5C06' : '#D4A843';
    const lineColor  = theme === 'light' ? '#9A5C06' : '#D4A843';
    const nodeOpacity = theme === 'light' ? 0.55 : 0.5;
    const lineOpacity = theme === 'light' ? 0.22 : 0.18;
    if (d3Dots)  d3Dots.style('fill', nodeColor).style('opacity', nodeOpacity);
    if (d3Lines) d3Lines.style('stroke', lineColor).style('stroke-opacity', lineOpacity);
  }

  const container = document.getElementById('d3-background');
  if (container) {
    const w = container.offsetWidth;
    const h = container.offsetHeight;

    const svg = d3.select('#d3-background').append('svg')
      .attr('width', w).attr('height', h);

    const nodes = d3.range(55).map(() => ({
      x:  Math.random() * w,
      y:  Math.random() * h,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      r:  Math.random() * 2.2 + 0.8,
    }));

    const links = [];
    nodes.forEach((a, i) => {
      nodes.slice(i + 1).forEach(b => {
        if (Math.random() < 0.07) links.push({ source: a, target: b });
      });
    });

    d3Lines = svg.selectAll('line').data(links).enter().append('line')
      .style('stroke', '#D4A843')
      .style('stroke-opacity', 0.18)
      .style('stroke-width', 0.8);

    d3Dots = svg.selectAll('circle').data(nodes).enter().append('circle')
      .attr('r', d => d.r)
      .style('fill', '#D4A843')
      .style('opacity', 0.5);

    // Apply current theme colors immediately
    updateD3Colors(localStorage.getItem('theme') || 'dark');

    (function tick() {
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));
      });
      d3Dots.attr('cx', d => d.x).attr('cy', d => d.y);
      d3Lines
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      requestAnimationFrame(tick);
    })();
  }

  // ── Fun facts 3D card tilt ───────────────────────────────────
  document.querySelectorAll('.ff-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const cx = r.width / 2, cy = r.height / 2;
      card.style.transform = `perspective(800px) rotateX(${(y - cy) / 16}deg) rotateY(${(cx - x) / 16}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // ── Navbar: glass bg + hide-on-down / reveal-on-up ──────────
  const navbar = document.querySelector('.navbar');
  const hero   = document.querySelector('.hero');

  let lastScrollY  = window.scrollY;
  let navRafPending = false;

  function handleNavScroll() {
    const y       = window.scrollY;
    const heroH   = hero ? hero.offsetHeight : window.innerHeight;
    const isLight = html.dataset.theme === 'light';

    // Glass background — kicks in after 60px
    if (y > 60) {
      navbar.style.background     = isLight ? 'rgba(245,240,232,0.93)' : 'rgba(10,10,8,0.93)';
      navbar.style.backdropFilter = 'blur(20px) saturate(1.4)';
      navbar.style.borderBottom   = isLight
        ? '1px solid rgba(208,203,195,0.6)'
        : '1px solid rgba(37,35,32,0.6)';
      navbar.classList.add('nav-scrolled');
    } else {
      navbar.style.background     = 'transparent';
      navbar.style.backdropFilter = '';
      navbar.style.borderBottom   = '';
      navbar.classList.remove('nav-scrolled');
    }

    // Hide on scroll-down, reveal on scroll-up — only past the hero
    if (y > heroH) {
      const delta = y - lastScrollY;
      if (delta > 6)       navbar.classList.add('nav-hidden');
      else if (delta < -4) navbar.classList.remove('nav-hidden');
    } else {
      navbar.classList.remove('nav-hidden');
    }

    lastScrollY   = y;
    navRafPending = false;
  }

  window.addEventListener('scroll', () => {
    if (!navRafPending) {
      navRafPending = true;
      requestAnimationFrame(handleNavScroll);
    }
  }, { passive: true });

  handleNavScroll();

  // ── Active nav link — highlights current section ─────────────
  const navLinks   = document.querySelectorAll('a.nav-link');
  const pageSections = document.querySelectorAll('section[id]');

  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(l => l.classList.remove('nav-link--active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('nav-link--active');
    });
  }, {
    rootMargin: '-25% 0px -65% 0px',
    threshold:  0,
  });

  pageSections.forEach(s => sectionObs.observe(s));

});
