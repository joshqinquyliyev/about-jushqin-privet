/**
 * Projects page logic
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('projects-container')) return;
  renderProjectsPage();
});

function renderProjectsPage() {
  const projects = getProjects();
  const container = document.getElementById('projects-container');
  const filtersEl = document.getElementById('category-filters');
  const searchInput = document.getElementById('project-search');

  // Build category filters
  const cats = ['all', ...new Set(projects.map(p => p.category))];
  filtersEl.innerHTML = cats.map(c => `
    <button class="filter-btn ${c === 'all' ? 'active' : ''}" data-cat="${c}">${c === 'all' ? (typeof t === 'function' ? t('all') : 'Hammasi') : c}</button>
  `).join('');

  let currentCat = 'all';
  let currentSearch = '';

  function filterAndRender() {
    let list = projects;
    if (currentCat !== 'all') list = list.filter(p => p.category === currentCat);
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.technologies || []).some(t => t.toLowerCase().includes(q))
      );
    }
    renderList(list);
  }

  filtersEl.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCat = btn.dataset.cat;
    filterAndRender();
  });

  searchInput.addEventListener('input', () => {
    currentSearch = searchInput.value.trim();
    filterAndRender();
  });

  function renderList(list) {
    if (!list.length) {
      container.innerHTML = '<p class="text-muted text-center" style="padding:60px 0">' + (typeof t === 'function' ? t('no_projects') : 'Loyiha topilmadi.') + '</p>';
      return;
    }
    // Featured first large, then grid
    const featured = list.filter(p => p.featured);
    const rest = list.filter(p => !p.featured);
    let html = '';

    if (featured.length) {
      const f = featured[0];
      html += `
        <article class="project-featured reveal" id="${f.slug}">
          <div class="pf-image">
            <img src="${f.image || createProjectPlaceholder(f.title)}" alt="${f.title}">
          </div>
          <div class="pf-content">
            <span class="project-cat">${f.category}</span>
            <h2 class="display-md">${f.title}</h2>
            <p class="text-muted">${f.description}</p>
            <div class="tech-tags">${(f.technologies || []).map(t => `<span>${t}</span>`).join('')}</div>
            <div class="pf-actions">
              ${f.liveUrl ? `<a href="${f.liveUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">${typeof t==='function'?t('visit'):'Saytga o\'tish'}</a>` : ''}
              <button class="btn btn-secondary btn-sm" data-id="${f.id}">${typeof t==='function'?t('details'):'Batafsil'}</button>
            </div>
          </div>
        </article>
      `;
      // remaining featured as medium
      featured.slice(1).forEach(p => {
        html += projectCard(p, 'medium');
      });
    }

    if (rest.length) {
      html += '<div class="projects-grid">';
      rest.forEach(p => { html += projectCard(p, 'normal'); });
      html += '</div>';
    }

    container.innerHTML = html;
    initReveal();

    container.querySelectorAll('[data-id]').forEach(btn => {
      btn.addEventListener('click', () => openProjectModal(btn.dataset.id));
    });
  }

  function projectCard(p, size) {
    return `
      <article class="project-item reveal ${size}" id="${p.slug}">
        <div class="pi-image">
          <img src="${p.image || createProjectPlaceholder(p.title)}" alt="${p.title}" loading="lazy">
        </div>
        <div class="pi-body">
          <span class="project-cat">${p.category}</span>
          <h3>${p.title}</h3>
          <p>${p.description.substring(0, 100)}...</p>
          <div class="tech-tags">${(p.technologies || []).map(t => `<span>${t}</span>`).join('')}</div>
          <div class="pi-actions">
            ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">${typeof t==='function'?t('visit'):'Saytga o\'tish'}</a>` : ''}
            <button class="btn btn-ghost btn-sm" data-id="${p.id}">${typeof t==='function'?t('details'):'Batafsil'}</button>
          </div>
        </div>
      </article>
    `;
  }

  filterAndRender();

  // Modal
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  modalClose.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('active'); });


  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.classList.remove('active');
  });

  window.openProjectModal = function(id) {
    const p = getProjects().find(x => x.id === id);
    if (!p) return;
    document.getElementById('modal-title').textContent = p.title;
    document.getElementById('modal-body').innerHTML = `
      <img src="${p.image || createProjectPlaceholder(p.title)}" alt="${p.title}" style="width:100%;border-radius:12px;margin-bottom:20px;aspect-ratio:16/9;object-fit:cover">
      <p class="text-muted mb-4">${p.details || p.description}</p>
      <p><strong>Category:</strong> ${p.category}</p>
      <p class="mt-2"><strong>Technologies:</strong> ${(p.technologies || []).join(', ')}</p>
      <div class="mt-6 flex gap-3">
        ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener" class="btn btn-primary">${typeof t==='function'?t('visit'):'Saytga o\'tish'}</a>` : ''}
        ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener" class="btn btn-secondary">GitHub</a>` : ''}
      </div>
    `;
    modal.classList.add('active');
  };
}

document.addEventListener('langchange', () => {
  if (document.getElementById('projects-container')) {
    // re-trigger by reloading filters
    const active = document.querySelector('.filter-btn.active');
    if (active) active.click();
    else renderProjectsPage();
  }
});
