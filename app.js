/* ==========================================================================
   MANJUNATH — TACTILE MECHANICAL KEYBOARD PORTFOLIO (APP LOGIC)
   Web Audio Synthesizer, 3D Key Actuation, Interactive Terminal & Desk Mechanics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- INITIALIZE LUCIDE ICONS ---
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- GLOBAL STATE ---
  const state = {
    audioEnabled: true,
    soundProfile: 'thock', // 'thock' | 'clicky' | 'silent'
    currentTheme: 'cyberpunk',
    activeSection: 'hero'
  };

  // --- THREE.JS BACKGROUND PARTICLE CANVAS ---
  initParticleBackground();

  // --- CLOCKWORK IRIS LOADER ---
  initClockworkLoader();

  // --- WEB AUDIO API MECHANICAL SOUND SYNTHESIZER ---
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playMechanicalKeySound() {
    if (!state.audioEnabled) return;
    
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      if (state.soundProfile === 'thock') {
        // Deep Thock Switch (Linear Gateron Oil King style)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.08);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        // Noise click component for key stem impact
        const bufferSize = ctx.sampleRate * 0.02;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.15, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

        osc.connect(gain);
        gain.connect(ctx.destination);

        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
        noise.start(now);
        noise.stop(now + 0.03);

      } else if (state.soundProfile === 'clicky') {
        // Sharp Blue Clicky Switch
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'square';
        osc1.frequency.setValueAtTime(800, now);
        osc1.frequency.exponentialRampToValueAtTime(200, now + 0.04);

        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(1200, now);
        osc2.frequency.exponentialRampToValueAtTime(300, now + 0.03);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.05);
        osc2.stop(now + 0.05);

      } else if (state.soundProfile === 'silent') {
        // Soft Dampened Linear Switch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.06);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.07);
      }

    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // --- CLOCKWORK LOADER ENGINE ---
  function initClockworkLoader() {
    const loader = document.getElementById('clockworkLoader');
    const fill = document.getElementById('loaderFill');
    const status = document.getElementById('loaderStatus');
    const enterBtn = document.getElementById('enterPortfolioBtn');

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;
      if (progress > 100) progress = 100;

      fill.style.width = progress + '%';

      if (progress < 40) {
        status.textContent = 'INITIALIZING SWITCHES...';
      } else if (progress < 80) {
        status.textContent = 'CALIBRATING 1000Hz POLLING...';
      } else {
        status.textContent = 'MECHANICAL DECK READY!';
      }

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);

    enterBtn.addEventListener('click', () => {
      loader.classList.add('loaded');
      getAudioContext();
      playMechanicalKeySound();
    });
  }

  // --- KEYBOARD INTERACTIVITY & AUDIO FEEDBACK ---
  const keyElements = document.querySelectorAll('.keykey');
  const lastPressedKeyEl = document.getElementById('lastPressedKey');

  // Keycode mapping dictionary
  const keyMap = {};
  keyElements.forEach(keyEl => {
    const code = keyEl.getAttribute('data-key');
    if (code) {
      keyMap[code] = keyEl;
    }

    // Add click/tap actuation for mouse and touch users
    keyEl.addEventListener('mousedown', () => {
      triggerKeyActuation(keyEl, code);
    });

    keyEl.addEventListener('mouseup', () => {
      releaseKeyActuation(keyEl);
    });

    keyEl.addEventListener('touchstart', (e) => {
      e.preventDefault();
      triggerKeyActuation(keyEl, code);
    }, { passive: false });

    keyEl.addEventListener('touchend', () => {
      releaseKeyActuation(keyEl);
    });
  });

  function triggerKeyActuation(keyEl, keyName) {
    if (!keyEl) return;
    keyEl.classList.add('pressed');
    playMechanicalKeySound();

    if (lastPressedKeyEl) {
      const legend = keyEl.querySelector('.key-legend')?.textContent || keyName || 'KEY';
      lastPressedKeyEl.textContent = legend;
    }

    // Check shortcut actions
    handleKeyAction(keyName);
  }

  function releaseKeyActuation(keyEl) {
    if (!keyEl) return;
    keyEl.classList.remove('pressed');
  }

  // GLOBAL PHYSICAL KEYBOARD EVENT LISTENERS
  window.addEventListener('keydown', (e) => {
    // Terminal shortcut (Ctrl + K)
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleTerminal();
      return;
    }

    // Ignore keydown when typing in inputs/terminal unless ESC
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      if (e.code === 'Escape') {
        document.activeElement.blur();
        closeTerminal();
        closeProjectModal();
      }
      return;
    }

    const keyEl = keyMap[e.code];
    if (keyEl) {
      triggerKeyActuation(keyEl, e.code);
    }
  });

  window.addEventListener('keyup', (e) => {
    const keyEl = keyMap[e.code];
    if (keyEl) {
      releaseKeyActuation(keyEl);
    }
  });

  // SHORTCUT ROUTER & ACTIONS
  function handleKeyAction(code) {
    switch (code) {
      case 'KeyZ':
        scrollToSection('projects');
        highlightNav('projects');
        break;

      case 'KeyX':
        scrollToSection('skills');
        highlightNav('skills');
        break;

      case 'KeyC':
        scrollToSection('contact');
        highlightNav('contact');
        break;

      case 'Escape':
        scrollToSection('hero');
        highlightNav('hero');
        closeTerminal();
        closeProjectModal();
        pulseIris();
        break;

      case 'Space':
        triggerRgbWave();
        break;

      case 'Tab':
        toggleTerminal();
        break;

      default:
        break;
    }
  }

  // RGB RIPPLE WAVE ANIMATION ACROSS KEYBOARD
  function triggerRgbWave() {
    keyElements.forEach((key, index) => {
      setTimeout(() => {
        key.classList.add('pressed');
        setTimeout(() => key.classList.remove('pressed'), 120);
      }, index * 18);
    });
  }

  function pulseIris() {
    const loader = document.getElementById('clockworkLoader');
    if (!loader) return;
    loader.classList.remove('loaded');
    setTimeout(() => loader.classList.add('loaded'), 800);
  }

  // NAVIGATION SCROLLING
  function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function highlightNav(sectionId) {
    state.activeSection = sectionId;
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // --- SHORTCUT PILLS CLICK LISTENERS ---
  document.querySelectorAll('.shortcut-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const key = pill.getAttribute('data-key');
      handleKeyAction(key);
      playMechanicalKeySound();
    });
  });

  // --- AUDIO PROFILE & TOGGLE CONTROL ---
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const soundProfileSelect = document.getElementById('soundProfileSelect');
  const currentSwitchName = document.getElementById('currentSwitchName');

  audioToggleBtn.addEventListener('click', () => {
    state.audioEnabled = !state.audioEnabled;
    if (state.audioEnabled) {
      audioToggleBtn.classList.add('active');
      audioIcon.setAttribute('data-lucide', 'volume-2');
    } else {
      audioToggleBtn.classList.remove('active');
      audioIcon.setAttribute('data-lucide', 'volume-x');
    }
    if (window.lucide) window.lucide.createIcons();
  });

  soundProfileSelect.addEventListener('change', (e) => {
    state.soundProfile = e.target.value;
    playMechanicalKeySound();

    if (currentSwitchName) {
      if (state.soundProfile === 'thock') currentSwitchName.textContent = 'Thocky Gateron Oil King';
      if (state.soundProfile === 'clicky') currentSwitchName.textContent = 'Cherry MX Blue Clicky';
      if (state.soundProfile === 'silent') currentSwitchName.textContent = 'Silent Red Linear';
    }
  });

  // --- THEME PRESET SWITCHER ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themes = ['cyberpunk', 'matrix', 'stealth', 'retro'];
  let currentThemeIdx = 0;

  themeToggleBtn.addEventListener('click', () => {
    currentThemeIdx = (currentThemeIdx + 1) % themes.length;
    const newTheme = themes[currentThemeIdx];
    document.body.className = `theme-${newTheme}`;
    state.currentTheme = newTheme;

    const rgbDisplay = document.getElementById('currentRgbTheme');
    if (rgbDisplay) {
      rgbDisplay.textContent = newTheme.toUpperCase() + ' NEON';
    }

    playMechanicalKeySound();
  });

  // --- DRAGGABLE DESK STICKERS ENGINE ---
  initDraggableStickers();

  function initDraggableStickers() {
    const stickers = document.querySelectorAll('.sticker');
    let activeSticker = null;
    let offsetX = 0, offsetY = 0;

    stickers.forEach(sticker => {
      sticker.addEventListener('mousedown', startDrag);
      sticker.addEventListener('touchstart', startDrag, { passive: false });
    });

    function startDrag(e) {
      activeSticker = this;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const rect = activeSticker.getBoundingClientRect();
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;

      window.addEventListener('mousemove', onDrag);
      window.addEventListener('touchmove', onDrag, { passive: false });
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('touchend', stopDrag);

      playMechanicalKeySound();
    }

    function onDrag(e) {
      if (!activeSticker) return;
      if (e.preventDefault) e.preventDefault();

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const mat = document.getElementById('deskMat').getBoundingClientRect();
      let left = clientX - mat.left - offsetX;
      let top = clientY - mat.top - offsetY;

      activeSticker.style.left = `${left}px`;
      activeSticker.style.top = `${top}px`;
    }

    function stopDrag() {
      activeSticker = null;
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('touchmove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchend', stopDrag);
    }
  }

  // --- PROJECT FILTER SYSTEM ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      playMechanicalKeySound();
    });
  });

  // --- PROJECT MODAL DATA & CONTROLLER ---
  const projectData = {
    p1: {
      title: 'RAG & LLM Context Engine',
      category: 'AI & LLM Architecture',
      tech: ['Python', 'ChromaDB', 'LangChain', 'FastAPI', 'OpenAI'],
      description: 'Production-grade Retrieval-Augmented Generation platform built with Chroma Vector DB. Processes complex multi-format document sets, creates dense embeddings, and returns instant contextual answers with zero hallucination.',
      features: [
        'Vector Semantic Search with ChromaDB',
        'Hybrid BM25 + Vector Retrieval reranking',
        'Asynchronous FastAPI REST endpoints',
        'Custom prompt template optimization'
      ],
      github: 'https://github.com/Manju1303'
    },
    p2: {
      title: 'Real-Time Pose & Landmark Analyzer',
      category: 'Computer Vision & ML',
      tech: ['OpenCV', 'MediaPipe', 'Python', 'NumPy', 'SciPy'],
      description: 'Real-time computer vision joint tracking framework. Captures video feeds via web cameras or streams, computes 33-point 3D landmark locations, and performs skeletal joint angle analysis at 60 FPS.',
      features: [
        'MediaPipe 3D Landmark Estimation',
        'Real-time OpenCV video stream processing',
        'Biomechanical joint angle calculations',
        'Zero-latency canvas visualizer'
      ],
      github: 'https://github.com/Manju1303'
    },
    p3: {
      title: 'CBT Interactive Web Platform',
      category: 'Web & Cognitive Tech',
      tech: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'WebGL'],
      description: 'Interactive web platform designed for cognitive behavioral exercises and real-time state tracking. Built with high performance client-side state management and responsive UI components.',
      features: [
        'Modular TypeScript architecture',
        'Interactive state tracking modules',
        'Ultra-fast client rendering',
        'Accessible, mobile-responsive layout'
      ],
      github: 'https://github.com/Manju1303'
    },
    p4: {
      title: 'Home Services Marketplace Platform',
      category: 'Full-Stack Web Engineering',
      tech: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB'],
      description: 'End-to-end service marketplace application connecting local clients with service professionals. Features interactive scheduling, real-time booking updates, and user management.',
      features: [
        'Full-stack TypeScript code structure',
        'Real-time booking and status notifications',
        'Secure authentication & role management',
        'Optimized database queries'
      ],
      github: 'https://github.com/Manju1303'
    },
    p5: {
      title: 'Distributed Sensor AI Analytics',
      category: 'IoT & Predictive AI',
      tech: ['Python', 'Scikit-Learn', 'Docker', 'TimescaleDB', 'MQTT'],
      description: 'Distributed sensor telemetry and predictive maintenance pipeline. Aggregates multi-node sensor streams, detects anomalies in real-time, and predicts equipment failure cycles.',
      features: [
        'Predictive Machine Learning models',
        'High-throughput MQTT telemetry ingestion',
        'Docker containerized deployment',
        'Real-time anomaly alert triggers'
      ],
      github: 'https://github.com/Manju1303'
    }
  };

  window.openProjectModal = function(id) {
    const modal = document.getElementById('projectModal');
    const details = document.getElementById('modalDetails');
    const data = projectData[id];

    if (!data) return;

    details.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--primary); margin-bottom: 8px;">${data.category}</div>
      <h2 style="font-family: var(--font-display); font-size: 1.8rem; color: #fff; margin-bottom: 16px;">${data.title}</h2>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; margin-bottom: 24px;">${data.description}</p>
      
      <h4 style="font-family: var(--font-display); color: #fff; font-size: 1rem; margin-bottom: 12px;">KEY FEATURES</h4>
      <ul style="list-style: none; padding: 0; margin-bottom: 24px;">
        ${data.features.map(f => `<li style="display: flex; align-items: center; gap: 8px; color: var(--text-main); font-size: 0.9rem; margin-bottom: 6px;"><span style="color: var(--primary);">▹</span> ${f}</li>`).join('')}
      </ul>

      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px;">
        ${data.tech.map(t => `<span style="font-family: var(--font-mono); font-size: 0.75rem; background: rgba(0, 240, 255, 0.1); border: 1px solid var(--primary-glow); color: var(--primary); padding: 4px 10px; border-radius: 4px;">${t}</span>`).join('')}
      </div>

      <a href="${data.github}" target="_blank" rel="noopener" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 10px; text-decoration: none; padding: 12px 24px; border-radius: var(--radius-sm); font-family: var(--font-display); font-weight: 700;">
        <span>VIEW REPOSITORY ON GITHUB</span>
        <i data-lucide="external-link"></i>
      </a>
    `;

    if (window.lucide) window.lucide.createIcons();
    modal.classList.add('active');
    playMechanicalKeySound();
  };

  window.closeProjectModal = function() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.remove('active');
  };

  // --- TERMINAL ENGINE (CTRL + K) ---
  const cmdPaletteBtn = document.getElementById('cmdPaletteBtn');
  const terminalOverlay = document.getElementById('terminalOverlay');
  const closeTerminalBtn = document.getElementById('closeTerminalBtn');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');

  if (cmdPaletteBtn) cmdPaletteBtn.addEventListener('click', toggleTerminal);
  if (closeTerminalBtn) closeTerminalBtn.addEventListener('click', closeTerminal);

  function toggleTerminal() {
    if (terminalOverlay.classList.contains('active')) {
      closeTerminal();
    } else {
      terminalOverlay.classList.add('active');
      terminalInput.focus();
      playMechanicalKeySound();
    }
  }

  function closeTerminal() {
    if (terminalOverlay) terminalOverlay.classList.remove('active');
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim();
        if (cmd) {
          executeCommand(cmd);
          terminalInput.value = '';
        }
      }
    });
  }

  function executeCommand(cmd) {
    appendTermLine(`mj@zxc-keyboard:~$ ${cmd}`, 'cmd-user');
    const cleanCmd = cmd.toLowerCase().trim();

    if (cleanCmd === 'help') {
      appendTermLine('Available Commands:', 'cmd-info');
      appendTermLine('  about       — Display Manjunath\'s background & degree', 'cmd-line');
      appendTermLine('  projects    — Scroll to project PCB showcase', 'cmd-line');
      appendTermLine('  skills      — Show core technical competencies', 'cmd-line');
      appendTermLine('  contact     — View contact channels & social links', 'cmd-line');
      appendTermLine('  theme <t>   — Change theme (cyberpunk, matrix, stealth, retro)', 'cmd-line');
      appendTermLine('  switch <s>  — Change switch sound (thock, clicky, silent)', 'cmd-line');
      appendTermLine('  clear       — Clear terminal screen', 'cmd-line');
      appendTermLine('  exit        — Close terminal overlay', 'cmd-line');

    } else if (cleanCmd === 'about') {
      appendTermLine('MANJUNATH — AI Engineer & Agentic Coder', 'cmd-highlight');
      appendTermLine('B.Tech in Artificial Intelligence and Data Science (JKKMCT). Specializing in LLM RAG applications, Computer Vision pose estimation, and scalable AI infrastructure.', 'cmd-line');

    } else if (cleanCmd === 'projects') {
      scrollToSection('projects');
      closeTerminal();

    } else if (cleanCmd === 'skills') {
      scrollToSection('skills');
      closeTerminal();

    } else if (cleanCmd === 'contact') {
      scrollToSection('contact');
      closeTerminal();

    } else if (cleanCmd.startsWith('theme')) {
      const parts = cleanCmd.split(' ');
      if (parts[1] && ['cyberpunk', 'matrix', 'stealth', 'retro'].includes(parts[1])) {
        document.body.className = `theme-${parts[1]}`;
        state.currentTheme = parts[1];
        appendTermLine(`Theme set to ${parts[1].toUpperCase()}`, 'cmd-success');
      } else {
        appendTermLine('Invalid theme. Options: cyberpunk, matrix, stealth, retro', 'cmd-warn');
      }

    } else if (cleanCmd.startsWith('switch')) {
      const parts = cleanCmd.split(' ');
      if (parts[1] && ['thock', 'clicky', 'silent'].includes(parts[1])) {
        state.soundProfile = parts[1];
        soundProfileSelect.value = parts[1];
        appendTermLine(`Mechanical switch audio set to ${parts[1].toUpperCase()}`, 'cmd-success');
      } else {
        appendTermLine('Invalid switch. Options: thock, clicky, silent', 'cmd-warn');
      }

    } else if (cleanCmd === 'clear') {
      terminalOutput.innerHTML = '';

    } else if (cleanCmd === 'exit' || cleanCmd === 'close') {
      closeTerminal();

    } else {
      appendTermLine(`Command not recognized: '${cmd}'. Type 'help' for options.`, 'cmd-warn');
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    playMechanicalKeySound();
  }

  function appendTermLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    line.textContent = text;
    terminalOutput.appendChild(line);
  }

  // --- CONTACT FORM HANDLER ---
  window.handleFormSubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('senderName').value;
    alert(`Thank you, ${name}! Your transmission has been dispatched. Manjunath will respond shortly.`);
    e.target.reset();
  };

  // --- MOBILE NAV TOGGLE ---
  const mobileNavBtn = document.getElementById('mobileNavBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileNavBtn && mobileDrawer) {
    mobileNavBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // --- THREE.JS PARTICLE CANVAS BACKGROUND ENGINE ---
  function initParticleBackground() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesCount = 350;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    camera.position.z = 5;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });

    function animate() {
      requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

});
