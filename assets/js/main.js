/* ============================================================
   MOMOTTS — GOLDEN HOUR STUDIO · Motion & Speech Engine
   Distinct from MomoStack: no preloader curtain, no custom
   cursor, no magnetic buttons. Instead: wipe reveals, live
   canvas waveforms, and a REAL Web-Speech-API playground.
   ============================================================ */
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onHome = !!document.getElementById('homeHero');

  /* ---------- Scroll tape (progress) ---------- */
  const tape = document.querySelector('.scroll-tape');
  if (tape) {
    const paint = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      tape.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    };
    addEventListener('scroll', paint, { passive: true });
    addEventListener('resize', paint);
    paint();
  }

  /* ---------- Header behaviour ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    let lastY = 0;
    addEventListener('scroll', () => {
      const y = scrollY;
      header.classList.toggle('is-scrolled', y > 24);
      if (!document.querySelector('.mobile-sheet.is-open')) {
        header.classList.toggle('is-hidden', y > 380 && y > lastY);
      }
      lastY = y;
    }, { passive: true });
  }

  /* ---------- Mobile sheet ---------- */
  const burger = document.querySelector('.burger');
  const sheet = document.querySelector('.mobile-sheet');
  if (burger && sheet) {
    const close = () => {
      burger.setAttribute('aria-expanded', 'false');
      sheet.classList.remove('is-open');
      document.body.style.overflow = '';
      header.classList.remove('is-hidden');
    };
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') !== 'true';
      burger.setAttribute('aria-expanded', String(open));
      sheet.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    sheet.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ---------- Wipe reveals (threshold near zero: clipped slivers must fire) ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.001, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Hero entrance ---------- */
  const hero = document.querySelector('.hero');
  if (hero) requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-ready')));

  /* ---------- Counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.count.split('.')[1] || '').length;
      const dur = 1400;
      const t0 = performance.now();
      const tick = now => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick); else el.textContent = el.dataset.count;
      };
      if (prefersReduced) { el.textContent = el.dataset.count; return; }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => cio.observe(el));

  /* ---------- Canvas waveform (shared, idle + speech-reactive) ---------- */
  function makeWave(canvas, opts) {
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(devicePixelRatio || 1, 2);
    let w = 0, h = 0, bars = [], raf = 0, energy = 0, t = 0;
    const cfg = Object.assign({ barW: 4, gap: 4, color: '#FF4D1C', color2: '#FF2E93', idle: 0.16 }, opts);

    function size() {
      const r = canvas.getBoundingClientRect();
      w = Math.max(r.width, 10); h = Math.max(r.height, 10);
      canvas.width = w * DPR; canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const n = Math.floor(w / (cfg.barW + cfg.gap));
      bars = Array.from({ length: n }, (_, i) => ({ seed: Math.random() * Math.PI * 2, x: i * (cfg.barW + cfg.gap) }));
    }
    function draw() {
      t += 0.045;
      ctx.clearRect(0, 0, w, h);
      const mid = h / 2;
      bars.forEach((b, i) => {
        const idle = cfg.idle + 0.1 * Math.abs(Math.sin(t + b.seed) * Math.sin(t * 0.6 + i * 0.35));
        const amp = Math.min(1, idle + energy * (0.55 + 0.45 * Math.sin(t * 3 + b.seed * 2)));
        const bh = Math.max(2, amp * (h - 8));
        const mix = (Math.sin(i * 0.12 + t * 0.5) + 1) / 2;
        ctx.fillStyle = mix > 0.62 ? cfg.color2 : cfg.color;
        ctx.globalAlpha = 0.32 + amp * 0.68;
        const x = b.x, y = mid - bh / 2;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, cfg.barW, bh, cfg.barW / 2);
        else ctx.rect(x, y, cfg.barW, bh);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      energy = Math.max(0, energy - 0.028); // decay
      raf = requestAnimationFrame(draw);
    }
    size();
    addEventListener('resize', size);
    if (prefersReduced) { energy = 0; cfg.idle = 0.12; draw(); cancelAnimationFrame(raf); /* single frame */ }
    else draw();
    return {
      pulse(v) { energy = Math.min(1, Math.max(energy, v)); },
      set color(c) { cfg.color = c; }
    };
  }
  window.__momoWaves = [];
  document.querySelectorAll('canvas[data-wave]').forEach(c => window.__momoWaves.push(makeWave(c)));
  const pulseAll = v => window.__momoWaves.forEach(wv => wv.pulse(v));

  /* ============================================================
     WEB SPEECH API PLAYGROUND — real synthesis in the browser
     ============================================================ */
  const pgCard = document.getElementById('playground');
  if (pgCard) {
    const ta = document.getElementById('pgText');
    const sel = document.getElementById('pgVoice');
    const speed = document.getElementById('pgSpeed');
    const speedVal = document.getElementById('pgSpeedVal');
    const playBtn = document.getElementById('pgPlay');
    const readout = document.getElementById('pgReadout');
    const synth = window.speechSynthesis;

    let voices = [];
    let tokens = [];
    let charIndex = -1;

    const DEFAULT_TEXT = 'Momo TTS turns your words into warm, human sound — entirely on your device. No cloud. No waiting. Just voice.';

    const pickVoices = list => {
      const en = list.filter(v => /^en(-|_)?/i.test(v.lang));
      const rest = list.filter(v => !/^en(-|_)?/i.test(v.lang)).slice(0, 6);
      return [...en, ...rest];
    };

    const fillVoices = () => {
      if (!synth) return;
      voices = pickVoices(synth.getVoices());
      sel.innerHTML = '';
      voices.forEach((v, i) => {
        const o = document.createElement('option');
        o.value = String(i);
        o.textContent = `${v.name} · ${v.lang}`;
        sel.appendChild(o);
      });
      // prefer a non-default English voice for character
      const nice = voices.findIndex(v => /en/i.test(v.lang) && /female|zira|samantha|google uk english female|aria|libby/i.test(v.name));
      if (nice > -1) sel.value = String(nice);
    };
    if (synth) { fillVoices(); synth.addEventListener('voiceschanged', fillVoices); }
    else pgCard.classList.add('no-tts');

    speed.addEventListener('input', () => { speedVal.textContent = Number(speed.value).toFixed(1) + '×'; });

    const tokenize = () => {
      const text = (ta.value.trim() || DEFAULT_TEXT);
      readout.innerHTML = '';
      tokens = [];
      text.split(/\s+/).forEach(word => {
        const span = document.createElement('span');
        span.className = 'w';
        span.textContent = word;
        span.dataset.lower = word.toLowerCase().replace(/[^\p{L}\p{N}']/gu, '');
        readout.appendChild(span);
        readout.appendChild(document.createTextNode(' '));
        tokens.push({ el: span, word: span.dataset.lower });
      });
      return text;
    };
    ta.addEventListener('input', tokenize);
    tokenize();

    const resetMarks = () => tokens.forEach(t => t.el.classList.remove('spoken', 'speaking'));

    const stop = () => {
      if (synth) synth.cancel();
      playBtn.classList.remove('playing');
      playBtn.querySelector('span').textContent = 'Play it';
      resetMarks();
      pulseAll(0.12);
    };
    playBtn.addEventListener('click', () => {
      if (!synth) return;
      if (playBtn.classList.contains('playing')) { stop(); return; }
      const text = tokenize();
      const u = new SpeechSynthesisUtterance(text);
      const v = voices[Number(sel.value)] || voices[0];
      if (v) u.voice = v;
      u.rate = Number(speed.value);
      u.pitch = 1;
      charIndex = -1;
      u.onboundary = e => {
        if (e.name && e.name !== 'word') return;
        charIndex = e.charIndex;
        const upto = text.slice(0, e.charIndex + (e.charLength || 0)).toLowerCase();
        let hit = false;
        tokens.forEach(t => {
          if (hit) return;
          const spokenSoFar = t.el.dataset.done === '1';
          if (!spokenSoFar && upto.includes(t.word) && upto.lastIndexOf(t.word) + t.word.length >= e.charIndex) {
            // approximate: mark words whose cumulative position is behind the caret
          }
        });
        // simpler robust pass: walk tokens tracking cumulative offset
        let offset = 0;
        let speakingSet = false;
        tokens.forEach(t => {
          const start = text.toLowerCase().indexOf(t.word, offset);
          if (start === -1) return;
          offset = start + t.word.length;
          t.el.classList.remove('speaking');
          if (offset <= e.charIndex) { t.el.classList.add('spoken'); t.el.classList.remove('speaking'); }
          else if (!speakingSet) { t.el.classList.add('speaking'); speakingSet = true; }
          else { t.el.classList.remove('spoken'); }
        });
        pulseAll(0.55 + Math.random() * 0.4);
      };
      u.onend = () => { stop(); tokens.forEach(t => { t.el.classList.add('spoken'); t.el.classList.remove('speaking'); }); };
      u.onerror = stop;
      playBtn.classList.add('playing');
      playBtn.querySelector('span').textContent = 'Stop';
      resetMarks();
      synth.speak(u);
    });

    /* Voice hub previews */
    document.querySelectorAll('.v-preview').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!synth) return;
        synth.cancel();
        const u = new SpeechSynthesisUtterance(btn.dataset.say || 'Hello from Momo TTS.');
        u.rate = Number(btn.dataset.rate || 1);
        u.pitch = Number(btn.dataset.pitch || 1);
        btn.classList.add('is-busy');
        const done = () => btn.classList.remove('is-busy');
        u.onend = done; u.onerror = done;
        synth.speak(u);
        pulseAll(0.6);
      });
    });

    /* Simulated dialogue strip */
    const dlg = document.querySelectorAll('.mock-line');
    if (dlg.length) {
      let idx = 0;
      const cycle = () => {
        dlg.forEach(l => l.classList.remove('is-speaking'));
        dlg[idx % dlg.length].classList.add('is-speaking');
        idx++;
      };
      cycle();
      if (!prefersReduced) setInterval(cycle, 2600);
    }
  }

  /* ---------- Deck button (hero console) ---------- */
  const deckBtn = document.getElementById('deckBtn');
  if (deckBtn && 'speechSynthesis' in window) {
    const icon = deckBtn.querySelector('svg');
    const PLAY = '<path d="M8 5.14v13.72c0 .8.87 1.3 1.56.9l11-6.86a1.05 1.05 0 0 0 0-1.8l-11-6.86A1.05 1.05 0 0 0 8 5.14z"/>';
    const STOP = '<rect x="6" y="6" width="12" height="12" rx="2"/>';
    deckBtn.addEventListener('click', () => {
      const synth = window.speechSynthesis;
      if (deckBtn.dataset.playing === '1') {
        synth.cancel();
        deckBtn.dataset.playing = '0';
        icon.innerHTML = PLAY;
        return;
      }
      const lines = [
        'Welcome to Momo Studio. Every word you type, stays on this device.',
        'Twelve neural voices. Zero cloud round trips. One very smug mascot.',
        'This is the deck. In the app, it speaks with Piper and Kokoro — fully offline.'
      ];
      const u = new SpeechSynthesisUtterance(lines[Math.floor(Math.random() * lines.length)]);
      u.rate = 1; u.pitch = 1;
      u.onend = () => { deckBtn.dataset.playing = '0'; icon.innerHTML = PLAY; };
      deckBtn.dataset.playing = '1';
      icon.innerHTML = STOP;
      synth.speak(u);
      const iv = setInterval(() => {
        if (deckBtn.dataset.playing !== '1') { clearInterval(iv); pulseAll(0.12); return; }
        pulseAll(0.5 + Math.random() * 0.5);
      }, 120);
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('#yearNow, .yearNow').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Mascot mood switcher ---------- */
  const moodChips = document.querySelectorAll('.mood-chip');
  if (moodChips.length) {
    const shot = document.getElementById('moodShot');
    const cap = document.getElementById('moodCap');
    const quote = document.getElementById('moodQuote');
    moodChips.forEach(chip => {
      chip.addEventListener('click', () => {
        moodChips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        const src = chip.dataset.src, name = chip.dataset.name, q = chip.dataset.quote;
        const img = shot.querySelector('img');
        img.classList.add('is-swapping');
        quote.classList.add('is-swapping');
        setTimeout(() => {
          img.src = src;
          cap.textContent = name;
          quote.textContent = q;
          img.classList.remove('is-swapping');
          quote.classList.remove('is-swapping');
        }, 220);
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(o => {
        o.classList.remove('is-open');
        o.querySelector('.faq-a').style.maxHeight = '0px';
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Copy buttons ---------- */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(btn.dataset.copy || btn.previousElementSibling.textContent.trim()); }
      catch {
        const r = document.createRange();
        const code = btn.previousElementSibling;
        r.selectNodeContents(code);
        const s = getSelection(); s.removeAllRanges(); s.addRange(r);
        document.execCommand('copy'); s.removeAllRanges();
      }
      const old = btn.textContent;
      btn.textContent = 'Copied'; btn.classList.add('done');
      setTimeout(() => { btn.textContent = old; btn.classList.remove('done'); }, 1600);
    });
  });
})();
