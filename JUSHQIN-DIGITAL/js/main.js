/**
 * JUSHQIN DIGITAL — Shared Public Scripts
 */


function initThemeToggle() {
  const btn = document.querySelector('.theme-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      const s = getSettings();
      s.theme = next;
      saveData('settings', s);
    } catch(e) {}
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initScrollProgress();
  initReveal();
  initThemeFromSettings();
  initThemeToggle();
  renderProfileData();
  renderFooterSocials();
});

function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
  }, { passive: true });
}

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

function initThemeFromSettings() {
  const settings = getSettings();
  document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
  if (settings.accentPrimary) {
    document.documentElement.style.setProperty('--accent-primary', settings.accentPrimary);
  }
  if (settings.accentSecondary) {
    document.documentElement.style.setProperty('--accent-secondary', settings.accentSecondary);
  }
}

function renderProfileData() {
  const profile = getProfile();
  const tr = (key, fallback) => (typeof t === 'function' ? t(key) : fallback);
  document.querySelectorAll('[data-profile="name"]').forEach(el => el.textContent = tr('p_name', profile.name));
  document.querySelectorAll('[data-profile="title"]').forEach(el => el.textContent = tr('p_title', profile.title));
  document.querySelectorAll('[data-profile="intro"]').forEach(el => el.textContent = tr('p_intro', profile.intro));
  document.querySelectorAll('[data-profile="bio"]').forEach(el => el.textContent = tr('p_bio', profile.bio));
  document.querySelectorAll('[data-profile="story"]').forEach(el => el.textContent = tr('p_story', profile.story));
  document.querySelectorAll('[data-profile="journey"]').forEach(el => el.textContent = tr('p_journey', profile.journey));
  document.querySelectorAll('[data-profile="goals"]').forEach(el => el.textContent = tr('p_goals', profile.goals));
  document.querySelectorAll('[data-profile="philosophy"]').forEach(el => el.textContent = tr('p_philosophy', profile.philosophy));
  document.querySelectorAll('[data-profile="heroHeadline"]').forEach(el => el.textContent = tr('p_heroHeadline', profile.heroHeadline));
  document.querySelectorAll('[data-profile="heroSubtitle"]').forEach(el => el.textContent = tr('p_heroSubtitle', profile.heroSubtitle));
  document.querySelectorAll('[data-profile="email"]').forEach(el => {
    el.textContent = profile.email;
    if (el.tagName === 'A') el.href = 'mailto:' + profile.email;
  });
  document.querySelectorAll('[data-profile="telegram"]').forEach(el => {
    if (!el.textContent.trim()) el.textContent = profile.telegram;
    if (el.tagName === 'A') el.href = 'https://t.me/' + (profile.telegram || '').replace('@', '');
  });
  document.querySelectorAll('[data-profile="instagram"]').forEach(el => {
    if (!el.textContent.trim()) el.textContent = profile.instagram;
    if (el.tagName === 'A') el.href = 'https://instagram.com/' + (profile.instagram || '').replace('@', '');
  });
  document.querySelectorAll('[data-profile="github"]').forEach(el => {
    if (el.tagName === 'A') el.href = profile.github || '#';
  });
  document.querySelectorAll('[data-profile="location"]').forEach(el => el.textContent = profile.location || '');

  const imgEls = document.querySelectorAll('[data-profile="image"]');
  imgEls.forEach(img => {
    img.alt = profile.name || 'Quyliyev Jushqin';
    img.style.objectFit = 'cover';
    if (profile.profileImage) {
      img.src = profile.profileImage;
      img.onerror = () => { img.src = createPlaceholderAvatar(profile.name); };
    } else {
      img.src = createPlaceholderAvatar(profile.name);
    }
  });
}

function renderFooterSocials() {
  const profile = getProfile();
  const container = document.querySelector('.footer-socials');
  if (!container) return;
  container.innerHTML = `
    <a href="${profile.github || '#'}" target="_blank" rel="noopener" aria-label="GitHub">GitHub</a>
    <a href="https://t.me/${(profile.telegram || '').replace('@', '')}" target="_blank" rel="noopener" aria-label="Telegram">Telegram</a>
    <a href="https://instagram.com/${(profile.instagram || '').replace('@', '')}" target="_blank" rel="noopener" aria-label="Instagram">Instagram</a>
  `;
}

function createPlaceholderAvatar(name) {
  const initial = (name || 'J').charAt(0).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00ff9d"/><stop offset="100%" stop-color="#00e5ff"/>
    </linearGradient></defs>
    <rect width="400" height="400" fill="#0a1210"/>
    <circle cx="200" cy="200" r="120" fill="url(#g)"/>
    <text x="200" y="220" text-anchor="middle" fill="white" font-family="Syne,sans-serif" font-size="120" font-weight="800">${initial}</text>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(svg);
}

function createProjectPlaceholder(title, color1 = '#7C3AED', color2 = '#22D3EE') {
  const t = (title || 'Project').substring(0, 18);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <defs><linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color1}"/><stop offset="100%" stop-color="${color2}"/>
    </linearGradient></defs>
    <rect width="800" height="500" fill="#0a1210"/>
    <rect x="40" y="40" width="720" height="420" rx="16" fill="url(#pg)" opacity="0.25"/>
    <text x="400" y="260" text-anchor="middle" fill="#F8FAFC" font-family="Syne,sans-serif" font-size="36" font-weight="700">${t}</text>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
  });
}

document.addEventListener('DOMContentLoaded', setActiveNav);

document.addEventListener('langchange', () => {
  if (typeof renderProfileData === 'function') renderProfileData();
});


function buildFullResumeText() {
  const p = getProfile();
  const skills = (typeof getSkills === 'function' ? getSkills() : []);
  const projects = (typeof getProjects === 'function' ? getProjects() : []);
  const lines = [];
  lines.push('═══════════════════════════════════════');
  lines.push('              RESUME / CV');
  lines.push('═══════════════════════════════════════');
  lines.push('');
  lines.push((p.name || 'Quyliyev Jushqin').toUpperCase());
  lines.push(p.title || 'Frontend Developer');
  lines.push('');
  lines.push('───────────────────────────────────────');
  lines.push('ALOQA / CONTACT');
  lines.push('───────────────────────────────────────');
  if (p.email) lines.push('Email:     ' + p.email);
  if (p.telegram) lines.push('Telegram:  https://t.me/' + String(p.telegram).replace('@',''));
  if (p.instagram) lines.push('Instagram: https://instagram.com/' + String(p.instagram).replace('@',''));
  if (p.github) lines.push('GitHub:    ' + p.github);
  if (p.location) lines.push('Manzil:    ' + p.location);
  lines.push('');
  lines.push('───────────────────────────────────────');
  lines.push('KIRISH / INTRO');
  lines.push('───────────────────────────────────────');
  lines.push(p.intro || '');
  lines.push('');
  lines.push('───────────────────────────────────────');
  lines.push('BIO');
  lines.push('───────────────────────────────────────');
  lines.push(p.bio || '');
  lines.push('');
  if (p.story) { lines.push('───────────────────────────────────────'); lines.push('HIKOYA / STORY'); lines.push('───────────────────────────────────────'); lines.push(p.story); lines.push(''); }
  if (p.journey) { lines.push('───────────────────────────────────────'); lines.push("YO'L / JOURNEY"); lines.push('───────────────────────────────────────'); lines.push(p.journey); lines.push(''); }
  if (p.goals) { lines.push('───────────────────────────────────────'); lines.push('MAQSADLAR / GOALS'); lines.push('───────────────────────────────────────'); lines.push(p.goals); lines.push(''); }
  if (p.philosophy) { lines.push('───────────────────────────────────────'); lines.push('FALSAFA / PHILOSOPHY'); lines.push('───────────────────────────────────────'); lines.push(p.philosophy); lines.push(''); }
  if (p.interests && p.interests.length) { lines.push('───────────────────────────────────────'); lines.push('QIZIQISHLAR / INTERESTS'); lines.push('───────────────────────────────────────'); lines.push(p.interests.join(', ')); lines.push(''); }
  if (skills.length) {
    lines.push('───────────────────────────────────────');
    lines.push("KO'NIKMALAR / SKILLS");
    lines.push('───────────────────────────────────────');
    skills.forEach(s => lines.push('• ' + s.name + (s.level != null ? ' — ' + s.level + '%' : '') + (s.description ? '  |  ' + s.description : '')));
    lines.push('');
  }
  if (projects.length) {
    lines.push('───────────────────────────────────────');
    lines.push('LOYIHALAR / PROJECTS');
    lines.push('───────────────────────────────────────');
    projects.forEach((pr, i) => {
      lines.push((i + 1) + '. ' + pr.title + (pr.category ? ' (' + pr.category + ')' : ''));
      if (pr.description) lines.push('   ' + pr.description);
      if (pr.technologies && pr.technologies.length) lines.push('   Tech: ' + pr.technologies.join(', '));
      if (pr.liveUrl) lines.push('   URL:  ' + pr.liveUrl);
      lines.push('');
    });
  }
  lines.push('═══════════════════════════════════════');
  lines.push('JUSHQIN DIGITAL  •  ' + new Date().toLocaleDateString());
  lines.push('═══════════════════════════════════════');
  return lines.join('\n');
}

function downloadFullResume(e) {
  if (e) e.preventDefault();
  const p = getProfile();
  if (p.resumeUrl && p.resumeUrl.startsWith('http')) {
    window.open(p.resumeUrl, '_blank');
    return;
  }
  if (p.resumeUrl && p.resumeUrl.startsWith('data:')) {
    const a = document.createElement('a');
    a.href = p.resumeUrl;
    a.download = p.resumeName || 'Quyliyev_Jushqin_Resume.pdf';
    a.click();
    return;
  }
  const text = buildFullResumeText();
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Quyliyev_Jushqin_Resume.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-i18n="resume_download"], #resume-download-btn').forEach(el => {
    el.addEventListener('click', downloadFullResume);
    if (el.tagName === 'A') el.removeAttribute('href');
    el.style.cursor = 'pointer';
  });
});
