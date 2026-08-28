/* ==========================================================================
   MEHAVANNAN DILUSHAN - 3D VIDEOGRAPHY PCB MOTHERBOARD ENGINE
   ========================================================================== */

const FORMSPREE_URL = 'https://formspree.io/f/mojolrbo';

// Skill relationships for interactive circuit trace highlights
const skillConnections = {
  js: ['html', 'css', 'php', 'restapi', 'vscode', 'git'],
  py: ['cpp', 'mysql', 'mssql', 'restapi', 'vscode'],
  cpp: ['arduino', 'pcbfab', 'embedded', 'sensors', 'physicslab'],
  arduino: ['cpp', 'easyeda', 'pcbfab', 'embedded', 'sensors'],
  easyeda: ['pcbfab', 'embedded', 'sensors', 'physicslab', 'arduino'],
  mysql: ['mssql', 'relational', 'restapi', 'php', 'js'],
  git: ['vscode', 'js', 'py', 'cpp']
};

function initAll() {
  const safeRun = (fn, name) => {
    try {
      fn();
    } catch (err) {
      console.warn(`[PCB Engine] Error in ${name}:`, err);
    }
  };

  safeRun(initCursor, 'initCursor');
  safeRun(initNavbar, 'initNavbar');
  safeRun(init3DVideographyEngine, 'init3DVideographyEngine');
  safeRun(initSparkEngine, 'initSparkEngine');
  safeRun(init3DTilt, 'init3DTilt');
  safeRun(initSpotlightMouseTracking, 'initSpotlightMouseTracking');
  safeRun(initSkillsFilter, 'initSkillsFilter');
  safeRun(initSkillsTraceVisualizer, 'initSkillsTraceVisualizer');
  safeRun(initGSAPPowerTriggers, 'initGSAPPowerTriggers');
}

if (document.readyState !== 'loading') {
  initAll();
} else {
  document.addEventListener('DOMContentLoaded', initAll);
}

/* --------------------------------------------------------------------------
   1. CUSTOM PRECISION CURSOR
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

  const interactiveElements = document.querySelectorAll('a, button, .pcb-card, .pcb-chip-badge, .contact-card, .gallery-photo-box');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.transform = 'translate(-50%, -50%) scale(1.6)';
      follower.style.borderColor = 'var(--neon-cyan)';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.borderColor = 'var(--copper-gold)';
    });
  });
}

/* --------------------------------------------------------------------------
   2. NAVBAR & SCROLL CONTROLS
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
      navbar.style.background = 'rgba(4, 7, 17, 0.96)';
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.85), 0 0 15px rgba(229, 169, 60, 0.2)';
    } else {
      navbar.style.background = 'rgba(4, 7, 17, 0.88)';
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
   3. THREE.JS 3D VIDEOGRAPHY ENGINE (Cinematic Scroll Camera Flythrough)
   -------------------------------------------------------------------------- */
function init3DVideographyEngine() {
  const canvas = document.getElementById('pcb3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  let width = window.innerWidth;
  let height = window.innerHeight;

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  
  // Initial camera location (Hero View)
  const currentCamPos = new THREE.Vector3(0, 32, 42);
  const targetCamPos = new THREE.Vector3(0, 32, 42);
  
  const currentLookAt = new THREE.Vector3(0, 0, 0);
  const targetLookAt = new THREE.Vector3(0, 0, 0);

  camera.position.copy(currentCamPos);
  camera.lookAt(currentLookAt);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting Setup
  const ambientLight = new THREE.AmbientLight(0x0a1224, 2.8);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xe5a93c, 2.2);
  dirLight1.position.set(35, 50, 25);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x00f0ff, 2.0);
  dirLight2.position.set(-35, 40, -25);
  scene.add(dirLight2);

  // Group for the vast 3D Motherboard Landscape
  const boardGroup = new THREE.Group();
  scene.add(boardGroup);

  // 1. PCB Board Substrate Mesh (Vast Silicon Board)
  const boardGeo = new THREE.BoxGeometry(70, 1.5, 50);
  const boardMat = new THREE.MeshStandardMaterial({
    color: 0x060b1a,
    roughness: 0.25,
    metalness: 0.85
  });
  const pcbBoard = new THREE.Mesh(boardGeo, boardMat);
  pcbBoard.position.y = -0.75;
  boardGroup.add(pcbBoard);

  // 2. Copper Ground Grid Lines
  const gridHelper = new THREE.GridHelper(68, 34, 0xe5a93c, 0x14203e);
  gridHelper.position.y = 0.02;
  boardGroup.add(gridHelper);

  // 3. Central CPU Processor Chip
  const cpuGroup = new THREE.Group();
  const cpuGeo = new THREE.BoxGeometry(14, 2.0, 14);
  const cpuMat = new THREE.MeshStandardMaterial({ color: 0x080e1c, roughness: 0.2, metalness: 0.9 });
  const cpuMesh = new THREE.Mesh(cpuGeo, cpuMat);
  cpuMesh.position.y = 1.0;
  cpuGroup.add(cpuMesh);

  // Metallic Heat Spreader Top
  const heatSpreaderGeo = new THREE.BoxGeometry(9, 0.3, 9);
  const heatSpreaderMat = new THREE.MeshStandardMaterial({ color: 0xe5a93c, metalness: 0.95, roughness: 0.1 });
  const heatSpreader = new THREE.Mesh(heatSpreaderGeo, heatSpreaderMat);
  heatSpreader.position.y = 2.15;
  cpuGroup.add(heatSpreader);



  // CPU Metallic Pin Legs on 4 sides
  const pinMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.2 });
  for (let i = -6.0; i <= 6.0; i += 1.2) {
    const pinN = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 1.4), pinMat);
    pinN.position.set(i, 0.5, 7.5);
    cpuGroup.add(pinN);

    const pinS = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 1.4), pinMat);
    pinS.position.set(i, 0.5, -7.5);
    cpuGroup.add(pinS);

    const pinE = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 0.4), pinMat);
    pinE.position.set(7.5, 0.5, i);
    cpuGroup.add(pinE);

    const pinW = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 0.4), pinMat);
    pinW.position.set(-7.5, 0.5, i);
    cpuGroup.add(pinW);
  }
  boardGroup.add(cpuGroup);

  // 4. Auxiliary Microchips (RAM, GPU, IOT, DSP, PWR, BUS, NET, AI)
  const chipsData = [
    { x: -22, z: -14, w: 8, d: 10, col: 0x00f0ff },
    { x: 22, z: -14, w: 10, d: 8, col: 0xffd700 },
    { x: -22, z: 12, w: 9, d: 9, col: 0x00ff9d },
    { x: 22, z: 12, w: 8, d: 10, col: 0xa855f7 },
    { x: 0, z: -18, w: 12, d: 5, col: 0x00f0ff },
    { x: 0, z: 18, w: 12, d: 5, col: 0xe5a93c }
  ];

  chipsData.forEach(c => {
    const chipGeo = new THREE.BoxGeometry(c.w, 1.2, c.d);
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x0a1428, metalness: 0.85, roughness: 0.25 });
    const auxChip = new THREE.Mesh(chipGeo, chipMat);
    auxChip.position.set(c.x, 0.6, c.z);
    boardGroup.add(auxChip);

    const accentGeo = new THREE.BoxGeometry(c.w * 0.75, 0.15, c.d * 0.75);
    const accentMat = new THREE.MeshStandardMaterial({ color: c.col, metalness: 0.9, roughness: 0.1 });
    const accent = new THREE.Mesh(accentGeo, accentMat);
    accent.position.set(c.x, 1.25, c.z);
    boardGroup.add(accent);
  });

  // 5. Cylindrical Capacitors
  for (let i = 0; i < 8; i++) {
    const capGeo = new THREE.CylinderGeometry(1.4, 1.4, 4.0, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(-14 + i * 4.0, 2.0, -22);
    boardGroup.add(cap);

    const capTopGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.2, 16);
    const capTopMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.95 });
    const capTop = new THREE.Mesh(capTopGeo, capTopMat);
    capTop.position.set(-14 + i * 4.0, 4.1, -22);
    boardGroup.add(capTop);
  }

  // 6. Glowing Status LEDs
  const ledColors = [0x00ff9d, 0x00f0ff, 0xffd700, 0xa855f7];
  const leds = [];
  ledColors.forEach((col, idx) => {
    const ledLight = new THREE.PointLight(col, 3.5, 20);
    ledLight.position.set(-24 + idx * 16, 2.5, 20);
    scene.add(ledLight);

    const ledMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 12, 12),
      new THREE.MeshBasicMaterial({ color: col })
    );
    ledMesh.position.set(-24 + idx * 16, 0.8, 20);
    boardGroup.add(ledMesh);

    leds.push({ light: ledLight, mesh: ledMesh, baseInt: 3.5 });
  });

  // 7. Moving Electrical Current Data Particles (60+ Stream Vectors)
  const particleCount = 65;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities = [];

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 60;
    const z = (Math.random() - 0.5) * 40;
    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = 0.3;
    particlePositions[i * 3 + 2] = z;

    particleVelocities.push({
      vx: (Math.random() - 0.5) * 0.22,
      vz: (Math.random() - 0.5) * 0.22
    });
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00f0ff,
    size: 0.7,
    transparent: true,
    opacity: 0.9
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  boardGroup.add(particleSystem);

  // Mouse Parallax Offsets
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ------------------------------------------------------------------------
  // 3D VIDEOGRAPHY CAMERA PATH CONTROLLER (Scroll Keyframes)
  // ------------------------------------------------------------------------
  function updateCameraVideography() {
    const scrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrollY / (totalHeight || 1)));

    // Define 3D Camera Videography Waypoints across sections
    if (progress < 0.12) {
      // 0. Hero Section: High-angle cinematic overview
      targetCamPos.set(0 + mouseX * 2, 32 + mouseY * 2, 42);
      targetLookAt.set(0, 0, 0);
    } else if (progress < 0.25) {
      // 1. About Section: Low-angle glide into CPU substrate
      targetCamPos.set(-18 + mouseX * 2, 16 + mouseY * 2, 22);
      targetLookAt.set(-8, 0, -4);
    } else if (progress < 0.40) {
      // 2. Expertise Section: Low tracking shot along power rails
      targetCamPos.set(18 + mouseX * 2, 12 + mouseY * 2, 16);
      targetLookAt.set(6, 0, -2);
    } else if (progress < 0.55) {
      // 3. Skills Matrix: Sweep across memory chip banks
      targetCamPos.set(-22 + mouseX * 2, 24 + mouseY * 2, 8);
      targetLookAt.set(-5, 0, 0);
    } else if (progress < 0.72) {
      // 4. Projects Showcase: Flyover of hardware component cards
      targetCamPos.set(0 + mouseX * 2, 16 + mouseY * 2, 28);
      targetLookAt.set(0, 0, -6);
    } else if (progress < 0.84) {
      // 5. Achievements Section: Swoop to honors circuit block
      targetCamPos.set(16 + mouseX * 2, 20 + mouseY * 2, -14);
      targetLookAt.set(5, 0, -10);
    } else if (progress < 0.94) {
      // 6. Education Timeline: Tracing sequential bus line
      targetCamPos.set(-14 + mouseX * 2, 26 + mouseY * 2, -18);
      targetLookAt.set(-4, 0, -12);
    } else {
      // 7. Contact Terminal: Descend into I/O connector block
      targetCamPos.set(0 + mouseX * 2, 10 + mouseY * 2, 20);
      targetLookAt.set(0, 0, 0);
    }

    // Update HUD Coordinates Readout
    const coordsEl = document.getElementById('camCoords');
    if (coordsEl) {
      coordsEl.textContent = `POS: X: ${currentCamPos.x.toFixed(1)} Y: ${currentCamPos.y.toFixed(1)} Z: ${currentCamPos.z.toFixed(1)}`;
    }
  }

  window.addEventListener('scroll', updateCameraVideography);

  // Window Resize Handler
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  // Render Loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Lerp camera position and lookAt for silky smooth 3D videography flythrough
    currentCamPos.lerp(targetCamPos, 0.06);
    currentLookAt.lerp(targetLookAt, 0.06);

    camera.position.copy(currentCamPos);
    camera.lookAt(currentLookAt);

    // Pulse LEDs
    leds.forEach((led, idx) => {
      led.light.intensity = led.baseInt + Math.sin(elapsedTime * 4 + idx) * 1.8;
    });



    // Animate CPU Heat Spreader Glow
    heatSpreaderMat.color.setHSL(0.12, 0.9, 0.4 + Math.sin(elapsedTime * 3) * 0.18);

    // Move electrical current particles
    const positions = particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      let x = positions[i * 3];
      let z = positions[i * 3 + 2];

      x += particleVelocities[i].vx;
      z += particleVelocities[i].vz;

      if (Math.abs(x) > 32) particleVelocities[i].vx *= -1;
      if (Math.abs(z) > 22) particleVelocities[i].vz *= -1;

      positions[i * 3] = x;
      positions[i * 3 + 2] = z;
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
}

/* --------------------------------------------------------------------------
   4. ELECTRICAL SPARK BURST ENGINE
   -------------------------------------------------------------------------- */
function initSparkEngine() {
  const canvas = document.getElementById('spark-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const sparks = [];

  function createSparks(x, y) {
    const count = 18 + Math.floor(Math.random() * 12);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 2,
        color: Math.random() > 0.4 ? '#ffd700' : '#00f0ff',
        life: 1,
        decay: 0.02 + Math.random() * 0.03
      });
    }
  }

  window.addEventListener('click', (e) => {
    createSparks(e.clientX, e.clientY);
  });

  function renderSparks() {
    ctx.clearRect(0, 0, width, height);

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.1;
      s.life -= s.decay;

      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius * s.life, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 8;
      ctx.globalAlpha = s.life;
      ctx.fill();
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(renderSparks);
  }

  renderSparks();
}

/* --------------------------------------------------------------------------
   5. 3D PERSPECTIVE TILT
   -------------------------------------------------------------------------- */
function init3DTilt() {
  const photoCard = document.getElementById('heroPhotoWrap');
  if (photoCard) {
    const photoFrame = photoCard.querySelector('.photo-frame');
    const badge = photoCard.querySelector('.hero-status-badge');
    const header = photoCard.querySelector('.chip-surface-header');

    photoCard.addEventListener('mousemove', (e) => {
      const rect = photoCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = -((y - centerY) / centerY) * 22;
      const rotateY = ((x - centerX) / centerX) * 22;

      photoCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.06, 1.06, 1.06)`;

      if (photoFrame) photoFrame.style.transform = `translateZ(35px)`;
      if (badge) badge.style.transform = `translateX(-50%) translateZ(65px)`;
      if (header) header.style.transform = `translateZ(25px)`;
    });

    photoCard.addEventListener('mouseleave', () => {
      photoCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (photoFrame) photoFrame.style.transform = 'translateZ(0px)';
      if (badge) badge.style.transform = 'translateX(-50%) translateZ(45px)';
      if (header) header.style.transform = 'translateZ(0px)';
    });
  }

  Array.from(document.getElementsByClassName('3d-lift-card')).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = -((y - centerY) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* --------------------------------------------------------------------------
   6. SPOTLIGHT MOUSE TRACKING
   -------------------------------------------------------------------------- */
function initSpotlightMouseTracking() {
  document.querySelectorAll('.spotlight-chip').forEach(card => {
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
   7. SKILLS MATRIX FILTER & TRACE VISUALIZER
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skills-filter-btn');
  const skillBoxes = document.querySelectorAll('.skill-category-box');
  const searchInput = document.getElementById('skillSearchInput');
  const clearBtn = document.getElementById('clearSkillSearch');
  const counterEl = document.getElementById('searchResultsCounter');

  let currentCategory = 'all';

  function filterSkills() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    if (clearBtn) {
      clearBtn.style.display = query.length > 0 ? 'inline-block' : 'none';
    }

    let totalVisibleSkills = 0;

    skillBoxes.forEach(box => {
      const boxCat = box.getAttribute('data-category') || box.dataset.category;
      const isCatMatch = (currentCategory === 'all' || boxCat === currentCategory);

      if (!isCatMatch) {
        box.style.display = 'none';
        return;
      }

      let categoryHasMatches = false;
      const badges = box.querySelectorAll('.pcb-chip-badge');

      badges.forEach(badge => {
        const badgeText = badge.textContent.toLowerCase();
        const isMatch = (query === '' || badgeText.includes(query));

        if (isMatch) {
          badge.style.display = 'inline-flex';
          badge.style.opacity = '1';
          if (query !== '') {
            badge.classList.add('search-highlight');
          } else {
            badge.classList.remove('search-highlight');
          }
          categoryHasMatches = true;
          totalVisibleSkills++;
        } else {
          badge.style.display = 'none';
          badge.classList.remove('search-highlight');
        }
      });

      if (categoryHasMatches) {
        box.style.display = 'block';
        box.style.opacity = '1';
        box.style.visibility = 'visible';
        box.style.transform = 'none';
      } else {
        box.style.display = 'none';
      }
    });

    if (counterEl) {
      if (query !== '') {
        counterEl.textContent = `FOUND ${totalVisibleSkills} MATCHING SKILL${totalVisibleSkills === 1 ? '' : 'S'} FOR "${query.toUpperCase()}"`;
      } else if (currentCategory !== 'all') {
        counterEl.textContent = `SHOWING ${totalVisibleSkills} SKILLS IN ${currentCategory.toUpperCase()} CATEGORY`;
      } else {
        counterEl.textContent = `SHOWING ALL ${totalVisibleSkills} SKILLS & TECHNOLOGIES`;
      }
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const targetCat = btn.getAttribute('data-skill-filter') || (btn.dataset ? btn.dataset.skillFilter : 'all');
      currentCategory = targetCat;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      filterSkills();

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });

  if (searchInput) {
    ['input', 'keyup', 'change', 'search'].forEach(evt => {
      searchInput.addEventListener(evt, filterSkills);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchInput) searchInput.value = '';
      filterSkills();
      if (searchInput) searchInput.focus();
    });
  }

  // Initial Run
  filterSkills();
}

function initSkillsTraceVisualizer() {
  const skillNodes = Array.from(document.getElementsByClassName('3d-chip-node'));

  skillNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const skillId = node.getAttribute('data-skill-id') || (node.dataset ? node.dataset.skillId : null);
      if (!skillId) return;

      const related = skillConnections[skillId] || [];

      skillNodes.forEach(other => {
        const otherId = other.getAttribute('data-skill-id') || (other.dataset ? other.dataset.skillId : null);
        if (otherId && related.includes(otherId)) {
          other.style.borderColor = 'var(--neon-cyan)';
          other.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.6)';
          other.style.transform = 'translateY(-3px) scale(1.05)';
        } else if (other !== node) {
          other.style.opacity = '0.45';
        }
      });
    });

    node.addEventListener('mouseleave', () => {
      skillNodes.forEach(other => {
        other.style.borderColor = '';
        other.style.boxShadow = '';
        other.style.transform = '';
        other.style.opacity = '';
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. GSAP SCROLL-TRIGGERED POWER-ON SEQUENCES
   -------------------------------------------------------------------------- */
function initGSAPPowerTriggers() {
  const sections = document.querySelectorAll('.pcb-section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        const led = document.getElementById(`led-${sectionId}`);
        if (led) {
          led.classList.add('online');
        }

        document.querySelectorAll('.pcb-nav-link').forEach(link => {
          if (link.dataset.circuitTarget === sectionId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(sec => observer.observe(sec));

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    sections.forEach(section => {
      const targets = Array.from(section.querySelectorAll('.pcb-card, .pcb-section-header'));
      if (!targets || targets.length === 0) return;

      gsap.from(targets, {
        scrollTrigger: {
          trigger: section,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'transform,opacity,visibility'
      });
    });
  }
}

/* --------------------------------------------------------------------------
   9. HELPER & TERMINAL UTILITIES
   -------------------------------------------------------------------------- */
function copyEmail(emailStr) {
  navigator.clipboard.writeText(emailStr).then(() => {
    showToast(`COPIED ${emailStr} TO CLIPBOARD!`);
  }).catch(err => {
    showToast('FAILED TO COPY EMAIL.');
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3400);
}

/* --------------------------------------------------------------------------
   10. CONTACT FORM HANDLER
   -------------------------------------------------------------------------- */
async function handleForm(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = document.getElementById('submitBtn');
  const msgEl = document.getElementById('formMsg');
  const formData = new FormData(form);

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>SENDING MESSAGE...</span>';

  msgEl.style.display = 'block';
  msgEl.style.background = 'rgba(0, 240, 255, 0.15)';
  msgEl.style.color = '#00f0ff';
  msgEl.style.border = '1px solid rgba(0, 240, 255, 0.4)';
  msgEl.textContent = '⚡ Transmitting your message...';

  try {
    const res = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });

    if (res.ok) {
      msgEl.style.background = 'rgba(0, 255, 157, 0.15)';
      msgEl.style.color = '#00ff9d';
      msgEl.style.border = '1px solid rgba(0, 255, 157, 0.4)';
      msgEl.textContent = '✓ THANK YOU! YOUR MESSAGE HAS BEEN SENT SUCCESSFULLY.';
      form.reset();
      showToast('MESSAGE SENT SUCCESSFULLY!');
    } else {
      throw new Error('Server returned error status');
    }
  } catch (err) {
    console.error('Contact form submission error:', err);
    msgEl.style.background = 'rgba(239, 68, 68, 0.15)';
    msgEl.style.color = '#ef4444';
    msgEl.style.border = '1px solid rgba(239, 68, 68, 0.4)';
    msgEl.textContent = '✕ Transmission error. Please email directly to dilushanmehavannan@gmail.com.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>SEND MESSAGE ⚡</span>';
  }
}
