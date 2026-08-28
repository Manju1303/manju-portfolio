/* ==========================================================================
   MANJUNATH — 3D AI WORKSTATION PORTFOLIO ENGINE
   Vite / Vanilla JS Three.js 3D Scene + CSS3DRenderer + GSAP Camera State Machine
   ========================================================================== */

// SINGLE SOURCE OF TRUTH: PORTFOLIO DATA SCHEMA
const PORTFOLIO_DATA = {
  projects: {
    1: {
      key: "1",
      slug: "healthguard-ai",
      title: "HEALTHGUARD AI",
      category: "Health & Full-Stack Intelligence",
      description: [
        "NABH audit compliance intelligence platform utilizing predictive analytics for hospital pre-entry assessment.",
        "Intelligent gap analysis engine with automated 250+ point compliance scoring.",
        "Full-stack integration with FastAPI, React, and PostgreSQL."
      ],
      stack: ["FastAPI", "React", "PostgreSQL", "AI"],
      liveUrl: "#",
      sourceUrl: "https://github.com/Manju1303",
      status: "live"
    },
    2: {
      key: "2",
      slug: "aurora-3d",
      title: "AURORA 3D",
      category: "AI & LLMs",
      description: [
        "Next-generation 3D conversational AI voice avatar utilizing LLMs and real-time speech processing.",
        "Immersive avatar-based interface with high-fidelity facial synchronization.",
        "Advanced NLP engine for natural human-machine interaction."
      ],
      stack: ["Next.js", "LLM", "Three.js", "Voice"],
      liveUrl: "#",
      sourceUrl: "https://github.com/Manju1303",
      status: "coming-soon"
    },
    3: {
      key: "3",
      slug: "memora",
      title: "MEMORA",
      category: "AI & RAG Agents",
      description: [
        "Intelligent RAG-based agent with persistent semantic memory across user sessions.",
        "Advanced retrieval pipeline utilizing vector embeddings and ChromaDB.",
        "Hyper-personalized user memory context management."
      ],
      stack: ["Python", "RAG", "ChromaDB", "LLM"],
      liveUrl: "#",
      sourceUrl: "https://github.com/Manju1303",
      status: "live"
    },
    4: {
      key: "4",
      slug: "air-canva",
      title: "AIR CANVA",
      category: "Computer Vision",
      description: [
        "Zero-touch spatial drawing canvas utilizing Computer Vision and MediaPipe.",
        "Real-time finger tracking and gesture recognition with low-latency rendering.",
        "Interactive web canvas spatial user experience."
      ],
      stack: ["JavaScript", "MediaPipe", "Canvas API"],
      liveUrl: "#",
      sourceUrl: "https://github.com/Manju1303",
      status: "live"
    },
    5: {
      key: "5",
      slug: "sentinel",
      title: "PROJECT SENTINEL",
      category: "CV & Autonomous Systems",
      description: [
        "Autonomous drone navigation and mission control telemetry visualizer.",
        "Real-time aerial object tracking powered by custom YOLO object detection.",
        "Low-latency telemetry streaming pipeline."
      ],
      stack: ["YOLO", "OpenCV", "Robotics", "Python"],
      liveUrl: "#",
      sourceUrl: "https://github.com/Manju1303",
      status: "live"
    },
    6: {
      key: "6",
      slug: "personal-llm",
      title: "PERSONAL LLM",
      category: "AI & Local Infrastructure",
      description: [
        "On-premise deployment of large language models (LLaMA/Qwen) via Ollama.",
        "Privacy-first local AI environment ensuring zero data leakage.",
        "Custom system prompt tuning and model orchestration."
      ],
      stack: ["Ollama", "Linux", "Python", "LLM"],
      liveUrl: "#",
      sourceUrl: "https://github.com/Manju1303",
      status: "live"
    },
    7: {
      key: "7",
      slug: "mess-erp",
      title: "JKKM MESS ERP",
      category: "Full-Stack ERP",
      description: [
        "Smart ERP platform managing student attendance, meal consumption, and inventory.",
        "Predictive consumption model reducing food wastage.",
        "Real-time administrative dashboard built with Next.js and FastAPI."
      ],
      stack: ["Next.js", "FastAPI", "PostgreSQL"],
      liveUrl: "#",
      sourceUrl: "https://github.com/Manju1303",
      status: "live"
    },
    8: {
      key: "8",
      slug: "lucid-ocr",
      title: "LUCID OCR",
      category: "Computer Vision & NLP",
      description: [
        "High-accuracy AI OCR engine for multi-format text extraction.",
        "NLP-enhanced post-processing for document sanitization.",
        "Lightweight localized text recognition pipeline."
      ],
      stack: ["Python", "Tesseract", "OpenCV"],
      liveUrl: "#",
      sourceUrl: "https://github.com/Manju1303",
      status: "live"
    },
    9: {
      key: "9",
      slug: "catalog",
      title: "VIEW ALL PROJECTS",
      category: "Full GitHub Catalog",
      description: [
        "Explores remaining engineering repositories: Step Count Tracker, Data Visualizer, AI Humanizer, Fitness Tracker.",
        "Complete open-source codebase portfolio on GitHub."
      ],
      stack: ["GitHub", "Open Source"],
      liveUrl: "https://github.com/Manju1303",
      sourceUrl: "https://github.com/Manju1303",
      status: "live"
    }
  },
  about: {
    headline: "ABOUT ME.",
    role: "AI & Data Science Engineer",
    bio: "I am an engineering graduate with a B.Tech in Artificial Intelligence and Data Science, specializing in architecting scalable AI applications, LLM-powered systems, and intelligent digital products. I combine rigorous machine learning foundations with full-stack web engineering to transform complex algorithms into production-ready software.",
    status: "AVAILABLE FOR FULL-TIME AI & AGENTIC ROLES",
    degree: "B.Tech AI & Data Science (JKKMCT)",
    competencies: [
      { area: "AI & LLM Architecture", items: "RAG Systems, Vector DBs (ChromaDB), Semantic Search, Prompt Engineering" },
      { area: "Computer Vision & ML", items: "MediaPipe, OpenCV, Real-time Pose & Landmark Estimation, Predictive Analytics" },
      { area: "Full-Stack Development", items: "Python, React.js, Node.js, Express, JavaScript (ES6+), HTML5/CSS3" },
      { area: "DevOps & Cloud", items: "Docker Containerization, Git/GitHub, Linux/Ubuntu CLI, VPC, Subnets, SSH" }
    ]
  },
  contact: {
    email: "manjunath.work.ai@gmail.com",
    github: "https://github.com/Manju1303",
    linkedin: "https://www.linkedin.com/in/manjunath-manjunath-248594352",
    instagram: "https://www.instagram.com/mjx_1303"
  }
};

document.addEventListener('DOMContentLoaded', () => {

  if (window.lucide) window.lucide.createIcons();

  const state = {
    audioEnabled: true,
    bootCompleted: false,
    cameraState: 'DESK_WIDE', // 'DESK_WIDE' or 'MONITOR_FOCUS'
    activeView: 'about',
    rgbMode: 'rainbow'
  };

  // DOM Elements
  const bootOverlay = document.getElementById('bootOverlay');
  const skipIntroBtn = document.getElementById('skipIntroBtn');
  const bootProgress = document.getElementById('bootProgress');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const rgbSelect = document.getElementById('rgbModeSelect');
  const monitorClock = document.getElementById('monitorClock');

  // Monitor DOM Views
  const mTabs = document.querySelectorAll('.m-tab');
  const mViews = {
    about: document.getElementById('mViewAbout'),
    project: document.getElementById('mViewProject'),
    work: document.getElementById('mViewWork'),
    stack: document.getElementById('mViewStack'),
    contact: document.getElementById('mViewContact'),
    terminal: document.getElementById('mViewTerminal')
  };
  const projectCardContent = document.getElementById('projectCardContent');
  const workGridContainer = document.getElementById('workGridContainer');

  // Initialize Core Modules
  initCustomCursor();
  initAudioEngine();
  initClock();

  // Check Mobile Viewport
  if (window.innerWidth < 800) {
    initMobileFallback();
  } else {
    initBootSequence();
  }

  // =========================================================================
  // 1. BOOT INTRO SEQUENCE (JARVIS STYLE)
  // =========================================================================
  function initBootSequence() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (bootProgress) bootProgress.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(finishBoot, 400);
      }
    }, 250);

    if (skipIntroBtn) {
      skipIntroBtn.addEventListener('click', finishBoot);
    }
  }

  function finishBoot() {
    if (state.bootCompleted) return;
    state.bootCompleted = true;
    if (bootOverlay) bootOverlay.classList.add('hidden');
    init3DWorkstation();
  }

  // =========================================================================
  // 2. MONITOR DISPLAY CONTROLLER & DATA BINDING
  // =========================================================================
  function renderWorkGrid() {
    if (!workGridContainer) return;
    workGridContainer.innerHTML = '';

    Object.keys(PORTFOLIO_DATA.projects).forEach((k) => {
      const p = PORTFOLIO_DATA.projects[k];
      const card = document.createElement('div');
      card.className = 'mini-p-card';
      card.innerHTML = `
        <span class="k-num">KEY [${p.key}]</span>
        <h4>${p.title}</h4>
        <p>${p.category}</p>
      `;
      card.addEventListener('click', () => {
        showProjectDetail(p.key);
      });
      workGridContainer.appendChild(card);
    });
  }

  function showProjectDetail(keyNum) {
    const p = PORTFOLIO_DATA.projects[keyNum];
    if (!p || !projectCardContent) return;

    projectCardContent.innerHTML = `
      <div class="p-header">
        <span class="p-key-badge">KEY [${p.key}]</span>
        <span class="p-cat">${p.category}</span>
      </div>
      <h2 class="p-title">${p.title}</h2>
      <ul class="p-desc-list">
        ${p.description.map(d => `<li>${d}</li>`).join('')}
      </ul>
      <div class="p-chips">
        ${p.stack.map(s => `<span>${s}</span>`).join('')}
      </div>
      <div class="p-actions">
        ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" class="btn-demo"><i data-lucide="external-link"></i> Live Demo</a>` : ''}
        ${p.sourceUrl ? `<a href="${p.sourceUrl}" target="_blank" class="btn-source"><i data-lucide="github"></i> Source Code</a>` : ''}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    switchMonitorView('project');
    setCameraState('MONITOR_FOCUS');
  }

  function switchMonitorView(viewName) {
    state.activeView = viewName;

    mTabs.forEach(t => {
      if (t.getAttribute('data-target') === viewName) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    Object.keys(mViews).forEach(vk => {
      if (mViews[vk]) {
        if (vk === viewName) {
          mViews[vk].classList.add('active');
        } else {
          mViews[vk].classList.remove('active');
        }
      }
    });

    // Update top hotkey pill active state
    document.querySelectorAll('.hk-pill').forEach(pill => pill.classList.remove('active'));
    if (viewName === 'about') document.getElementById('hkAbout')?.classList.add('active');
    if (viewName === 'work' || viewName === 'project') document.getElementById('hkWork')?.classList.add('active');
    if (viewName === 'stack') document.getElementById('hkStack')?.classList.add('active');
    if (viewName === 'contact') document.getElementById('hkContact')?.classList.add('active');
  }

  mTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      switchMonitorView(target);
      setCameraState('MONITOR_FOCUS');
      playMechanicalKeySound();
    });
  });

  renderWorkGrid();

  // =========================================================================
  // 3. THREE.JS & CSS3D 3D SCENE + GSAP CAMERA STATE MACHINE
  // =========================================================================
  let scene, camera, renderer, cssRenderer;
  let keycapMeshes = new Map();
  let raycaster, mouse;

  function init3DWorkstation() {
    const container = document.getElementById('canvasContainer');
    const webglCanvas = document.getElementById('webglCanvas');
    const cssContainer = document.getElementById('css3dContainer');
    if (!container || !webglCanvas || !cssContainer || typeof THREE === 'undefined') return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Three.js Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 12, 35);
    camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    renderer = new THREE.WebGLRenderer({ canvas: webglCanvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. CSS3D Renderer (For Monitor Screen)
    cssRenderer = new THREE.CSS3DRenderer();
    cssRenderer.setSize(width, height);
    cssContainer.appendChild(cssRenderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const cyanKeyLight = new THREE.PointLight(0x00f0ff, 2, 80);
    cyanKeyLight.position.set(-15, 20, 15);
    scene.add(cyanKeyLight);

    const amberRimLight = new THREE.PointLight(0xd6a928, 2, 80);
    amberRimLight.position.set(15, 10, -15);
    scene.add(amberRimLight);

    // 5. 3D Desk Surface Mesh
    const deskGeo = new THREE.BoxGeometry(45, 1, 24);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x0c0b10,
      roughness: 0.4,
      metalness: 0.6
    });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, -0.5, 0);
    scene.add(desk);

    // 6. 3D Monitor Frame Mesh
    const monitorBezelGeo = new THREE.BoxGeometry(22, 13, 0.8);
    const monitorBezelMat = new THREE.MeshStandardMaterial({ color: 0x15141d, roughness: 0.2 });
    const monitorBezel = new THREE.Mesh(monitorBezelGeo, monitorBezelMat);
    monitorBezel.position.set(0, 7.5, -6);
    scene.add(monitorBezel);

    const monitorStandGeo = new THREE.CylinderGeometry(0.8, 1.2, 4, 16);
    const monitorStand = new THREE.Mesh(monitorStandGeo, monitorBezelMat);
    monitorStand.position.set(0, 1.5, -6);
    scene.add(monitorStand);

    // 7. CSS3D Screen Object Integration
    const screenTemplate = document.getElementById('monitorContentTemplate');
    if (screenTemplate) {
      const cssObject = new THREE.CSS3DObject(screenTemplate);
      cssObject.position.set(0, 7.5, -5.5);
      cssObject.scale.set(0.021, 0.021, 0.021);
      scene.add(cssObject);
    }

    // 8. 3D Mechanical Keyboard Base & Pickable Keycaps
    const kbBaseGeo = new THREE.BoxGeometry(20, 0.8, 8);
    const kbBaseMat = new THREE.MeshStandardMaterial({ color: 0x1a1924, roughness: 0.3 });
    const kbBase = new THREE.Mesh(kbBaseGeo, kbBaseMat);
    kbBase.position.set(0, 0.4, 6);
    scene.add(kbBase);

    create3DKeycaps();

    // 9. Raycaster & Event Listeners
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onCanvasClick);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('keydown', onKeyDown);

    // Render Loop
    function animate() {
      requestAnimationFrame(animate);

      // Sinusoidal Camera Parallax Drift when in DESK_WIDE view
      if (state.cameraState === 'DESK_WIDE') {
        const time = Date.now() * 0.001;
        camera.position.x = Math.sin(time * 0.5) * 1.2 + mouse.x * 2;
        camera.position.y = 12 + Math.cos(time * 0.5) * 0.6 + mouse.y * 1.5;
        camera.lookAt(0, 3, 0);
      }

      renderer.render(scene, camera);
      cssRenderer.render(scene, camera);
    }
    animate();
  }

  // Create 3D Keycaps for Number keys (1-9), About (A), Work (W), Stack (S), Contact (C), Terminal (T)
  function create3DKeycaps() {
    const keyData = [
      { key: '1', x: -8, z: 4.5, color: 0xd6a928 },
      { key: '2', x: -6, z: 4.5, color: 0xd6a928 },
      { key: '3', x: -4, z: 4.5, color: 0xd6a928 },
      { key: '4', x: -2, z: 4.5, color: 0xd6a928 },
      { key: '5', x: 0, z: 4.5, color: 0xd6a928 },
      { key: '6', x: 2, z: 4.5, color: 0xd6a928 },
      { key: '7', x: 4, z: 4.5, color: 0xd6a928 },
      { key: '8', x: 6, z: 4.5, color: 0xd6a928 },
      { key: '9', x: 8, z: 4.5, color: 0xd6a928 },
      { key: 'A', x: -7, z: 6.2, color: 0x00f0ff },
      { key: 'W', x: -5, z: 6.2, color: 0x00f0ff },
      { key: 'S', x: -3, z: 6.2, color: 0x00f0ff },
      { key: 'C', x: 5, z: 6.2, color: 0x00f0ff },
      { key: 'T', x: 7, z: 6.2, color: 0x00f0ff }
    ];

    const keyGeo = new THREE.BoxGeometry(1.6, 0.6, 1.4);

    keyData.forEach(k => {
      const mat = new THREE.MeshStandardMaterial({
        color: k.color,
        roughness: 0.3,
        metalness: 0.4
      });
      const keyMesh = new THREE.Mesh(keyGeo, mat);
      keyMesh.position.set(k.x, 1.1, k.z);
      keyMesh.userData = { key: k.key, origY: 1.1 };
      scene.add(keyMesh);
      keycapMeshes.set(k.key, keyMesh);
    });
  }

  // =========================================================================
  // 4. GSAP CAMERA STATE MACHINE
  // =========================================================================
  function setCameraState(targetState) {
    state.cameraState = targetState;

    if (typeof gsap === 'undefined') return;

    if (targetState === 'MONITOR_FOCUS') {
      gsap.to(camera.position, {
        x: 0,
        y: 7.5,
        z: 18,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(0, 7.5, -5.5)
      });
    } else {
      gsap.to(camera.position, {
        x: 0,
        y: 12,
        z: 35,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => camera.lookAt(0, 3, 0)
      });
    }
  }

  // =========================================================================
  // 5. INTERACTION & KEYBOARD INPUT PIPELINE
  // =========================================================================
  function animateKeyDepression(keyMesh) {
    if (!keyMesh || typeof gsap === 'undefined') return;
    const origY = keyMesh.userData.origY || 1.1;

    gsap.to(keyMesh.position, {
      y: origY - 0.3,
      duration: 0.08,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut'
    });
  }

  function handleKeyPressAction(keyStr) {
    playMechanicalKeySound();

    const mesh = keycapMeshes.get(keyStr);
    if (mesh) animateKeyDepression(mesh);

    if (keyStr >= '1' && keyStr <= '9') {
      showProjectDetail(keyStr);
    } else if (keyStr === 'A' || keyStr === 'a') {
      switchMonitorView('about');
      setCameraState('MONITOR_FOCUS');
    } else if (keyStr === 'W' || keyStr === 'w') {
      switchMonitorView('work');
      setCameraState('MONITOR_FOCUS');
    } else if (keyStr === 'S' || keyStr === 's') {
      switchMonitorView('stack');
      setCameraState('MONITOR_FOCUS');
    } else if (keyStr === 'C' || keyStr === 'c') {
      switchMonitorView('contact');
      setCameraState('MONITOR_FOCUS');
    } else if (keyStr === 'T' || keyStr === 't') {
      switchMonitorView('terminal');
      setCameraState('MONITOR_FOCUS');
    } else if (keyStr === 'Escape') {
      setCameraState('DESK_WIDE');
    }
  }

  function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function onCanvasClick(e) {
    if (state.cameraState === 'MONITOR_FOCUS' && e.target.tagName === 'CANVAS') {
      setCameraState('DESK_WIDE');
      return;
    }

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(Array.from(keycapMeshes.values()));

    if (intersects.length > 0) {
      const hitKey = intersects[0].object.userData.key;
      if (hitKey) handleKeyPressAction(hitKey);
    }
  }

  function onKeyDown(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    let k = e.key;
    if (k >= '1' && k <= '9') {
      handleKeyPressAction(k);
    } else if (k === 'a' || k === 'A') {
      handleKeyPressAction('A');
    } else if (k === 'w' || k === 'W') {
      handleKeyPressAction('W');
    } else if (k === 's' || k === 'S') {
      handleKeyPressAction('S');
    } else if (k === 'c' || k === 'C') {
      handleKeyPressAction('C');
    } else if (k === 't' || k === 'T') {
      handleKeyPressAction('T');
    } else if (k === 'Escape') {
      handleKeyPressAction('Escape');
    }
  }

  function onWindowResize() {
    const container = document.getElementById('canvasContainer');
    if (!container || !camera || !renderer || !cssRenderer) return;
    const w = container.clientWidth;
    const h = container.clientHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    cssRenderer.setSize(w, h);
  }

  // =========================================================================
  // 6. AUDIO & CURSOR & MOBILE FALLBACK
  // =========================================================================
  let audioCtx = null;
  function getAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playMechanicalKeySound() {
    if (!state.audioEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.09);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.11);
    } catch (e) {}
  }

  function initAudioEngine() {
    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', () => {
        state.audioEnabled = !state.audioEnabled;
        if (state.audioEnabled) {
          audioToggleBtn.classList.add('active');
        } else {
          audioToggleBtn.classList.remove('active');
        }
      });
    }
  }

  function initCustomCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`;
    });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.2; ringY += (mouseY - ringY) * 0.2;
      ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`;
      requestAnimationFrame(renderRing);
    }
    renderRing();
  }

  function initClock() {
    function updateClock() {
      const now = new Date();
      if (monitorClock) monitorClock.textContent = now.toTimeString().split(' ')[0];
    }
    setInterval(updateClock, 1000);
    updateClock();
  }

  // Mobile Fallback Card Grid Renderer
  function initMobileFallback() {
    const mobileGrid = document.getElementById('mobileGrid');
    if (!mobileGrid) return;
    mobileGrid.innerHTML = '';

    Object.keys(PORTFOLIO_DATA.projects).forEach(k => {
      const p = PORTFOLIO_DATA.projects[k];
      const card = document.createElement('div');
      card.className = 'm-card';
      card.innerHTML = `
        <span class="num">PROJECT [${p.key}]</span>
        <h4>${p.title}</h4>
        <p>${p.category}</p>
        <div class="m-chips">${p.stack.map(s => `<span>${s}</span>`).join('')}</div>
      `;
      mobileGrid.appendChild(card);
    });
  }

});
