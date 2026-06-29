// ========================
// CUSTOM CURSOR
// ========================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  follower.style.left = mx + 'px';
  follower.style.top = my + 'px';
});

document.querySelectorAll('a, button, .project-card, .skill-category, .stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    follower.style.transform = 'translate(-50%,-50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// ========================
// NAVBAR SCROLL + TOGGLE
// ========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.padding = '0.8rem 4rem';
  } else {
    navbar.style.padding = '1.2rem 4rem';
  }
});

const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ========================
// SCROLL REVEAL
// ========================
const reveals = document.querySelectorAll('section, .project-card, .achievement-card, .tl-item, .skill-category, .stat-card');
reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08 });

reveals.forEach(el => observer.observe(el));

// ========================
// GITHUB API
// ========================
const GITHUB_USER = 'Dilushan-Mehavannan';

async function loadGitHub() {
  try {
    // Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
    const user = await userRes.json();

    if (user.message) throw new Error('User not found');

    // Update profile card
    document.getElementById('ghAvatar').src = user.avatar_url;
    document.getElementById('ghName').textContent = user.name || user.login;
    document.getElementById('ghBio').textContent = user.bio || 'Developer | Physics & Electronics | Sri Lanka';
    document.getElementById('ghRepos').textContent = user.public_repos;
    document.getElementById('ghFollowers').textContent = user.followers;
    document.getElementById('ghFollowing').textContent = user.following;
    document.getElementById('repoCount').textContent = user.public_repos;

    // Fetch repos
    const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`);
    const repos = await reposRes.json();

    allRepos = repos.filter(r => !r.fork);
    renderProjects(allRepos);

    // Fetch events
    loadActivity();

  } catch (err) {
    console.error('GitHub API error:', err);
    // Show fallback content
    showFallbackProjects();
    document.getElementById('ghError').style.display = 'block';
    // Set fallback avatar
    document.getElementById('ghAvatar').src = 'https://avatars.githubusercontent.com/u/0?v=4';
    document.getElementById('ghName').textContent = 'Mehavannan Dilushan';
    document.getElementById('ghBio').textContent = 'IT Student | Physics & Electronics | Robotics Enthusiast';
    document.getElementById('ghRepos').textContent = '—';
    document.getElementById('ghFollowers').textContent = '—';
    document.getElementById('ghFollowing').textContent = '—';
  }
}

let allRepos = [];

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
  default: '#6e7681'
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function renderProjects(repos) {
  const grid = document.getElementById('projectsGrid');
  if (!repos || repos.length === 0) {
    grid.innerHTML = '<p style="color:var(--ash);grid-column:1/-1">No public repositories found.</p>';
    return;
  }

  grid.innerHTML = repos.map(repo => {
    const lang = repo.language || '';
    const color = langColors[lang] || langColors.default;
    return `
      <div class="project-card reveal" data-lang="${lang}" onclick="window.open('${repo.html_url}','_blank')">
        <div class="project-header">
          <span class="project-name">${repo.name.replace(/-/g, ' ')}</span>
          <div class="project-links">
            <a href="${repo.html_url}" target="_blank" class="project-link" onclick="event.stopPropagation()" title="GitHub">
              <svg viewBox="0 0 16 16" fill="currentColor" width="14"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            </a>
            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link" onclick="event.stopPropagation()" title="Live Demo">↗</a>` : ''}
          </div>
        </div>
        <p class="project-desc">${repo.description || 'No description provided.'}</p>
        <div class="project-meta">
          ${lang ? `<span><span class="lang-dot" style="background:${color}"></span>${lang}</span>` : ''}
          <span class="project-stars">★ ${repo.stargazers_count}</span>
          <span class="project-forks">⎇ ${repo.forks_count}</span>
          <span class="project-updated">${timeAgo(repo.updated_at)}</span>
        </div>
      </div>
    `;
  }).join('');

  // Re-observe new cards
  document.querySelectorAll('.project-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    if (filter === 'all') {
      renderProjects(allRepos);
    } else {
      renderProjects(allRepos.filter(r => r.language === filter));
    }
  });
});

// ========================
// GITHUB ACTIVITY
// ========================
async function loadActivity() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=10`);
    const events = await res.json();

    const activityGrid = document.getElementById('activityGrid');

    if (!events || events.length === 0) {
      activityGrid.innerHTML = '<p style="color:var(--ash)">No recent activity found.</p>';
      updateActivityTimestamp();
      return;
    }

    const eventIcons = {
      PushEvent: '⬆',
      CreateEvent: '✦',
      ForkEvent: '⎇',
      WatchEvent: '★',
      IssuesEvent: '●',
      PullRequestEvent: '⟳',
      DeleteEvent: '✕',
      default: '◈'
    };

    activityGrid.innerHTML = events.slice(0, 8).map(ev => {
      const icon = eventIcons[ev.type] || eventIcons.default;
      const repo = ev.repo.name.split('/')[1];
      let desc = '';

      if (ev.type === 'PushEvent') {
        const commits = ev.payload.commits?.length || 0;
        desc = `Pushed ${commits} commit${commits !== 1 ? 's' : ''} to <strong>${repo}</strong>`;
      } else if (ev.type === 'CreateEvent') {
        desc = `Created ${ev.payload.ref_type} in <strong>${repo}</strong>`;
      } else if (ev.type === 'ForkEvent') {
        desc = `Forked <strong>${repo}</strong>`;
      } else if (ev.type === 'WatchEvent') {
        desc = `Starred <strong>${repo}</strong>`;
      } else if (ev.type === 'IssuesEvent') {
        desc = `${ev.payload.action} an issue in <strong>${repo}</strong>`;
      } else {
        desc = `${ev.type.replace('Event', '')} on <strong>${repo}</strong>`;
      }

      return `
        <div class="activity-item">
          <div class="activity-icon">${icon}</div>
          <div class="activity-text">
            <p>${desc}</p>
          </div>
          <span class="activity-time">${timeAgo(ev.created_at)}</span>
        </div>
      `;
    }).join('');

    updateActivityTimestamp();

  } catch (err) {
    document.getElementById('activityGrid').innerHTML = '<p style="color:var(--ash)">Could not load activity.</p>';
    console.error('Activity load error:', err);
  }
}

// Update timestamp and disable button during refresh
function updateActivityTimestamp() {
  const timestamp = new Date().toLocaleTimeString();
  const statusEl = document.querySelector('.activity-last-updated');
  if (statusEl) {
    statusEl.textContent = `Last updated: ${timestamp}`;
  }
}

// Manual refresh button
document.addEventListener('DOMContentLoaded', () => {
  const refreshBtn = document.getElementById('refreshActivityBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.disabled = true;
      refreshBtn.textContent = '⏳ Refreshing...';
      await loadActivity();
      refreshBtn.disabled = false;
      refreshBtn.textContent = '🔄 Refresh';
    });
  }
});

// ========================
// FALLBACK PROJECTS
// ========================
function showFallbackProjects() {
  const grid = document.getElementById('projectsGrid');
  const fallbacks = [
    { name: 'Web Projects', desc: 'HTML, CSS & JavaScript web development projects.', lang: 'HTML', stars: 0 },
    { name: 'Python Scripts', desc: 'Python automation and scripting projects.', lang: 'Python', stars: 0 },
    { name: 'Arduino Projects', desc: 'Embedded systems and Arduino coding.', lang: 'C++', stars: 0 },
    { name: '.NET Applications', desc: 'C# and .NET framework applications.', lang: 'C#', stars: 0 },
    { name: 'Database Projects', desc: 'MySQL and MSSQL database solutions.', lang: 'PHP', stars: 0 },
    { name: 'Robotics Code', desc: 'Code for robotics and IoT competitions.', lang: 'C++', stars: 0 },
  ];
  grid.innerHTML = fallbacks.map(r => `
    <div class="project-card" onclick="window.open('https://github.com/${GITHUB_USER}','_blank')">
      <div class="project-header">
        <span class="project-name">${r.name}</span>
        <div class="project-links">
          <a href="https://github.com/${GITHUB_USER}" target="_blank" class="project-link" onclick="event.stopPropagation()">↗</a>
        </div>
      </div>
      <p class="project-desc">${r.desc}</p>
      <div class="project-meta">
        <span><span class="lang-dot" style="background:${langColors[r.lang] || langColors.default}"></span>${r.lang}</span>
        <span>★ ${r.stars}</span>
      </div>
    </div>
  `).join('');
}

// ========================
// CONTACT FORM
// ========================
const FORMSPREE_URL = 'https://formspree.io/f/mojolrbo';

async function handleForm(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const msg = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');

  msg.style.display = 'block';
  msg.textContent = '⏳ Sending your message...';
  msg.style.color = 'var(--accent)';
  submitBtn.disabled = true;

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });

    if (response.ok) {
      msg.textContent = '✓ Message sent! I\'ll get back to you soon.';
      msg.style.color = 'var(--accent)';
      form.reset();
      setTimeout(() => { msg.style.display = 'none'; }, 5000);
    } else {
      const result = await response.json();
      msg.textContent = '✗ ' + (result.errors?.[0]?.message || 'Something went wrong.');
      msg.style.color = '#ff6b6b';
      setTimeout(() => { msg.style.display = 'none'; }, 5000);
    }
  } catch (error) {
    console.error('Form submission error:', error);
    msg.textContent = '✗ Network error. Please try again.';
    msg.style.color = '#ff6b6b';
    setTimeout(() => { msg.style.display = 'none'; }, 5000);
  } finally {
    submitBtn.disabled = false;
  }
}

// ========================
// AUTO-REFRESH GITHUB DATA
// ========================
// Refresh GitHub data every 5 minutes (300,000 ms)
setInterval(() => {
  console.log('🔄 Auto-refreshing GitHub data...');
  loadGitHub();
  loadActivity();
}, 300000); // 5 minutes

// ========================
// INIT
// ========================
loadGitHub();

// Stagger reveal animations
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hero-greeting, .hero-name, .hero-tagline, .hero-cta, .hero-social').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.1}s`;
  });
});
