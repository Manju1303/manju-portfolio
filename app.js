/* ==========================================================================
   MANJUNATH — FINAL PRD CREATIVE PORTFOLIO ENGINE
   Custom Amber Cursor, Terminal Morph, Keyboard Dock, CMD Easter Eggs, 3D WebGL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  if (window.lucide) window.lucide.createIcons();

  const state = {
    audioEnabled: true,
    soundProfile: 'thock',
    introMorphed: false,
    cmdMode: 'cmd', // 'cmd' or 'linux'
    commandHistory: [],
    historyIndex: -1
  };

  // CUSTOM AMBER CURSOR ENGINE (PRD SECTION 23)
  initCustomCursor();

  // THREE.JS PARTICLES BACKGROUND
  initParticleBackground();

  // INTRO TERMINAL MORPH ENGINE
  initIntroTerminal();

  // AUDIO SYNTHESIZER
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
  // CUSTOM CURSOR (PRD SECTION 23)
  // =========================================================================
  function initCustomCursor() {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(renderRing);
    }
    renderRing();

    // Hover expand targets
    const hoverables = 'a, button, .dock-key, .project-card-amber, .stack-pill, .filter-tab, .flow-step-card, input';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) {
        document.body.classList.add('hovered-link');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) {
        document.body.classList.remove('hovered-link');
      }
    });
  }

  // =========================================================================
  // INTRO TERMINAL MORPH LOGIC (PRD SECTION 3)
  // =========================================================================
  function initIntroTerminal() {
    const introTerminal = document.getElementById('introTerminal');
    const introInput = document.getElementById('introTerminalInput');
    const enterBtn = document.getElementById('enterWorkspaceBtn');

    function launchWorkspace() {
      if (state.introMorphed) return;
      state.introMorphed = true;
      introTerminal.classList.add('morphed');
      getAudioContext();
      playMechanicalKeySound();
    }

    if (enterBtn) enterBtn.addEventListener('click', launchWorkspace);

    if (introInput) {
      introInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          launchWorkspace();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!state.introMorphed && e.key === 'Escape') {
        launchWorkspace();
      }
    });
  }

  // =========================================================================
  // KEYBOARD DOCK & GLOBAL HOTKEYS (PRD SECTION 7)
  // =========================================================================
  const dockKeys = document.querySelectorAll('.dock-key');
  const dockMap = {};

  dockKeys.forEach(keyEl => {
    const code = keyEl.getAttribute('data-key');
    if (code) dockMap[code] = keyEl;
  });

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

    // Trigger tactile press animation
    const dockEl = dockMap[e.code];
    if (dockEl) {
      dockEl.classList.add('pressed');
      playMechanicalKeySound();
      setTimeout(() => dockEl.classList.remove('pressed'), 140);
    }

    // Hotkey Action Dispatch
    switch (e.code) {
      case 'KeyA': scrollToSection('about'); break;
      case 'KeyW': scrollToSection('projects'); break;
      case 'KeyI': scrollToSection('ai-systems'); break;
      case 'KeyS': scrollToSection('stack'); break;
      case 'KeyJ': scrollToSection('journey'); break;
      case 'KeyC': scrollToSection('contact'); break;
      case 'KeyT': toggleTerminal(); break;
      case 'Digit1': openProjectModal('p1'); break;
      case 'Digit2': openProjectModal('p2'); break;
      case 'Digit3': openProjectModal('p3'); break;
      case 'Digit4': openProjectModal('p4'); break;
      case 'Digit5': openProjectModal('p5'); break;
      case 'Digit6': openProjectModal('p6'); break;
      case 'Escape':
        closeTerminal();
        closeProjectModal();
        break;
      default: break;
    }
  });

  window.scrollToSection = function(id) {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  // =========================================================================
  // AUDIO CONTROLS
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
  // COMPREHENSIVE 11-PROJECT DATABASE
  // =========================================================================
  const projectData = {
    p1: {
      title: 'AURORA',
      category: 'AI & LLMs',
      subtitle: '3D AI Voice Assistant · Avatar UX',
      tech: ['AI', 'LLM', 'VOICE', '3D'],
      features: [
        'Next-generation 3D conversational agent leveraging LLMs and real-time speech processing',
        'Advanced NLP engine for natural, context-aware human-machine interaction',
        'Immersive avatar-based interface with high-fidelity facial synchronization'
      ],
      liveDemo: null,
      sourceCode: 'https://github.com/Manju1303'
    },
    p2: {
      title: 'MEMORA',
      category: 'AI & LLMs',
      subtitle: 'Persistent RAG Memory Agent',
      tech: ['RAG', 'ChromaDB', 'LLM', 'Python'],
      features: [
        'Intelligent RAG-based agent with persistent semantic memory across sessions',
        'Advanced retrieval pipeline utilizing vector embeddings and ChromaDB',
        'Modular agent architecture designed for hyper-personalized user experiences'
      ],
      liveDemo: null,
      sourceCode: 'https://github.com/Manju1303'
    },
    p3: {
      title: 'HEALTHGUARD AI',
      category: 'Health & Full-Stack',
      subtitle: 'NABH Compliance Intelligence',
      tech: ['AI', 'FastAPI', 'React', 'PostgreSQL'],
      features: [
        'Healthcare audit automation utilizing predictive analytics for NABH pre-entry assessment',
        'Intelligent gap analysis engine with automated compliance scoring and reporting',
        'Comprehensive 250+ point accreditation dashboard for medical facilities'
      ],
      liveDemo: '#',
      sourceCode: null
    },
    p4: {
      title: 'PROJECT SENTINEL',
      category: 'Computer Vision & AI',
      subtitle: 'Autonomous AI Surveillance Drone',
      tech: ['AI', 'Computer Vision', 'YOLO', 'Robotics'],
      features: [
        'Autonomous drone navigation and mission control visualization system',
        'Real-time aerial object tracking and automated route optimization',
        'Low-latency telemetry streaming over high-speed communication channels'
      ],
      liveDemo: null,
      sourceCode: 'https://github.com/Manju1303'
    },
    p5: {
      title: 'PERSONAL LLM',
      category: 'AI & LLMs',
      subtitle: 'On-Premise Privacy LLM Instance',
      tech: ['LLM', 'Ollama', 'Python', 'Linux'],
      features: [
        'On-premise deployment of large-scale language models (LLaMA/Qwen) via high-performance Linux infrastructure',
        'Privacy-first AI environment ensuring zero-data-leakage through localized semantic processing',
        'Modular LLM orchestration layer for advanced model tuning and bespoke system prompt engineering'
      ],
      liveDemo: null,
      sourceCode: 'https://github.com/Manju1303'
    },
    p6: {
      title: 'JKKM MESS ERP',
      category: 'Full-Stack & Systems',
      subtitle: 'AI-Powered Mess Management ERP',
      tech: ['Next.js', 'FastAPI', 'PostgreSQL', 'AI'],
      features: [
        'Smart ERP platform managing daily student attendance, meal consumption, and inventory forecasting',
        'Predictive consumption model reducing food wastage and optimizing mess operations',
        'Real-time administrative control panel with automated report generation'
      ],
      liveDemo: null,
      sourceCode: 'https://github.com/Manju1303'
    },
    p7: {
      title: 'AIR CANVA',
      category: 'Computer Vision',
      subtitle: 'Zero-Touch Spatial Canvas',
      tech: ['JavaScript', 'MediaPipe', 'Canvas API'],
      features: [
        'Immersive zero-touch interface utilizing Computer Vision and MediaPipe for spatial creativity',
        'Real-time finger tracking and gesture recognition with low-latency rendering',
        'Innovative digital canvas experience driven by AI-powered human-computer interaction'
      ],
      liveDemo: '#',
      sourceCode: 'https://github.com/Manju1303'
    },
    p8: {
      title: 'THEFT DETECTION SYSTEM',
      category: 'Computer Vision',
      subtitle: 'Real-Time Threat Monitor',
      tech: ['Python', 'OpenCV', 'TensorFlow'],
      features: [
        'Real-time suspicious activity monitoring and automated threat detection',
        'Intelligent video stream analysis utilizing custom-trained CV models',
        'Automated security alerting system for critical perimeter monitoring'
      ],
      liveDemo: '#',
      sourceCode: 'https://github.com/Manju1303'
    },
    p9: {
      title: 'LUCID OCR',
      category: 'AI & Computer Vision',
      subtitle: 'High-Accuracy AI OCR & NLP',
      tech: ['Python', 'Tesseract', 'OpenCV'],
      features: [
        'High-accuracy AI OCR engine for instant multi-format text extraction',
        'Proprietary NLP-enhanced post-processing for document sanitization',
        'Lightweight, privacy-focused localized text recognition pipeline'
      ],
      liveDemo: null,
      sourceCode: 'https://github.com/Manju1303'
    },
    p10: {
      title: 'AI HUMANIZER',
      category: 'AI & NLP',
      subtitle: 'Linguistic Syntax Restructuring',
      tech: ['TypeScript', 'NLP', 'AI'],
      features: [
        'Proprietary NLP engine utilizing advanced linguistic modeling to neutralize AI-generated syntax',
        'Dynamic semantic restructuring to achieve human-like stylistic variation while maintaining core intent',
        'Context-aware content transformation designed to optimize readability and bypass automated detection'
      ],
      liveDemo: null,
      sourceCode: 'https://github.com/Manju1303'
    },
    p11: {
      title: 'FITNESS TRACKER',
      category: 'Health & Full-Stack',
      subtitle: 'Biometric Health Analytics',
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
  // TECH STACK HIGHLIGHT ENGINE
  // =========================================================================
  const stackPills = document.querySelectorAll('.stack-pill');
  stackPills.forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      const targetTech = pill.getAttribute('data-tech').toLowerCase();

      projectCards.forEach(card => {
        const cardTags = Array.from(card.querySelectorAll('.card-tags span')).map(s => s.textContent.toLowerCase());
        if (cardTags.some(tag => tag.includes(targetTech))) {
          card.classList.add('highlighted');
        }
      });
    });

    pill.addEventListener('mouseleave', () => {
      projectCards.forEach(card => card.classList.remove('highlighted'));
    });
  });

  // =========================================================================
  // TERMINAL CLI PARSER & EASTER EGGS (PRD SECTION 18-21)
  // =========================================================================
  const cmdPaletteBtn = document.getElementById('cmdPaletteBtn');
  const terminalOverlay = document.getElementById('terminalOverlay');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const termPrompt = document.getElementById('termPrompt');
  const termModeTitle = document.getElementById('termModeTitle');

  if (cmdPaletteBtn) cmdPaletteBtn.addEventListener('click', toggleTerminal);

  window.toggleTerminal = function() {
    if (terminalOverlay.classList.contains('active')) closeTerminal();
    else {
      terminalOverlay.classList.add('active');
      terminalInput.focus();
      playMechanicalKeySound();
    }
  };

  window.closeTerminal = function() {
    if (terminalOverlay) terminalOverlay.classList.remove('active');
  };

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim();
        if (cmd) {
          state.commandHistory.push(cmd);
          state.historyIndex = state.commandHistory.length;
          executeCommand(cmd);
          terminalInput.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        if (state.historyIndex > 0) {
          state.historyIndex--;
          terminalInput.value = state.commandHistory[state.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (state.historyIndex < state.commandHistory.length - 1) {
          state.historyIndex++;
          terminalInput.value = state.commandHistory[state.historyIndex] || '';
        } else {
          state.historyIndex = state.commandHistory.length;
          terminalInput.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        handleTabAutocomplete(terminalInput);
      }
    });
  }

  const availableCmds = ['help', 'about', 'whoami', 'projects', 'ai', 'agents', 'llm', 'rag', 'skills', 'stack', 'journey', 'github', 'linkedin', 'contact', 'neofetch', 'sudo hire manjunath', 'matrix', 'hack', 'mode linux', 'mode cmd', 'clear', 'cls', 'exit'];

  function handleTabAutocomplete(input) {
    const val = input.value.toLowerCase().trim();
    if (!val) return;
    const match = availableCmds.find(c => c.startsWith(val));
    if (match) {
      input.value = match;
    }
  }

  function executeCommand(cmd) {
    const currentPrompt = state.cmdMode === 'cmd' ? 'C:\\Manjunath\\Portfolio>' : 'mj@manjunath:~$';
    appendTermLine(`${currentPrompt} ${cmd}`, 'cmd-user');
    const cleanCmd = cmd.toLowerCase().trim();

    if (cleanCmd === 'help') {
      appendTermLine('Supported Commands: help, about, whoami, projects, ai, stack, journey, github, contact, neofetch, sudo hire manjunath, matrix, hack, mode linux, mode cmd, clear, exit', 'cmd-info');
    } else if (cleanCmd === 'neofetch') {
      appendTermLine('MANJUNATH@PORTFOLIO', 'cmd-highlight');
      appendTermLine('-------------------', 'cmd-highlight');
      appendTermLine('OS: Manjunath Portfolio OS v3.0 (x86_64)', '');
      appendTermLine('ROLE: AI Engineer & Agentic Coder', 'cmd-info');
      appendTermLine('FOCUS: LLM RAG, Multi-Agent Systems, Computer Vision', '');
      appendTermLine('PROJECTS: 11 (AURORA, MEMORA, HEALTHGUARD AI, SENTINEL...)', '');
      appendTermLine('STATUS: ONLINE ●', 'cmd-info');
    } else if (cleanCmd === 'sudo hire manjunath') {
      appendTermLine('Checking authorization...', 'cmd-info');
      setTimeout(() => {
        appendTermLine('100% ACCESS GRANTED. Good choice. 🚀', 'cmd-highlight');
      }, 300);
    } else if (cleanCmd === 'matrix') {
      appendTermLine('Wake up, Neo... The Matrix has you. 🟢', 'cmd-info');
    } else if (cleanCmd === 'hack') {
      appendTermLine('Access denied. Nice try. 😄', 'cmd-warn');
    } else if (cleanCmd === 'mode linux') {
      state.cmdMode = 'linux';
      termPrompt.textContent = 'mj@manjunath:~$';
      termModeTitle.textContent = 'MJ_MANJUNATH_CLI_v3.0 [LINUX MODE]';
      appendTermLine('Switched prompt mode to Linux (mj@manjunath:~$)', 'cmd-info');
    } else if (cleanCmd === 'mode cmd') {
      state.cmdMode = 'cmd';
      termPrompt.textContent = 'C:\\Manjunath\\Portfolio>';
      termModeTitle.textContent = 'MJ_MANJUNATH_CLI_v3.0 [CMD MODE]';
      appendTermLine('Switched prompt mode to Windows CMD (C:\\Manjunath\\Portfolio>)', 'cmd-info');
    } else if (cleanCmd === 'about' || cleanCmd === 'whoami') {
      appendTermLine('Manjunath — AI Engineer & Data Science Professional (B.Tech JKKMCT).', 'cmd-highlight');
      appendTermLine('"I DON\'T JUST USE AI. I BUILD SYSTEMS AROUND IT."', 'cmd-info');
    } else if (cleanCmd === 'projects' || cleanCmd === 'work') {
      scrollToSection('projects');
      closeTerminal();
    } else if (cleanCmd === 'ai' || cleanCmd === 'agents' || cleanCmd === 'llm' || cleanCmd === 'rag') {
      scrollToSection('ai-systems');
      closeTerminal();
    } else if (cleanCmd === 'skills' || cleanCmd === 'stack') {
      scrollToSection('stack');
      closeTerminal();
    } else if (cleanCmd === 'journey') {
      scrollToSection('journey');
      closeTerminal();
    } else if (cleanCmd === 'contact' || cleanCmd === 'github' || cleanCmd === 'linkedin') {
      scrollToSection('contact');
      closeTerminal();
    } else if (cleanCmd === 'clear' || cleanCmd === 'cls') {
      terminalOutput.innerHTML = '';
    } else if (cleanCmd === 'exit') {
      closeTerminal();
    } else {
      appendTermLine(`Command '${cmd}' not recognized. Type 'help' for available commands.`, 'cmd-warn');
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

    const particlesCount = 300;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 22;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
      size: 0.032,
      color: 0xd6a928,
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

    window.addEventListener('mousemove', (e) => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
      particlesMesh.rotation.x = mouseY;
      particlesMesh.rotation.y = mouseX;
    });

    function animate() {
      requestAnimationFrame(animate);
      if (isVisible) {
        particlesMesh.rotation.y += 0.0006;
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
