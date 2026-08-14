/* ==========================================================================
   MANJUNATH — PORTFOLIO-ZXC EXACT BEHAVIOR & INTERACTION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  if (window.lucide) {
    window.lucide.createIcons();
  }

  const state = {
    audioEnabled: true,
    soundProfile: 'thock'
  };

  // THREE.JS PARTICLES BACKGROUND
  initParticleBackground();

  // CLOCKWORK LOADER
  initClockworkLoader();

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

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.11);
      } else if (state.soundProfile === 'clicky') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(85, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.07);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {}
  }

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

      if (progress < 50) status.textContent = 'CALIBRATING AMBER BACKLIGHT...';
      else if (progress < 90) status.textContent = 'SYNCHRONIZING DESK DIALS...';
      else status.textContent = 'KEYBOARD READY!';

      if (progress >= 100) clearInterval(interval);
    }, 90);

    enterBtn.addEventListener('click', () => {
      loader.classList.add('loaded');
      getAudioContext();
      playMechanicalKeySound();
    });
  }

  // KEYBOARD MAP & ACTUATION
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
      case 'KeyA':
        scrollToSection('about');
        break;
      case 'KeyZ':
        scrollToSection('projects');
        break;
      case 'KeyX':
        scrollToSection('skills');
        break;
      case 'KeyC':
        scrollToSection('contact');
        break;
      case 'Escape':
        scrollToSection('hero');
        closeTerminal();
        closeProjectModal();
        break;
      case 'Space':
        triggerRgbWave();
        break;
      default:
        break;
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

  // AUDIO PROFILE & CONTROLS
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

  // DESK DECOR INTERACTIVITY (Dumplings & Mouse)
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

  // PROJECT DATA & MODALS
  const projectData = {
    p1: {
      title: 'RAG & LLM Context Engine',
      category: 'AI & LLM Architecture',
      tech: ['Python', 'ChromaDB', 'LangChain', 'FastAPI'],
      description: 'Production Retrieval-Augmented Generation engine utilizing Chroma Vector DB and semantic embeddings for high-precision document QA.',
      github: 'https://github.com/Manju1303/RAG-LLM-Context-Engine'
    },
    p2: {
      title: 'Real-Time Pose & Landmark Analyzer',
      category: 'Computer Vision & ML',
      tech: ['OpenCV', 'MediaPipe', 'Python', 'NumPy'],
      description: 'Real-time computer vision tracking framework using MediaPipe and OpenCV for 33-point skeletal landmark detection.',
      github: 'https://github.com/Manju1303/Pose-Landmark-Analyzer'
    },
    p3: {
      title: 'CBT Interactive Web Platform',
      category: 'Web Platform',
      tech: ['JavaScript', 'TypeScript', 'HTML5', 'CSS3'],
      description: 'Interactive web platform for cognitive behavioral exercises and real-time state tracking.',
      github: 'https://github.com/Manju1303/CBT-Interactive-Web-Platform'
    },
    p4: {
      title: 'Home Services Marketplace Platform',
      category: 'Full-Stack Engineering',
      tech: ['TypeScript', 'React', 'Node.js', 'REST API'],
      description: 'Comprehensive platform connecting users with local service professionals with instant booking.',
      github: 'https://github.com/Manju1303/Home-Services-Marketplace'
    }
  };

  window.openProjectModal = function(id) {
    const modal = document.getElementById('projectModal');
    const details = document.getElementById('modalDetails');
    const data = projectData[id];
    if (!data) return;

    details.innerHTML = `
      <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--gold-accent); margin-bottom: 6px;">${data.category}</div>
      <h2 style="font-family: var(--font-serif); font-size: 1.6rem; color: #fff; margin-bottom: 14px;">${data.title}</h2>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 20px;">${data.description}</p>
      <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 24px;">
        ${data.tech.map(t => `<span style="font-family: var(--font-mono); font-size: 0.7rem; background: rgba(212, 175, 55, 0.1); color: var(--gold-accent); padding: 3px 8px; border-radius: 3px;">${t}</span>`).join('')}
      </div>
      <a href="${data.github}" target="_blank" rel="noopener" class="contact-badge-btn" style="display: inline-flex; align-items: center; gap: 8px;">
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

  // TERMINAL ENGINE
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
    } else if (cleanCmd === 'about') {
      appendTermLine('Manjunath — AI Engineer & Data Science Professional (B.Tech JKKMCT).', 'cmd-highlight');
    } else if (cleanCmd === 'projects') {
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

  // THREE.JS PARTICLES
  function initParticleBackground() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 18;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      color: 0xd4af37,
      transparent: true,
      opacity: 0.4
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
