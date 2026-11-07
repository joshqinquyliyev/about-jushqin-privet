/**
 * Admin Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  initSidebar();
  initThemeToggle();
  document.getElementById('logout-btn').addEventListener('click', logout);

  renderOverview();
  loadProfileForm();
  renderProjectsTable();
  renderSkillsTable();
  renderMessages();
  loadAppearanceForm();

  // Navigation
  document.querySelectorAll('.nav-item[data-section]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(item.dataset.section);
    });
  });

  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.goto));
  });

  // Profile form
  document.getElementById('profile-form').addEventListener('submit', saveProfile);
  document.getElementById('p-image-file')?.addEventListener('change', handleProfileImage);
  document.getElementById('p-resume-file')?.addEventListener('change', handleResumeFile);

  // Projects
  document.getElementById('add-project-btn').addEventListener('click', () => openProjectModal());
  document.getElementById('project-edit-form').addEventListener('submit', saveProject);

  // Close modals on overlay click
  ['project-edit-modal', 'skill-edit-modal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', (e) => { if (e.target === el) el.classList.remove('active'); });
  });

  document.getElementById('pe-close').addEventListener('click', () => closeModal('project-edit-modal'));

  // Skills
  document.getElementById('add-skill-btn').addEventListener('click', () => openSkillModal());
  document.getElementById('skill-edit-form').addEventListener('submit', saveSkill);
  document.getElementById('se-close').addEventListener('click', () => closeModal('skill-edit-modal'));

  // Appearance
  document.getElementById('appearance-form').addEventListener('submit', saveAppearance);

  // Reset

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
  });

  document.getElementById('reset-data-btn').addEventListener('click', () => {
    if (confirm('Reset all data to defaults? This cannot be undone.')) {
      localStorage.removeItem('jushqin_profile');
      localStorage.removeItem('jushqin_projects');
      localStorage.removeItem('jushqin_skills');
      localStorage.removeItem('jushqin_messages');
      localStorage.removeItem('jushqin_settings');
      initializeData();
      location.reload();
    }
  });
});

function showSection(id) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item[data-section]').forEach(n => n.classList.remove('active'));
  const section = document.getElementById('section-' + id);
  if (section) section.classList.add('active');
  const nav = document.querySelector(`.nav-item[data-section="${id}"]`);
  if (nav) nav.classList.add('active');
  if (id === 'overview') renderOverview();
  if (id === 'messages') renderMessages();
  if (id === 'projects') renderProjectsTable();
  if (id === 'skills') renderSkillsTable();
}

function initSidebar() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle) toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
}

function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    const settings = getSettings();
    settings.theme = next;
    saveData('settings', settings);
  });
  const settings = getSettings();
  document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
}

function renderOverview() {
  const projects = getProjects();
  const skills = getSkills();
  const messages = getMessages();
  const unread = messages.filter(m => !m.read).length;
  const profile = getProfile();
  const completion = Math.round(
    (['name', 'title', 'bio', 'email', 'intro'].filter(k => profile[k]).length / 5) * 100
  );

  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-card"><span class="stat-value">${projects.length}</span><span class="stat-label">Projects</span></div>
    <div class="stat-card"><span class="stat-value">${skills.length}</span><span class="stat-label">Skills</span></div>
    <div class="stat-card"><span class="stat-value">${messages.length}</span><span class="stat-label">Messages</span></div>
    <div class="stat-card"><span class="stat-value">${unread}</span><span class="stat-label">Unread</span></div>
    <div class="stat-card"><span class="stat-value">${completion}%</span><span class="stat-label">Profile</span></div>
  `;

  const recent = messages.slice(0, 5);
  document.getElementById('recent-messages').innerHTML = recent.length
    ? recent.map(m => `<div class="recent-msg ${m.read ? '' : 'unread'}"><strong>${m.name}</strong> — ${m.subject}<br><small>${new Date(m.createdAt).toLocaleString()}</small></div>`).join('')
    : '<p class="text-muted">No messages yet.</p>';
}

function loadProfileForm() {
  const p = getProfile();
  const map = {
    'p-name': 'name', 'p-title': 'title', 'p-heroHeadline': 'heroHeadline',
    'p-heroSubtitle': 'heroSubtitle', 'p-intro': 'intro', 'p-bio': 'bio',
    'p-story': 'story', 'p-journey': 'journey', 'p-goals': 'goals',
    'p-philosophy': 'philosophy', 'p-email': 'email', 'p-telegram': 'telegram',
    'p-instagram': 'instagram', 'p-github': 'github', 'p-location': 'location',
    'p-profileImage': 'profileImage'
  };
  Object.entries(map).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el) el.value = p[key] || '';
  });
  const prev = document.getElementById('p-image-preview');
  if (prev && p.profileImage) {
    prev.src = p.profileImage;
    prev.style.display = 'block';
  }
  const ru = document.getElementById('p-resumeUrl');
  if (ru) ru.value = p.resumeUrl || '';
  const rn = document.getElementById('p-resumeName');
  if (rn) rn.value = p.resumeName || '';
  const rs = document.getElementById('p-resume-status');
  if (rs) rs.textContent = p.resumeUrl ? ('Yuklangan: ' + (p.resumeName || 'resume')) : 'Resume hali yuklanmagan';
}

function saveProfile(e) {
  e.preventDefault();
  const p = getProfile();
  const fields = ['name', 'title', 'heroHeadline', 'heroSubtitle', 'intro', 'bio', 'story', 'journey', 'goals', 'philosophy', 'email', 'telegram', 'instagram', 'github', 'location', 'profileImage'];
  // resume
  const ru = document.getElementById('p-resumeUrl');
  const rn = document.getElementById('p-resumeName');
  if (ru) p.resumeUrl = ru.value.trim();
  if (rn) p.resumeName = rn.value.trim() || 'Quyliyev_Jushqin_Resume.pdf';
  fields.forEach(f => {
    const el = document.getElementById('p-' + f);
    if (el) p[f] = el.value.trim();
  });
  saveData('profile', p);
  showToast('Profile saved', 'success');
}

function handleProfileImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Faqat rasm fayli yuklang (JPG, PNG, WebP)', 'error');
    return;
  }
  // localStorage demo: ~800KB safe-ish limit
  if (file.size > 800 * 1024) {
    showToast('Rasm juda katta (maks ~800KB). Kichikroq rasm tanlang.', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById('p-profileImage').value = reader.result;
    const prev = document.getElementById('p-image-preview');
    if (prev) {
      prev.src = reader.result;
      prev.style.display = 'block';
    }
    showToast('Rasm tanlandi. Saqlash uchun Save Profile bosing.', 'info');
  };
  reader.onerror = () => showToast('Rasmni o\'qib bo\'lmadi', 'error');
  reader.readAsDataURL(file);
}

function renderProjectsTable() {
  const tbody = document.querySelector('#projects-table tbody');
  const projects = getProjects();
  tbody.innerHTML = projects.map(p => `
    <tr>
      <td><strong>${p.title}</strong></td>
      <td>${p.category}</td>
      <td>${p.featured ? '★' : '—'}</td>
      <td class="actions-cell">
        <button class="btn btn-ghost btn-sm" onclick="openProjectModal('${p.id}')">Edit</button>
        <button class="btn btn-ghost btn-sm" onclick="deleteProject('${p.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function openProjectModal(id) {
  const modal = document.getElementById('project-edit-modal');
  const form = document.getElementById('project-edit-form');
  if (id) {
    const p = getProjects().find(x => x.id === id);
    if (!p) return;
    document.getElementById('pe-title').textContent = 'Edit Project';
    document.getElementById('pe-id').value = p.id;
    document.getElementById('pe-name').value = p.title;
    document.getElementById('pe-desc').value = p.description;
    document.getElementById('pe-details').value = p.details || '';
    document.getElementById('pe-cat').value = p.category;
    document.getElementById('pe-order').value = p.order || 0;
    document.getElementById('pe-tech').value = (p.technologies || []).join(', ');
    document.getElementById('pe-live').value = p.liveUrl || '';
    document.getElementById('pe-github').value = p.githubUrl || '';
    document.getElementById('pe-image').value = p.image || '';
    document.getElementById('pe-featured').checked = !!p.featured;
  } else {
    document.getElementById('pe-title').textContent = 'Add Project';
    form.reset();
    document.getElementById('pe-id').value = '';
  }
  modal.classList.add('active');
}

function saveProject(e) {
  e.preventDefault();
  const id = document.getElementById('pe-id').value;
  let projects = getProjects();
  const data = {
    title: document.getElementById('pe-name').value.trim(),
    description: document.getElementById('pe-desc').value.trim(),
    details: document.getElementById('pe-details').value.trim(),
    category: document.getElementById('pe-cat').value.trim() || 'Other',
    order: parseInt(document.getElementById('pe-order').value) || 0,
    technologies: document.getElementById('pe-tech').value.split(',').map(t => t.trim()).filter(Boolean),
    liveUrl: document.getElementById('pe-live').value.trim(),
    githubUrl: document.getElementById('pe-github').value.trim(),
    image: document.getElementById('pe-image').value.trim(),
    featured: document.getElementById('pe-featured').checked,
    slug: document.getElementById('pe-name').value.trim().toLowerCase().replace(/\s+/g, '-')
  };

  if (id) {
    projects = projects.map(p => p.id === id ? { ...p, ...data } : p);
  } else {
    projects.push({
      id: generateId('proj'),
      ...data,
      createdAt: new Date().toISOString()
    });
  }
  saveData('projects', projects);
  closeModal('project-edit-modal');
  renderProjectsTable();
  showToast('Project saved', 'success');
}

function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  const projects = getProjects().filter(p => p.id !== id);
  saveData('projects', projects);
  renderProjectsTable();
  showToast('Project deleted', 'info');
}

function renderSkillsTable() {
  const tbody = document.querySelector('#skills-table tbody');
  const skills = getSkills();
  tbody.innerHTML = skills.map(s => `
    <tr>
      <td><strong>${s.name}</strong></td>
      <td>${s.category}</td>
      <td>${s.level}%</td>
      <td class="actions-cell">
        <button class="btn btn-ghost btn-sm" onclick="openSkillModal('${s.id}')">Edit</button>
        <button class="btn btn-ghost btn-sm" onclick="deleteSkill('${s.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function openSkillModal(id) {
  const modal = document.getElementById('skill-edit-modal');
  if (id) {
    const s = getSkills().find(x => x.id === id);
    if (!s) return;
    document.getElementById('se-title').textContent = 'Edit Skill';
    document.getElementById('se-id').value = s.id;
    document.getElementById('se-name').value = s.name;
    document.getElementById('se-cat').value = s.category;
    document.getElementById('se-level').value = s.level;
    document.getElementById('se-desc').value = s.description || '';
  } else {
    document.getElementById('se-title').textContent = 'Add Skill';
    document.getElementById('skill-edit-form').reset();
    document.getElementById('se-id').value = '';
  }
  modal.classList.add('active');
}

function saveSkill(e) {
  e.preventDefault();
  const id = document.getElementById('se-id').value;
  let skills = getSkills();
  const data = {
    name: document.getElementById('se-name').value.trim(),
    category: document.getElementById('se-cat').value.trim() || 'Core',
    level: Math.min(100, Math.max(0, parseInt(document.getElementById('se-level').value) || 0)),
    description: document.getElementById('se-desc').value.trim()
  };
  if (id) {
    skills = skills.map(s => s.id === id ? { ...s, ...data } : s);
  } else {
    skills.push({ id: generateId('skill'), ...data, order: skills.length + 1 });
  }
  saveData('skills', skills);
  closeModal('skill-edit-modal');
  renderSkillsTable();
  showToast('Skill saved', 'success');
}

function deleteSkill(id) {
  if (!confirm('Delete this skill?')) return;
  saveData('skills', getSkills().filter(s => s.id !== id));
  renderSkillsTable();
  showToast('Skill deleted', 'info');
}

function renderMessages() {
  const list = document.getElementById('messages-list');
  const messages = getMessages();
  if (!messages.length) {
    list.innerHTML = '<p class="text-muted">No messages yet. Messages from the contact form will appear here.</p>';
    return;
  }
  list.innerHTML = messages.map(m => `
    <div class="message-card ${m.read ? '' : 'unread'}">
      <div class="msg-header">
        <strong>${m.name}</strong> &lt;${m.email}&gt;
        <span class="msg-date">${new Date(m.createdAt).toLocaleString()}</span>
      </div>
      <div class="msg-subject">${m.subject}</div>
      <div class="msg-body">${m.message}</div>
      <div class="msg-actions">
        ${!m.read ? `<button class="btn btn-ghost btn-sm" onclick="markRead('${m.id}')">Mark Read</button>` : ''}
        <button class="btn btn-ghost btn-sm" onclick="deleteMessage('${m.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function markRead(id) {
  const messages = getMessages().map(m => m.id === id ? { ...m, read: true } : m);
  saveData('messages', messages);
  renderMessages();
  renderOverview();
}

function deleteMessage(id) {
  if (!confirm('Delete this message?')) return;
  saveData('messages', getMessages().filter(m => m.id !== id));
  renderMessages();
  renderOverview();
  showToast('Message deleted', 'info');
}

function loadAppearanceForm() {
  const s = getSettings();
  document.getElementById('s-siteTitle').value = s.siteTitle || '';
  document.getElementById('s-accentPrimary').value = s.accentPrimary || '#7C3AED';
  document.getElementById('s-accentSecondary').value = s.accentSecondary || '#22D3EE';
  document.getElementById('s-theme').value = s.theme || 'dark';
}

function saveAppearance(e) {
  e.preventDefault();
  const s = getSettings();
  s.siteTitle = document.getElementById('s-siteTitle').value.trim();
  s.accentPrimary = document.getElementById('s-accentPrimary').value;
  s.accentSecondary = document.getElementById('s-accentSecondary').value;
  s.theme = document.getElementById('s-theme').value;
  saveData('settings', s);
  document.documentElement.setAttribute('data-theme', s.theme);
  document.documentElement.style.setProperty('--accent-primary', s.accentPrimary);
  document.documentElement.style.setProperty('--accent-secondary', s.accentSecondary);
  showToast('Appearance saved', 'success');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

function showToast(msg, type) {
  let c = document.querySelector('.toast-container');
  if (!c) {
    c = document.createElement('div');
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// Expose for inline handlers
window.openProjectModal = openProjectModal;
window.deleteProject = deleteProject;
window.openSkillModal = openSkillModal;
window.deleteSkill = deleteSkill;
window.markRead = markRead;
window.deleteMessage = deleteMessage;


function handleResumeFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 1.5 * 1024 * 1024) {
    showToast('Resume juda katta (max ~1.5MB)', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const ru = document.getElementById('p-resumeUrl');
    const rn = document.getElementById('p-resumeName');
    const rs = document.getElementById('p-resume-status');
    if (ru) ru.value = reader.result;
    if (rn) rn.value = file.name;
    if (rs) rs.textContent = 'Tanlandi: ' + file.name + ' — Save Profile bosing';
    showToast('Resume tanlandi. Save Profile bosing.', 'info');
  };
  reader.readAsDataURL(file);
}
