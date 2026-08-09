/* ==========================================================================
   MEHAVANNAN DILUSHAN - PORTFOLIO INTERACTIVITY & GITHUB ENGINE
   ========================================================================== */

const GITHUB_USER = 'Dilushan-Mehavannan';
const FORMSPREE_URL = 'https://formspree.io/f/mojolrbo';

let allRepos = [];

// Language color mapping
const langColors = {
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  TypeScript: '#2b7489',
  Java: '#b07219',
  C: '#555555',
  Shell: '#89e051',
  default: '#6366f1'
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initSpotlights();
  initSkillsFilter();
  initProjectControls();
  
  loadGitHubData();
});

/* --------------------------------------------------------------------------
   1. CUSTOM CURSOR ENGINE
   -------------------------------------------------------------------------- */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  
  if (!cursor || !follower) return;

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
  });

  const interactiveElements = document.querySelectorAll('a, button, .project-card, .expertise-card, .skill-badge, .contact-card');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.transform = 'translate(-50%, -50%) scale(1.6)';
      follower.style.borderColor = 'rgba(99, 102, 241, 0.8)';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    });
  });
}

/* --------------------------------------------------------------------------
   2. NAVBAR & MOBILE MENU TOGGLE
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.background = 'rgba(8, 9, 13, 0.95)';
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.background = 'rgba(8, 9, 13, 0.8)';
      navbar.style.boxShadow = 'none';
    }
  });

  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   3. SPOTLIGHT CARD MOUSE TRACKING
   -------------------------------------------------------------------------- */
function initSpotlights() {
  document.querySelectorAll('.spotlight').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* --------------------------------------------------------------------------
   4. SKILLS CATEGORY FILTER
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skills-filter-btn');
  const skillBoxes = document.querySelectorAll('.skill-category-box');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.skillFilter;

      skillBoxes.forEach(box => {
        if (filter === 'all' || box.dataset.category === filter) {
          box.style.display = 'block';
        } else {
          box.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. GITHUB DATA ENGINE (PROFILE, REPOS, ACTIVITY)
   -------------------------------------------------------------------------- */
async function loadGitHubData() {
  await Promise.all([
    fetchProfile(),
    fetchRepos()
  ]);
}

async function fetchProfile() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
    if (!res.ok) throw new Error('User fetch failed');
    
    const user = await res.json();

    const avatarEl = document.getElementById('ghAvatar');
    if (avatarEl && user.avatar_url) avatarEl.src = user.avatar_url;

    document.getElementById('ghName').textContent = user.name || user.login;
    document.getElementById('ghBio').textContent = user.bio || 'IT Student • Physics & Electronics Specialist';
    document.getElementById('ghRepos').textContent = user.public_repos || 0;
    document.getElementById('ghFollowers').textContent = user.followers || 0;
    document.getElementById('ghFollowing').textContent = user.following || 0;

    const repoCounter = document.getElementById('repoCounter');
    if (repoCounter) repoCounter.textContent = user.public_repos || 0;

  } catch (err) {
    console.warn('GitHub profile API fallback:', err);
    document.getElementById('ghRepos').textContent = '10+';
    document.getElementById('repoCounter').textContent = '10+';
  }
}

async function fetchRepos() {
  const grid = document.getElementById('projectsGrid');
  const errorEl = document.getElementById('ghError');

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`);
    if (!res.ok) throw new Error('Repos fetch failed');
    
    const repos = await res.json();
    
    // Sort & filter repos
    allRepos = repos.filter(r => !r.fork);
    
    if (allRepos.length === 0) {
      allRepos = repos; // Fallback to all if no non-forks
    }

    renderProjects(allRepos);
    if (errorEl) errorEl.style.display = 'none';

  } catch (err) {
    console.error('GitHub Repos API Error:', err);
    if (errorEl) errorEl.style.display = 'block';
    renderFallbackProjects();
  }
}

function renderProjects(repos) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  if (!repos || repos.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:2rem;">No matching repositories found.</p>';
    return;
  }

  grid.innerHTML = repos.map(repo => {
    const lang = repo.language || '';
    const color = langColors[lang] || langColors.default;
    const formattedName = repo.name.replace(/-/g, ' ').replace(/_/g, ' ');
    const updatedTime = timeAgo(repo.updated_at);
    const desc = repo.description || 'Repository for application code and engineering scripts.';

    return `
      <div class="project-card spotlight" onclick="window.open('${repo.html_url}', '_blank')">
        <div>
          <div class="project-top-row">
            <h3 class="project-title">${formattedName}</h3>
            <div class="project-links">
              <a href="${repo.html_url}" target="_blank" class="project-link-btn" onclick="event.stopPropagation()" title="GitHub Source">
                <svg viewBox="0 0 24 24" fill="currentColor" width="14"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-1.93c-3.19.69-3.86-1.54-3.86-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.27-5.23-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.57.23 2.73.11 3.02.74.8 1.18 1.82 1.18 3.07 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z"/></svg>
              </a>
              ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link-btn" onclick="event.stopPropagation()" title="Live Preview">↗</a>` : ''}
            </div>
          </div>
          <p class="project-desc-text">${desc}</p>
        </div>

        <div class="project-footer-meta">
          ${lang ? `<span class="project-lang-tag"><span class="skill-dot" style="background:${color}"></span>${lang}</span>` : '<span>Code</span>'}
          <div class="project-stats-meta">
            <span>★ ${repo.stargazers_count || 0}</span>
            <span>⎇ ${repo.forks_count || 0}</span>
            <span>${updatedTime}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  initSpotlights();
}

function renderFallbackProjects() {
  const fallbacks = [
    { name: 'Portfolio Website', desc: 'Modern responsive developer portfolio with GitHub API integration.', lang: 'JavaScript', url: `https://github.com/${GITHUB_USER}` },
    { name: 'Arduino IoT Controller', desc: 'Embedded C++ microcontroller logic for robotics sensors and control.', lang: 'C++', url: `https://github.com/${GITHUB_USER}` },
    { name: 'Full-Stack Web App', desc: 'Dynamic web solution with database schema and REST API endpoints.', lang: 'PHP', url: `https://github.com/${GITHUB_USER}` },
    { name: 'Python Automation Scripts', desc: 'Data parsing, automation, and utility tools built with Python.', lang: 'Python', url: `https://github.com/${GITHUB_USER}` },
    { name: 'Database Management System', desc: 'Relational database architecture and MySQL optimization scripts.', lang: 'C#', url: `https://github.com/${GITHUB_USER}` },
    { name: 'Physics & Electronics Simulation', desc: 'Circuit designs, PCB layouts, and electronic hardware projects.', lang: 'C++', url: `https://github.com/${GITHUB_USER}` }
  ];

  renderProjects(fallbacks.map(f => ({
    name: f.name,
    description: f.desc,
    language: f.lang,
    html_url: f.url,
    stargazers_count: 0,
    forks_count: 0,
    updated_at: new Date().toISOString()
  })));
}

/* Project Controls (Search & Language Filters) */
function initProjectControls() {
  const searchInput = document.getElementById('projectSearch');
  const filterBtns = document.querySelectorAll('#projectFilters .filter-btn');

  let activeLangFilter = 'all';

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const filtered = allRepos.filter(repo => {
      const nameMatch = repo.name.toLowerCase().includes(query);
      const descMatch = (repo.description || '').toLowerCase().includes(query);
      const langMatch = (repo.language || '').toLowerCase().includes(query);

      const matchesQuery = !query || nameMatch || descMatch || langMatch;
      const matchesLang = activeLangFilter === 'all' || (repo.language && repo.language.toLowerCase() === activeLangFilter.toLowerCase());

      return matchesQuery && matchesLang;
    });

    renderProjects(filtered);
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLangFilter = btn.dataset.filter;
      applyFilters();
    });
  });
}

/* --------------------------------------------------------------------------
   6. UTILITY & HELPER FUNCTIONS
   -------------------------------------------------------------------------- */
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function copyEmail(emailStr) {
  navigator.clipboard.writeText(emailStr).then(() => {
    showToast(`Copied ${emailStr} to clipboard!`);
  }).catch(err => {
    showToast('Failed to copy email.');
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* --------------------------------------------------------------------------
   8. FORMSPREE CONTACT FORM HANDLER
   -------------------------------------------------------------------------- */
async function handleForm(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = document.getElementById('submitBtn');
  const msgEl = document.getElementById('formMsg');
  const formData = new FormData(form);

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Sending Message...</span>';

  msgEl.style.display = 'block';
  msgEl.style.background = 'rgba(99, 102, 241, 0.15)';
  msgEl.style.color = '#818cf8';
  msgEl.style.border = '1px solid rgba(99, 102, 241, 0.3)';
  msgEl.textContent = '⏳ Sending message...';

  try {
    const res = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });

    if (res.ok) {
      msgEl.style.background = 'rgba(16, 185, 129, 0.15)';
      msgEl.style.color = '#34d399';
      msgEl.style.border = '1px solid rgba(16, 185, 129, 0.3)';
      msgEl.textContent = '✓ Message sent successfully! I will reply to you soon.';
      form.reset();
      showToast('Message sent successfully!');
    } else {
      throw new Error('Server returned error status');
    }
  } catch (err) {
    console.error('Contact form submission error:', err);
    msgEl.style.background = 'rgba(239, 68, 68, 0.15)';
    msgEl.style.color = '#f87171';
    msgEl.style.border = '1px solid rgba(239, 68, 68, 0.3)';
    msgEl.textContent = '✕ Error sending message. Please email dilushanmehavannan@gmail.com directly.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Send Message ↗</span>';
  }
}
