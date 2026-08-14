/* ==========================================================================
   MANJUNATH — PORTFOLIO-ZXC BEHAVIOR, INTERACTIONS & PROJECT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  if (window.lucide) window.lucide.createIcons();

  const state = {
    audioEnabled: true,
    soundProfile: 'thock'
  };

  // THREE.JS PARTICLES BACKGROUND
  initParticleBackground();

  // CLOCKWORK LOADER
  initClockworkLoader();

  // =========================================================================
  // AUDIO SYNTHESIZER
  // =========================================================================
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playMechanicalKeySound() {
    if (!state.audioEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      if (state.soundProfile === 'thock') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.09);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now); osc.stop(now + 0.11);
      } else if (state.soundProfile === 'clicky') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now); osc.stop(now + 0.06);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(85, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.07);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now); osc.stop(now + 0.08);
      }
    } catch (e) {}
  }

  // =========================================================================
  // CLOCKWORK LOADER
  // =========================================================================
  function initClockworkLoader() {
    const loader = document.getElementById('clockworkLoader');
    const fill = document.getElementById('loaderFill');
    const status = document.getElementById('loaderStatus');
    const enterBtn = document.getElementById('enterPortfolioBtn');

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 5;
      if (progress > 100) progress = 100;
      fill.style.width = progress + '%';

      if (progress < 40) status.textContent = 'CALIBRATING AMBER BACKLIGHT...';
      else if (progress < 70) status.textContent = 'LOADING 9 PROJECT MODULES...';
      else if (progress < 95) status.textContent = 'SYNCHRONIZING DESK DIALS...';
      else status.textContent = 'KEYBOARD READY!';

      if (progress >= 100) clearInterval(interval);
    }, 90);

    enterBtn.addEventListener('click', () => {
      loader.classList.add('loaded');
      getAudioContext();
      playMechanicalKeySound();
    });
  }

  // =========================================================================
  // KEYBOARD MAP & ACTUATION
  // =========================================================================
  const keyElements = document.querySelectorAll('.keykey');
  const keyMap = {};

  keyElements.forEach(keyEl => {
    const code = keyEl.getAttribute('data-key');
    if (code) keyMap[code] = keyEl;

    keyEl.addEventListener('mousedown', () => triggerKeyActuation(keyEl, code));
    keyEl.addEventListener('mouseup', () => releaseKeyActuation(keyEl));
    keyEl.addEventListener('touchstart', (e) => {
      e.preventDefault();
      triggerKeyActuation(keyEl, code);
    }, { passive: false });
    keyEl.addEventListener('touchend', () => releaseKeyActuation(keyEl));
  });

  function triggerKeyActuation(keyEl, keyName) {
    if (!keyEl) return;
    keyEl.classList.add('pressed');
    playMechanicalKeySound();
    handleKeyAction(keyName);
  }

  function releaseKeyActuation(keyEl) {
    if (!keyEl) return;
    keyEl.classList.remove('pressed');
  }

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleTerminal();
      return;
    }

    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      if (e.code === 'Escape') {
        document.activeElement.blur();
        closeTerminal();
        closeProjectModal();
      }
      return;
    }

    const keyEl = keyMap[e.code];
    if (keyEl) triggerKeyActuation(keyEl, e.code);
  });

  window.addEventListener('keyup', (e) => {
    const keyEl = keyMap[e.code];
    if (keyEl) releaseKeyActuation(keyEl);
  });

  function handleKeyAction(code) {
    switch (code) {
      case 'KeyA': scrollToSection('about'); break;
      case 'KeyZ': scrollToSection('projects'); break;
      case 'KeyX': scrollToSection('skills'); break;
      case 'KeyC': scrollToSection('contact'); break;
      case 'Escape':
        scrollToSection('hero');
        closeTerminal();
        closeProjectModal();
        break;
      case 'Space': triggerRgbWave(); break;
      case 'Digit1': openProjectModal('p1'); break;
      case 'Digit2': openProjectModal('p2'); break;
      case 'Digit3': openProjectModal('p3'); break;
      case 'Digit4': openProjectModal('p4'); break;
      case 'Digit5': openProjectModal('p5'); break;
      case 'Digit6': openProjectModal('p6'); break;
      case 'Digit7': openProjectModal('p7'); break;
      case 'Digit8': openProjectModal('p8'); break;
      case 'Digit9': openProjectModal('p9'); break;
      default: break;
    }
  }

  function triggerRgbWave() {
    keyElements.forEach((key, index) => {
      setTimeout(() => {
        key.classList.add('pressed');
        setTimeout(() => key.classList.remove('pressed'), 120);
      }, index * 16);
    });
  }

  window.scrollToSection = function(id) {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  // =========================================================================
  // AUDIO PROFILE & CONTROLS
  // =========================================================================
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const soundProfileSelect = document.getElementById('soundProfileSelect');

  if (audioToggleBtn) {
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
  }

  if (soundProfileSelect) {
    soundProfileSelect.addEventListener('change', (e) => {
      state.soundProfile = e.target.value;
      playMechanicalKeySound();
    });
  }

  // =========================================================================
  // DESK DECOR INTERACTIVITY
  // =========================================================================
  const deskMouse = document.getElementById('deskMouse');
  if (deskMouse) {
    deskMouse.addEventListener('click', () => {
      playMechanicalKeySound();
      deskMouse.style.transform = 'translateY(2px) scale(0.96)';
      setTimeout(() => deskMouse.style.transform = 'none', 150);
    });
  }

  document.querySelectorAll('.figurine').forEach(fig => {
    fig.addEventListener('click', () => {
      playMechanicalKeySound();
      fig.style.transform = 'translateY(-6px) scale(1.15)';
      setTimeout(() => fig.style.transform = 'none', 200);
    });
  });

  // =========================================================================
  // PROJECT DATA (9 PROJECTS)
  // =========================================================================
  const projectData = {
    p1: {
      title: 'AURORA',
      category: 'AI & LLMs',
      subtitle: 'AI Avatar · Assistant · Voice AI · 3D UX',
      tech: ['Python', 'LLM', '3D Models', 'Speech APIs'],
      features: [
        'Next-generation 3D conversational agent leveraging LLMs and real-time speech processing',
        'Advanced NLP engine for natural, context-aware human-machine interaction',
        'Immersive avatar-based interface with high-fidelity facial synchronization'
      ],
      liveDemo: null,
      sourceCode: 'https://github.com/Manju1303'
    },
    p2: {
      title: 'Memora — AI Agent',
      category: 'AI & LLMs',
      subtitle: 'AI Agent · RAG · Memory',
      tech: ['Python', 'Vector DB', 'Semantic Search'],
      features: [
        'Intelligent RAG-based agent with persistent semantic memory across sessions',
        'Advanced retrieval pipeline utilizing vector embeddings and ChromaDB',
        'Modular agent architecture designed for hyper-personalized user experiences'
      ],
      liveDemo: null,
      sourceCode: 'https://github.com/Manju1303'
    },
    p3: {
      title: 'HealthGuard AI',
      category: 'Health & Full-Stack',
      subtitle: 'AI · HealthTech · Analytics',
      tech: ['Python', 'FastAPI', 'React', 'PostgreSQL'],
      features: [
        'Healthcare audit automation utilizing predictive analytics for NABH pre-entry assessment',
        'Intelligent gap analysis engine with automated compliance scoring and reporting',
        'Comprehensive 250+ point accreditation dashboard for medical facilities'
      ],
      liveDemo: '#',
      sourceCode: null
    },
    p4: {
      title: 'Air Canva',
      category: 'Computer Vision',
      subtitle: 'Comp. Vision · AI Interaction',
      tech: ['JavaScript', 'MediaPipe', 'Canvas API'],
      features: [
        'Immersive zero-touch interface utilizing Computer Vision and MediaPipe for spatial creativity',
        'Real-time finger tracking and gesture recognition with low-latency rendering',
        'Innovative digital canvas experience driven by AI-powered human-computer interaction'
      ],
      liveDemo: '#',
      sourceCode: 'https://github.com/Manju1303'
    },
    p5: {
      title: 'Theft Detection System',
      category: 'Computer Vision',
      subtitle: 'Comp. Vision · AI Monitoring · Security',
      tech: ['Python', 'OpenCV', 'TensorFlow', 'Security'],
      features: [
        'Real-time suspicious activity monitoring and automated threat detection',
        'Intelligent video stream analysis utilizing custom-trained CV models',
        'Automated security alerting system for critical perimeter monitoring'
      ],
      liveDemo: '#',
      sourceCode: 'https://github.com/Manju1303'
    },
    p6: {
      title: 'Lucid OCR',
      category: 'AI & Computer Vision',
      subtitle: 'AI OCR · NLP',
      tech: ['Python', 'Tesseract', 'OpenCV'],
      features: [
        'High-accuracy AI OCR engine for instant multi-format text extraction',
        'Proprietary NLP-enhanced post-processing for document sanitization',
        'Lightweight, privacy-focused localized text recognition pipeline'
      ],
      liveDemo: null,
      sourceCode: 'https://github.com/Manju1303'
    },
    p7: {
      title: 'AI Humanizer',
      category: 'AI & NLP',
      subtitle: 'NLP · AI · Content',
      tech: ['TypeScript', 'NLP', 'AI'],
      features: [
        'Proprietary NLP engine utilizing advanced linguistic modeling to neutralize AI-generated syntax',
        'Dynamic semantic restructuring to achieve human-like stylistic variation while maintaining core intent',
        'Context-aware content transformation designed to optimize readability and bypass automated detection'
      ],
      liveDemo: null,
      sourceCode: 'https://github.com/Manju1303'
    },
    p8: {
      title: 'Personal LLM',
      category: 'AI & LLMs',
      subtitle: 'Local AI · Hosting · Privacy',
      tech: ['Python', 'Ollama', 'Linux'],
      features: [
        'On-premise deployment of large-scale language models (LLaMA) via high-performance Linux infrastructure',
        'Privacy-first AI environment ensuring zero-data-leakage through localized semantic processing',
        'Modular LLM orchestration layer for advanced model tuning and bespoke system prompt engineering'
      ],
      liveDemo: null,
      sourceCode: 'https://github.com/Manju1303'
    },
    p9: {
      title: 'Fitness Tracker',
      category: 'Health & Full-Stack',
      subtitle: 'Health · Storage · Analytics',
      tech: ['HTML5', 'CSS3', 'JavaScript'],
      features: [
        'Feature-rich health analytics platform for comprehensive biometric logging and BMI monitoring',
        'Automated health milestone tracking with interactive time-series progress visualization',
        'High-performance, zero-dependency architecture engineered for optimal load times and reliability'
      ],
      liveDemo: null,
      sourceCode: null
    }
  };

  // =========================================================================
  // PROJECT MODAL
  // =========================================================================
  window.openProjectModal = function(id) {
    const modal = document.getElementById('projectModal');
    const details = document.getElementById('modalDetails');
    const data = projectData[id];
    if (!data) return;

    let actionsHtml = '';
    if (data.liveDemo) {
      actionsHtml += `<a href="${data.liveDemo}" target="_blank" rel="noopener" class="card-action-btn primary"><i data-lucide="external-link"></i> Live Demo</a>`;
    }
    if (data.sourceCode) {
      actionsHtml += `<a href="${data.sourceCode}" target="_blank" rel="noopener" class="card-action-btn"><i data-lucide="github"></i> Source Code</a>`;
    }
    if (!data.liveDemo && !data.sourceCode) {
      actionsHtml = '<span class="card-action-btn coming-soon"><i data-lucide="clock"></i> Coming Soon</span>';
    }

    details.innerHTML = `
      <div class="modal-category">${data.category}</div>
      <h2 class="modal-title">${data.title}</h2>
      <div class="modal-subtitle">${data.subtitle}</div>
      <ul class="modal-features">
        ${data.features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <div class="modal-tech">
        ${data.tech.map(t => `<span>${t}</span>`).join('')}
      </div>
      <div class="modal-actions">${actionsHtml}</div>
    `;

    if (window.lucide) window.lucide.createIcons();
    modal.classList.add('active');
    playMechanicalKeySound();
  };

  window.closeProjectModal = function() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.remove('active');
  };

  // =========================================================================
  // CATEGORY FILTER
  // =========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card-amber');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const categories = card.getAttribute('data-categories') || '';
          if (categories.split(',').includes(filter)) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        }
      });

      playMechanicalKeySound();
    });
  });

  // =========================================================================
  // TERMINAL ENGINE
  // =========================================================================
  const cmdPaletteBtn = document.getElementById('cmdPaletteBtn');
  const terminalOverlay = document.getElementById('terminalOverlay');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');

  if (cmdPaletteBtn) cmdPaletteBtn.addEventListener('click', toggleTerminal);

  function toggleTerminal() {
    if (terminalOverlay.classList.contains('active')) closeTerminal();
    else {
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
    appendTermLine(`mj@zxc-portfolio:~$ ${cmd}`, 'cmd-user');
    const cleanCmd = cmd.toLowerCase().trim();

    if (cleanCmd === 'help') {
      appendTermLine('Commands: about, projects, skills, contact, clear, exit', 'cmd-info');
      appendTermLine('Press keys 1-9 to view individual projects.', 'cmd-info');
    } else if (cleanCmd === 'about') {
      appendTermLine('Manjunath — AI Engineer & Data Science Professional (B.Tech JKKMCT).', 'cmd-highlight');
      appendTermLine('Specializing in LLM RAG pipelines, Computer Vision, and Full-Stack engineering.', '');
    } else if (cleanCmd === 'projects') {
      appendTermLine('9 Featured Projects: AURORA, Memora, HealthGuard AI, Air Canva, Theft Detection,', 'cmd-info');
      appendTermLine('Lucid OCR, AI Humanizer, Personal LLM, Fitness Tracker', 'cmd-info');
      scrollToSection('projects');
      closeTerminal();
    } else if (cleanCmd === 'skills') {
      scrollToSection('skills');
      closeTerminal();
    } else if (cleanCmd === 'contact') {
      scrollToSection('contact');
      closeTerminal();
    } else if (cleanCmd === 'clear') {
      terminalOutput.innerHTML = '';
    } else if (cleanCmd === 'exit') {
      closeTerminal();
    } else {
      appendTermLine(`Unknown command '${cmd}'. Type 'help' for available commands.`, 'cmd-warn');
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

  // =========================================================================
  // THREE.JS PARTICLES BACKGROUND
  // =========================================================================
  function initParticleBackground() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesCount = 250;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xd4af37,
      transparent: true,
      opacity: 0.45
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    camera.position.z = 5;

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(canvas);

    function animate() {
      requestAnimationFrame(animate);
      if (isVisible) {
        particlesMesh.rotation.y += 0.0008;
        renderer.render(scene, camera);
      }
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

});
