/* ==========================================================================
   MANJUNATH — DEDICATED 75% RGB MECHANICAL KEYBOARD & MONITOR ENGINE
   Desktop Display Screen Switcher, WebAudio Mechanical Switches,
   RGB Lighting Modes, OLED Panel Telemetry & Real-Time Keyboard Input Pipeline
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  if (window.lucide) window.lucide.createIcons();

  const state = {
    rgbEnabled: true,
    rgbMode: 'rainbow',
    audioEnabled: true,
    soundProfile: 'thock',
    keyPressCount: 0,
    typedText: '',
    activeView: 'about'
  };

  // DOM Elements
  const body = document.body;
  const oledKey = document.getElementById('oledKey');
  const oledCode = document.getElementById('oledCode');
  const oledRgb = document.getElementById('oledRgb');
  const oledCount = document.getElementById('oledCount');
  const typedDisplay = document.getElementById('typedTextDisplay');
  const rgbSelect = document.getElementById('rgbModeSelect');
  const rgbToggleBtn = document.getElementById('rgbToggleBtn');
  const soundSelect = document.getElementById('soundProfileSelect');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const clearBtn = document.getElementById('clearTextBtn');
  const screenClock = document.getElementById('screenClock');

  // Monitor Views & Tabs
  const navTabs = document.querySelectorAll('.nav-tab');
  const views = {
    about: document.getElementById('viewAbout'),
    work: document.getElementById('viewWork'),
    stack: document.getElementById('viewStack'),
    contact: document.getElementById('viewContact'),
    terminal: document.getElementById('viewTerminal')
  };

  // Initialize Modules
  initCustomCursor();
  initParticleBackground();
  initClock();
  initMonitorTabs();
  initRGBControls();
  initAudioEngine();
  initKeyboardListeners();
  initMonitorTerminal();

  // =========================================================================
  // 1. MONITOR VIEW SWITCHER LOGIC
  // =========================================================================
  function switchMonitorView(viewName) {
    if (!views[viewName]) return;
    state.activeView = viewName;

    // Update active tab button
    navTabs.forEach((tab) => {
      if (tab.getAttribute('data-view') === viewName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update active view panel
    Object.keys(views).forEach((vKey) => {
      if (views[vKey]) {
        if (vKey === viewName) {
          views[vKey].classList.add('active');
        } else {
          views[vKey].classList.remove('active');
        }
      }
    });

    // Update OLED status
    if (oledRgb) oledRgb.textContent = viewName.toUpperCase();
  }

  function initMonitorTabs() {
    navTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const viewName = tab.getAttribute('data-view');
        switchMonitorView(viewName);
        playMechanicalKeySound();
      });
    });
  }

  function initClock() {
    function updateClock() {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      if (screenClock) screenClock.textContent = timeStr;
    }
    setInterval(updateClock, 1000);
    updateClock();
  }

  // =========================================================================
  // 2. CUSTOM CURSOR ENGINE
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

    const hoverables = 'button, select, .keykey, a, input, .nav-tab, .work-card, .stack-box';
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
  // 3. THREE.JS PARTICLES BACKGROUND
  // =========================================================================
  function initParticleBackground() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const count = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const baseColor = new THREE.Color(0xd6a928);
    const cyanColor = new THREE.Color(0x00f0ff);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const mixColor = Math.random() > 0.5 ? baseColor : cyanColor;
      colors[i * 3] = mixColor.r;
      colors[i * 3 + 1] = mixColor.g;
      colors[i * 3 + 2] = mixColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    function animate() {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0004;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // =========================================================================
  // 4. WEBAUDIO MECHANICAL SWITCH SYNTHESIZER
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

      if (state.soundProfile === 'thock') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.09);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now); osc.stop(now + 0.11);
      } else if (state.soundProfile === 'clicky') {
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'square';
        osc1.frequency.setValueAtTime(800, now);
        osc1.frequency.exponentialRampToValueAtTime(150, now + 0.04);
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc1.connect(gain1); gain1.connect(ctx.destination);
        osc1.start(now); osc1.stop(now + 0.05);
      } else if (state.soundProfile === 'silent') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(85, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.07);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now); osc.stop(now + 0.08);
      } else if (state.soundProfile === 'creamy') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now); osc.stop(now + 0.1);
      }
    } catch (e) {}
  }

  // =========================================================================
  // 5. RGB CONTROLS ENGINE
  // =========================================================================
  function initRGBControls() {
    if (rgbSelect) {
      rgbSelect.addEventListener('change', (e) => {
        state.rgbMode = e.target.value;
        body.className = body.className.replace(/rgb-mode-\w+/g, '');
        body.classList.add(`rgb-mode-${state.rgbMode}`);
      });
    }

    if (rgbToggleBtn) {
      rgbToggleBtn.addEventListener('click', () => {
        state.rgbEnabled = !state.rgbEnabled;
        if (state.rgbEnabled) {
          body.classList.remove('rgb-off');
          rgbToggleBtn.classList.add('active');
          rgbToggleBtn.querySelector('span').textContent = 'RGB ON';
        } else {
          body.classList.add('rgb-off');
          rgbToggleBtn.classList.remove('active');
          rgbToggleBtn.querySelector('span').textContent = 'RGB OFF';
        }
      });
    }

    if (soundSelect) {
      soundSelect.addEventListener('change', (e) => {
        state.soundProfile = e.target.value;
        playMechanicalKeySound();
      });
    }

    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', () => {
        state.audioEnabled = !state.audioEnabled;
        if (state.audioEnabled) {
          audioToggleBtn.classList.add('active');
          if (audioIcon) audioIcon.setAttribute('data-lucide', 'volume-2');
        } else {
          audioToggleBtn.classList.remove('active');
          if (audioIcon) audioIcon.setAttribute('data-lucide', 'volume-x');
        }
        if (window.lucide) window.lucide.createIcons();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        state.typedText = '';
        if (typedDisplay) typedDisplay.textContent = '';
      });
    }
  }

  // =========================================================================
  // 6. KEYBOARD LISTENERS & REAL-TIME INPUT ENGINE
  // =========================================================================
  function initKeyboardListeners() {
    const keys = document.querySelectorAll('.keykey');
    const keyMap = new Map();

    keys.forEach((keyEl) => {
      const dataKey = keyEl.getAttribute('data-key');
      if (dataKey) {
        keyMap.set(dataKey, keyEl);
      }

      // Mouse click on keycap
      keyEl.addEventListener('mousedown', (e) => {
        e.preventDefault();
        triggerKeyAction(dataKey, keyEl);
      });
    });

    // Physical keydown event
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;

      const code = e.code;
      const keyEl = keyMap.get(code);

      if (keyEl) {
        keyEl.classList.add('active');
        triggerKeyAction(code, keyEl, e);
      } else {
        triggerKeyAction(e.key, null, e);
      }
    });

    // Physical keyup event
    window.addEventListener('keyup', (e) => {
      const code = e.code;
      const keyEl = keyMap.get(code);
      if (keyEl) {
        keyEl.classList.remove('active');
      }
    });

    // Trigger keypress sound, animation, OLED, & display input
    function triggerKeyAction(codeKey, keyEl, evt = null) {
      if (evt && (codeKey === 'Tab' || codeKey === 'Space' || codeKey.startsWith('Arrow'))) {
        evt.preventDefault();
      }

      playMechanicalKeySound();

      if (keyEl) {
        keyEl.classList.add('active');
        setTimeout(() => {
          if (!evt) keyEl.classList.remove('active');
        }, 120);
      }

      // Key shortcut mappings to Monitor Views:
      if (codeKey === 'KeyA') switchMonitorView('about');
      if (codeKey === 'KeyW') switchMonitorView('work');
      if (codeKey === 'KeyS') switchMonitorView('stack');
      if (codeKey === 'KeyC') switchMonitorView('contact');
      if (codeKey === 'KeyT') switchMonitorView('terminal');

      // Update Key press counter & OLED
      state.keyPressCount++;
      if (oledCount) oledCount.textContent = state.keyPressCount;

      let displayKeyLabel = codeKey.replace('Key', '').replace('Digit', '');
      if (codeKey === 'Space') displayKeyLabel = 'SPACE';
      if (oledKey) oledKey.textContent = displayKeyLabel.toUpperCase();
      if (oledCode) oledCode.textContent = evt ? evt.keyCode || '00' : '99';

      handleTextInput(codeKey, evt ? evt.key : null);
    }

    function handleTextInput(code, char) {
      if (!typedDisplay) return;

      if (code === 'Backspace') {
        state.typedText = state.typedText.slice(0, -1);
      } else if (code === 'Enter') {
        state.typedText += '\nMJ_KEYBOARD> ';
      } else if (code === 'Space') {
        state.typedText += ' ';
      } else if (code === 'Tab') {
        state.typedText += '  ';
      } else if (code === 'Escape') {
        state.typedText = '';
      } else if (char && char.length === 1) {
        state.typedText += char;
      } else if (code.startsWith('Key')) {
        state.typedText += code.replace('Key', '');
      } else if (code.startsWith('Digit')) {
        state.typedText += code.replace('Digit', '');
      }

      typedDisplay.textContent = state.typedText;
    }
  }

  // =========================================================================
  // 7. MONITOR TERMINAL LOGIC
  // =========================================================================
  function initMonitorTerminal() {
    const termInput = document.getElementById('monitorTermInput');
    const termLog = document.getElementById('monitorTermLog');
    if (!termInput || !termLog) return;

    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = termInput.value.trim().toLowerCase();
        if (!cmd) return;

        const cmdLine = document.createElement('div');
        cmdLine.className = 'line';
        cmdLine.innerHTML = `<span class="prompt">C:\\Manjunath&gt;</span> ${cmd}`;
        termLog.appendChild(cmdLine);

        let resText = '';
        if (cmd === 'help') {
          resText = 'Available commands: about, work, stack, contact, clear';
        } else if (cmd === 'about') {
          switchMonitorView('about');
          resText = 'Switched to About Me screen.';
        } else if (cmd === 'work' || cmd === 'projects') {
          switchMonitorView('work');
          resText = 'Switched to Work / Projects screen.';
        } else if (cmd === 'stack') {
          switchMonitorView('stack');
          resText = 'Switched to Tech Stack screen.';
        } else if (cmd === 'contact') {
          switchMonitorView('contact');
          resText = 'Switched to Contact screen.';
        } else if (cmd === 'clear') {
          termLog.innerHTML = '';
          termInput.value = '';
          return;
        } else {
          resText = `Command not recognized: ${cmd}. Type 'help' for commands.`;
        }

        const resLine = document.createElement('div');
        resLine.className = 'line cyan';
        resLine.textContent = resText;
        termLog.appendChild(resLine);

        termInput.value = '';
        termLog.scrollTop = termLog.scrollHeight;
      }
    });
  }

});
