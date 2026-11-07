document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;
  const skills = getSkills();
  grid.innerHTML = skills.map(s => `
    <article class="skill-card reveal">
      <div class="skill-header">
        <h3>${s.name}</h3>
        <span class="skill-cat">${s.category}</span>
      </div>
      <p class="text-muted skill-desc">${s.description || ''}</p>
      <div class="skill-visual">
        <div class="skill-ring" style="--level: ${s.level}">
          <svg viewBox="0 0 100 100">
            <circle class="ring-bg" cx="50" cy="50" r="42"/>
            <circle class="ring-fill" cx="50" cy="50" r="42" style="stroke-dashoffset: ${264 - (264 * s.level / 100)}"/>
          </svg>
          <span class="skill-pct">${s.level}%</span>
        </div>
      </div>
    </article>
  `).join('');
  initReveal();
});
