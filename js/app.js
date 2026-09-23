/* ══════════════════════════════════════════════════════════
   JULIA MARRO — PORTFOLIO
   Vanilla JS. GSAP + ScrollTrigger + Lenis (CDN) sólo para el movimiento con el scroll.

   ▸ TEMAS: array TRACKS. `id` = nombre del mp3 en /audio y clave en
     /data/peaks.js (los archivos conservan el nombre de la sesión, igual
     que en el sitio del disco). `soon:true` lo lista sin audio.
   ▸ FOTOS: array PHOTOS. `n` = img/g/pNN.webp (grande) y pNN-s.webp (chica).
   ══════════════════════════════════════════════════════════ */

/* Títulos, orden y créditos: los de la contratapa + el documento "creditos Bos a bsas" que pasó Julia
   (21/9). OJO con los `id`: son los nombres de archivo de la sesión y NO dicen el título —
     intro = Boston · dualipa = Dance · dilla = Pretty Boy · doin-better = Doin' Better Without You ·
     boston-a-bsas = Trusting Myself · demo1 = Forever · final-vox = Bangladesh · tango = Che Charles
   (hasta el 21/9 Dance y Trusting Myself estaban cruzados, los músicos de Pretty Boy figuraban en
   Forever, y Trusting Myself y Forever tenían el audio al revés: Julia lo corrigió escuchando el sitio). "Trusting Myself" no vino en el documento de créditos: falta que Julia los pase. */
const TRACKS = [
  { id:'intro',         title:'Boston',                   dur:53.12,  hand:['boston',299],
    crew:[['Produced & arranged','Julia Marro · Nicolas Damm'],['Mixing','Julia Marro']] },
  { id:'dualipa',       title:'Dance',                    dur:212.00, hand:['dance',351],
    crew:[['Produced & arranged','Julia Marro'],['Vocals','Alejandro Guerra Ricco'],['Mixing','Santiago Bascope · Julia Marro']] },
  { id:'dilla',         title:'Pretty Boy',               dur:213.91, hand:['pretty-boy',365],
    crew:[['Produced & arranged','Julia Marro'],['Guitar','Ariel Nuñez'],['Saxophone','Alejandro Taveras'],
          ['Percussion','Maxi Sayes'],['Vocals & lyrics','Ariel Garcia'],['Bass','Luciano Fortuny'],
          ['Mixing','Santiago Bascope'],['Mastering','Alessio De Marzo']] },
  { id:'doin-better',   title:"Doin' Better Without You", dur:154.43, hand:['doin-better',137],
    crew:[['Produced, arranged & co-written','Julia Marro'],['Co-writing & arrangement','Alex Varvar'],
          ['Vocals','Alex Varvar · Santiago Bascope'],['Mixing','Santiago Bascope'],['Mastering','Alessio De Marzo']] },
  { id:'boston-a-bsas', title:'Trusting Myself',          dur:218.67, hand:['trusting',258],
    crew:[['Production','Julia Marro']] },
  { id:'demo1',         title:'Forever',                  dur:193.27, hand:['forever',263],
    crew:[['Produced & arranged','Julia Marro'],['Vocals & lyrics','Alex Varvar'],['Mixing','Julia Marro']] },
  { id:'final-vox',     title:'Bangladesh',               dur:157.73, hand:['bangladesh',187],
    crew:[['Produced, arranged & co-written','Julia Marro'],['Vocals & co-writing','Santiago Bascope'],['Mixing','Julia Marro']] },
  { id:'tango',         title:'Che Charles',              dur:122.07, hand:['che-charles',243],
    crew:[['Produced & arranged','Julia Marro'],
          ['Sample','“Tarde” — Julio Sosa with Leopoldo Federico y su Orquesta Típica'],
          ['“Tarde” written & composed by','José Canet']] }
  /* "Buenos Aires" (9no de la contratapa) está sacado de la lista POR AHORA (pedido de Nacho, 21/9): todavía
     no hay audio. Para que vuelva: agregar la coma de arriba y descomentar. Con el mp3 en audio/buenos-aires.mp3
     y sus picos en data/peaks.js, poner `dur` y borrar `soon`.
  { id:'buenos-aires',  title:'Buenos Aires',             dur:0, soon:true, hand:['buenos-aires',268],
    crew:[] } */
];

/* el orden es el de la galería; w/h son los de la miniatura (para que no salte al cargar) */
const PHOTOS = [
  { n:'13', w:800, h:534,  alt:'Julia on drums between two beams of orange light, the Posguerra kick drum in front' },
  { n:'04', w:800, h:1422, alt:'Julia playing bass, backlit in green' },
  { n:'25', w:800, h:534,  alt:'Julia on drums in a checkered shirt, black and white' },
  { n:'06', w:800, h:1200, alt:'Julia playing bass under red light' },
  { n:'17', w:800, h:534,  alt:'Julia on bass with Posguerra, pink and purple lights' },
  { n:'07', w:800, h:1200, alt:'Julia on drums under three spotlights, black and white' },
  { n:'21', w:800, h:534,  alt:'Julia on drums under blue light' },
  { n:'18', w:800, h:1066, alt:'Julia on drums at Mermelada Indie, lit in green' },
  { n:'14', w:800, h:534,  alt:'Julia on drums, motion blur in red' },
  { n:'09', w:800, h:1200, alt:'Julia playing bass at Mermelada Indie, black and white' },
  { n:'16', w:800, h:534,  alt:'Julia on bass with a red laser across the stage' },
  { n:'20', w:800, h:1066, alt:'Julia on drums in front of the Posguerra sign, blue light' },
  { n:'12', w:800, h:534,  alt:'Julia on drums, blurred by movement, black and white' },
  { n:'22', w:800, h:1200, alt:'Julia playing bass in warm orange light' },
  { n:'15', w:800, h:534,  alt:'Julia on bass surrounded by the band, magenta light' },
  { n:'19', w:800, h:1066, alt:'Julia on drums at Mermelada Indie, purple light' },
  { n:'10', w:800, h:534,  alt:'Julia behind the Posguerra drum kit, blue stage' },
  { n:'08', w:800, h:1200, alt:'Julia on bass, a small figure in an orange glow' },
  { n:'24', w:800, h:534,  alt:'Julia on drums in low warm light' }
];

/* ══════════════ HELPERS ══════════════ */
const $  = (s,c=document)=>c.querySelector(s);
const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt = s => { s=Math.max(0,s|0); return `${(s/60)|0}:${String(s%60).padStart(2,'0')}`; };
/* Las animaciones NO miran prefers-reduced-motion: en la máquina de Nacho (efectos de
   Windows apagados) eso las apagaba todas y "no aparecía nada". Se apagan con ?motion=0 */
const MOTION = !/[?&]motion=0/.test(location.search);
const CSSV = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

/* ══════════════ NAV ══════════════ */
(() => {
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('solid', scrollY > innerHeight*0.6);
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* menú hamburguesa (mobile). Se cierra al elegir una sección, con Esc o si la ventana
     se agranda. Mientras está abierto la página no scrollea. Este listener queda
     registrado antes que el de las anclas de Lenis: primero se cierra (y Lenis vuelve
     a andar) y recién después se scrollea. */
  const burger = $('#burger'), mnav = $('#mnav'), root = document.documentElement;
  const setMenu = open => {
    root.classList.toggle('menu-open', open);
    document.body.classList.toggle('no-scroll', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mnav.setAttribute('aria-hidden', !open);
    if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start();
  };
  burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  $$('a', mnav).concat($('.nav-name')).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('menu-open')) setMenu(false); });
  matchMedia('(min-width:761px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* marca en la nav la sección que se está viendo */
  const links = $$('.nav-links a');
  const secs = links.map(a => $(a.getAttribute('href')));
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#'+e.target.id));
    });
  }, {rootMargin:'-45% 0px -50% 0px'});
  secs.forEach(s => s && io.observe(s));
  /* arriba de todo (hero/intro) no hay ninguna marcada */
  new IntersectionObserver(es => { if (es[0].isIntersecting) links.forEach(a=>a.classList.remove('on')); },
    {rootMargin:'-45% 0px -50% 0px'}).observe($('#home'));
})();

/* ══════════════ REVEAL ══════════════ */
(() => {
  if (!MOTION || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('rv-on');
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  }), {rootMargin:'0px 0px -8% 0px', threshold:.05});
  /* se observan después de armar lista y galería (abajo) */
  window.__rv = el => io.observe(el);
  $$('.rv').forEach(window.__rv);
})();

/* ══════════════ REPRODUCTOR ══════════════ */
const audio = $('#audio');
let cur = -1;               // índice del tema cargado
const rows = [];            // {el, canvas, ctx, tCur, bars}

/* Cada tema va a la lista <ol class="tl" data-cat="…"> de su `cat` (sin `cat` = 'album').
   Hoy hay una sola lista, la del disco. Si algún día se suma otra (beats, temas sueltos),
   alcanza con poner otro <ol class="tl" data-cat="beats"> en el HTML y `cat:'beats'` en
   los temas: la numeración y la cola de reproducción ya son por lista. */
const catOf = t => t.cat || 'album';
const perCat = {};          // numeración propia de cada lista

const IC_PLAY  = '<svg class="ic-play" viewBox="0 0 24 24"><polygon points="7,4 20,12 7,20"/></svg>';
const IC_PAUSE = '<svg class="ic-pause" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1.3"/><rect x="14" y="4" width="4" height="16" rx="1.3"/></svg>';

TRACKS.forEach((t,i) => {
  const li = document.createElement('li');
  li.className = 'tr' + (t.soon ? ' soon' : '');
  const sub = t.soon ? 'Soon' : t.crew[0][0];
  const cat = catOf(t), list = $(`.tl[data-cat="${cat}"]`);
  if (!list) return rows.push({ el:li, t });     // no hay lista para ese `cat`: no se muestra
  const num = perCat[cat] = (perCat[cat] || 0) + 1;
  /* `hand:[archivo, alto]` = título con la letra de Julia (img/album/t-<archivo>.webp, tinta
     negra con alfa, 1000 px de ancho). Va como <img> y NO como máscara CSS: las máscaras no
     cargan si la página se abre con doble clic (file://) y el título desaparecía. Cuando la
     fila se prende en verde, un filtro la pasa a blanco (css/album.css). */
  const title = t.hand
    ? `<strong class="hand"><img class="hk" src="img/album/t-${t.hand[0]}.webp" width="1000" height="${t.hand[1]}" alt="${t.title.replace(/"/g,'&quot;')}" draggable="false"><img class="hg" src="img/album/t-${t.hand[0]}-g.webp" width="1000" height="${t.hand[1]}" alt="" aria-hidden="true" draggable="false"></strong>`
    : `<strong>${t.title}</strong>`;
  li.innerHTML = `
    <div class="tr-top">
      <button class="tr-head" ${t.soon?'disabled aria-disabled="true"':''} aria-label="${t.soon ? '' : 'Play '}${t.title.replace(/"/g,'&quot;')}">
        <span class="tr-n"><i>${String(num).padStart(2,'0')}</i>${IC_PLAY}${IC_PAUSE}</span>
        <span class="tr-t">${title}<span>${sub}</span></span>
        <span class="tr-d">${t.soon ? '' : fmt(t.dur)}</span>
      </button>
      ${t.soon ? '' : `<button class="tr-more" aria-label="Credits: who worked on this track" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>`}
    </div>
    ${t.soon ? '' : `
    <div class="tr-body"><div class="tr-in"><div class="tr-pad">
      <div class="wave">
        <time class="w-cur">0:00</time>
        <div class="wave-c" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0" aria-valuemax="${t.dur|0}" aria-valuenow="0"><canvas></canvas></div>
        <time>${fmt(t.dur)}</time>
      </div>
      <dl class="crew">${t.crew.map(c=>`<div><dt>${c[0]}</dt><dd>${c[1]}</dd></div>`).join('')}</dl>
    </div></div></div>`}`;
  list.appendChild(li);
  const row = { el:li, t, canvas:$('canvas',li), tCur:$('.w-cur',li), slider:$('.wave-c',li), more:$('.tr-more',li) };
  rows.push(row);
  if (t.soon) return;
  row.ctx = row.canvas.getContext('2d');
  $('.tr-head',li).addEventListener('click', () => toggle(i));
  /* el "+": abre y cierra quién trabajó en el tema, sin tener que ponerlo a sonar */
  row.more.addEventListener('click', () => setOpen(row, !li.classList.contains('open')));
  bindSeek(row, i);
});

/* el cuerpo de la fila (créditos, y la onda si es el tema cargado) se ve cuando tiene .open */
function setOpen(r, open){
  r.el.classList.toggle('open', open);
  r.more.setAttribute('aria-expanded', open);
  if (open && rows[cur] === r){ requestAnimationFrame(() => draw(r, progress())); setTimeout(() => draw(r, progress()), 520); }
  /* la página cambia de alto: que ScrollTrigger vuelva a medir */
  clearTimeout(setOpen.t); setOpen.t = setTimeout(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 600);
}


/* clic afuera = cerrar: con un tema expandido, tocar en cualquier lado fuera de su rectángulo lo
   cierra, igual que la cruz. (No cuentan el mini reproductor ni los visores de fotos: son controles,
   no "afuera". Si estaba sonando sigue sonando, con la fila prendida y cerrada.) */
addEventListener('click', e => {
  if (e.target.closest && e.target.closest('.mini, .lb, .alb-lb')) return;
  rows.forEach(r => { if (r.more && r.el.classList.contains('open') && !r.el.contains(e.target)) setOpen(r, false); });
});
/* Carga un tema. `mode`:
     'open'  (clic en la fila)  la fila se prende en verde y se abre con onda + créditos
     'lit'   (siguiente/anterior, o cuando termina un tema) se prende pero queda cerrada,
             salvo que la anterior estuviera abierta: ahí se abre también, para no perder el hilo
     'quiet' (el arranque solo al abrir la página) no toca la lista: queda en "modo normal"
             y la fila recién se prende cuando el tema empieza a sonar de verdad */
function load(i, mode = 'open'){
  if (cur === i) return;
  let wasOpen = false;
  if (cur >= 0){ wasOpen = rows[cur].el.classList.contains('open'); rows[cur].el.classList.remove('on','playing'); setOpen(rows[cur], false); }
  cur = i;
  const r = rows[i];
  r.col = null;                                  // los colores de la onda cambian con la fila prendida
  audio.src = `audio/${r.t.id}.mp3`;
  $('#miniTitle').textContent = r.t.title;
  $('#miniTime').textContent = `0:00 / ${fmt(r.t.dur)}`;
  $('#miniBar').style.transform = 'scaleX(0)';
  if (mode === 'quiet') return;
  r.el.classList.add('on');
  if (mode === 'open' || wasOpen){ setOpen(r, true); requestAnimationFrame(() => draw(r, 0)); }
}
function toggle(i){
  if (cur !== i){ load(i); play(); return; }
  /* el tema ya estaba cargado pero con la fila cerrada (arranque solo, o llegó por siguiente/anterior):
     el clic la abre y, si estaba en pausa, lo pone a sonar. Nunca lo pausa: eso es con la fila abierta. */
  const r = rows[i];
  if (!r.el.classList.contains('open')){ r.el.classList.add('on'); setOpen(r, true); if (audio.paused) play(); return; }
  audio.paused ? play() : audio.pause();
}
function play(){
  stopVideos();
  const p = audio.play();
  if (p) p.catch(()=>{});
}
/* anterior / siguiente, sin salirse de la lista. "Anterior" pasados los 3 s vuelve al principio
   del mismo tema; en las puntas da la vuelta. */
function step(dir){
  if (cur < 0) return;
  if (dir < 0 && audio.currentTime > 3){ audio.currentTime = 0; if (audio.paused) play(); return; }
  const cat = catOf(TRACKS[cur]), N = TRACKS.length;
  let n = cur;
  for (let k = 0; k < N; k++){ n = (n + dir + N) % N; if (!TRACKS[n].soon && catOf(TRACKS[n]) === cat) break; }
  if (n === cur){ audio.currentTime = 0; play(); return; }
  load(n, 'lit'); play();
}
const progress = () => (cur>=0 && (audio.duration||rows[cur].t.dur)) ? audio.currentTime/(audio.duration||rows[cur].t.dur) : 0;

audio.addEventListener('play',  () => { if(cur<0) return; if (!rows[cur].el.classList.contains('on')) rows[cur].col = null; rows[cur].el.classList.add('on','playing'); mini.classList.add('show'); mini.classList.remove('paused'); $('#miniBtn').setAttribute('aria-label','Pause'); });
audio.addEventListener('pause', () => { if(cur<0) return; rows[cur].el.classList.remove('playing'); mini.classList.add('paused'); $('#miniBtn').setAttribute('aria-label','Play'); });
audio.addEventListener('timeupdate', () => {
  if (cur<0) return;
  const r = rows[cur], p = progress();
  r.tCur.textContent = fmt(audio.currentTime);
  r.slider.setAttribute('aria-valuenow', audio.currentTime|0);
  $('#miniTime').textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration||r.t.dur)}`;
  $('#miniBar').style.transform = `scaleX(${p})`;
  draw(r, p);
});
/* el disco queda encolado: termina uno, sale el siguiente que tenga audio */
audio.addEventListener('ended', () => {
  let n = cur+1;
  /* la cola no se sale de su lista */
  const cat = catOf(TRACKS[cur]);
  while (n < TRACKS.length && (TRACKS[n].soon || catOf(TRACKS[n]) !== cat)) n++;
  if (n < TRACKS.length){ load(n, 'lit'); play(); }
  else { audio.currentTime = 0; draw(rows[cur],0); }
});

const mini = $('#mini');
$('#miniBtn').addEventListener('click', () => { if(cur<0) return; audio.paused ? play() : audio.pause(); });
$('#miniPrev').addEventListener('click', () => step(-1));
$('#miniNext').addEventListener('click', () => step(1));

/* ── arranca solo: el primer tema del disco, al 50% ──
   La página pide sonar apenas carga. Si el navegador lo deja (recargas, visitas repetidas, el
   acceso directo "Portfolio Julia (con musica)"), suena de entrada. Si lo rebota —ninguna página
   puede saltearse eso, hace falta un gesto de la persona— no se muestra ningún cartel: el mini
   queda a la vista y se reintenta en silencio con cualquier señal (mouse, scroll, toque, tecla)
   hasta que el navegador acepte una, que suele ser el primer clic. Si ese clic ya elige otra
   cosa (otro tema, un video, los botones del mini), manda esa elección. Se apaga con ?autoplay=0 */
const AUTOPLAY_TRACK = 0, AUTOPLAY_VOL = .5;
/* el volumen elegido por la persona (la barrita); el fundido de entrada sube hasta acá */
const VOL = { user: AUTOPLAY_VOL };
(() => {
  const r = rows[AUTOPLAY_TRACK];
  if (!r || r.t.soon || /[?&]autoplay=0/.test(location.search)) return;
  audio.volume = AUTOPLAY_VOL;
  load(AUTOPLAY_TRACK, 'quiet');        // sin tocar la lista: al refrescar queda todo en modo normal
  const HARD = ['pointerdown','pointerup','mousedown','click','touchend','keydown'];
  const SOFT = ['mousemove','wheel','scroll','touchstart','touchmove'];
  let last = 0, done = false;
  const off = () => { done = true; HARD.concat(SOFT).forEach(t => removeEventListener(t, onSignal, true)); };
  const onSignal = e => {
    if (done) return;
    if (cur !== AUTOPLAY_TRACK || !audio.paused) return off();
    const hard = HARD.includes(e.type);
    if (hard && e.target.closest && e.target.closest('.tr-head, .vid-btn, .mini button, .mini input')) return off();
    const now = performance.now();
    if (!hard && now - last < 350) return;
    last = now;
    const q = audio.play();
    if (q) q.then(() => { stopVideos(); off(); }).catch(() => {});
  };
  const p = audio.play();
  if (p) p.catch(() => {
    mini.classList.add('show','paused');
    HARD.concat(SOFT).forEach(t => addEventListener(t, onSignal, {capture:true, passive:true}));
  });
})();

/* ── fundido de entrada ── cada vez que arranca un tema (o se reanuda), el volumen sube de 0 al
   elegido en ~0,7 s, así no pega de golpe. (En iOS el volumen no se puede tocar por JS: ahí entra directo.) */
(() => {
  let raf = 0;
  audio.addEventListener('play', () => {
    cancelAnimationFrame(raf);
    const to = VOL.user, t0 = performance.now(), D = 700;
    try { audio.volume = 0; } catch (_) { return; }
    if (audio.volume !== 0) return;              // iOS: no deja, no hay fundido
    const step = now => {
      const k = Math.min(1, (now - t0)/D);
      audio.volume = to * k * k;
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  });
  audio.addEventListener('pause', () => cancelAnimationFrame(raf));
})();

/* ── volumen ── la barrita lo regula; el parlante silencia / vuelve. En pantallas táctiles no hay
   hover, así que ahí el parlante ABRE la barrita (y tocando afuera se cierra); el silencio es
   llevarla a 0. (En iOS el volumen de un <audio> no se puede tocar por JS; queda el del teléfono.) */
(() => {
  const box = $('#miniVolBox'), mute = $('#miniMute'), vol = $('#miniVol');
  /* táctil = sin hover (o ?touch=1 para probarlo en escritorio); marca <html class="touch"> para el CSS */
  const TOUCH = matchMedia('(hover:none)').matches || /[?&]touch=1/.test(location.search);
  if (TOUCH) document.documentElement.classList.add('touch');
  audio.volume = VOL.user;
  let before = VOL.user;
  const paint = () => {
    const v = audio.muted ? 0 : VOL.user;
    vol.value = v; vol.style.setProperty('--v', (v*100).toFixed(0) + '%');
    box.classList.toggle('off', v === 0); box.classList.toggle('low', v > 0 && v < .5);
    mute.setAttribute('aria-label', TOUCH ? 'Volume' : (v === 0 ? 'Unmute' : 'Mute'));
  };
  vol.addEventListener('input', () => {
    audio.muted = false; VOL.user = +vol.value; audio.volume = VOL.user;
    if (VOL.user > 0) before = VOL.user;
    paint();
  });
  mute.addEventListener('click', e => {
    if (TOUCH){ e.stopPropagation(); mini.classList.toggle('volopen'); return; }
    if (audio.muted || VOL.user === 0){ audio.muted = false; VOL.user = before || AUTOPLAY_VOL; audio.volume = VOL.user; }
    else { before = VOL.user; audio.muted = true; }
    paint();
  });
  if (TOUCH) addEventListener('pointerdown', e => { if (!e.target.closest('.mini-vol')) mini.classList.remove('volopen'); }, true);
  paint();
})();
/* ── onda ── */
function bars(r, n){
  if (r.bars && r.bars.length === n) return r.bars;
  const src = (window.PEAKS||{})[r.t.id] || [];
  const out = new Array(n).fill(0);
  if (!src.length) return (r.bars = out.fill(30));
  for (let b=0;b<n;b++){
    const a = Math.floor(b*src.length/n), z = Math.max(a+1, Math.floor((b+1)*src.length/n));
    let m = 0; for (let k=a;k<z;k++) m = Math.max(m, src[k]);
    out[b] = m;
  }
  return (r.bars = out);
}
function draw(r, p, hover){
  const c = r.canvas; if (!c) return;
  const w = c.clientWidth, h = c.clientHeight; if (!w || !h) return;
  const dpr = Math.min(devicePixelRatio||1, 2);
  if (c.width !== Math.round(w*dpr) || c.height !== Math.round(h*dpr)){ c.width = Math.round(w*dpr); c.height = Math.round(h*dpr); }
  const x = r.ctx; x.setTransform(dpr,0,0,dpr,0,0); x.clearRect(0,0,w,h);
  const step = 4, bw = 2, n = Math.floor(w/step), bs = bars(r, n);
  /* los colores salen de las variables de la fila: en el disco (fondo verde) son otros */
  if (!r.col){ const cs = getComputedStyle(r.el), v = n => cs.getPropertyValue(n).trim(); r.col = { on:v('--wave-on')||'#8EDB2E', idle:v('--wave')||'rgba(242,239,234,.24)', hov:v('--wave-h')||'rgba(242,239,234,.6)' }; }
  for (let i=0;i<n;i++){
    const bh = Math.max(2, (bs[i]/100)*h*0.96), bx = i*step, f = (i+.5)/n;
    x.fillStyle = f <= p ? r.col.on : (hover!=null && f <= hover ? r.col.hov : r.col.idle);
    x.fillRect(bx, (h-bh)/2, bw, bh);
  }
}
function bindSeek(r, i){
  const el = r.slider; let drag = false;
  const frac = e => { const b = el.getBoundingClientRect(); return clamp((e.clientX-b.left)/b.width, 0, 1); };
  const seek = f => {
    const d = audio.duration || r.t.dur;
    audio.currentTime = f*d; r.tCur.textContent = fmt(f*d); draw(r, f);
  };
  el.addEventListener('pointerdown', e => { if (cur!==i) return; drag = true; el.setPointerCapture(e.pointerId); seek(frac(e)); });
  el.addEventListener('pointermove', e => { if (cur!==i) return; drag ? seek(frac(e)) : draw(r, progress(), frac(e)); });
  el.addEventListener('pointerup',   e => { drag = false; });
  el.addEventListener('pointerleave',() => { if (cur===i && !drag) draw(r, progress()); });
  el.addEventListener('keydown', e => {
    if (cur!==i) return;
    if (e.key==='ArrowRight'){ audio.currentTime = Math.min((audio.duration||r.t.dur)-1, audio.currentTime+5); e.preventDefault(); }
    if (e.key==='ArrowLeft'){  audio.currentTime = Math.max(0, audio.currentTime-5); e.preventDefault(); }
  });
}
addEventListener('resize', () => { if (cur>=0){ rows[cur].bars = null; draw(rows[cur], progress()); } });

/* ══════════════ VIDEOS ══════════════
   Se carga el iframe recién con el clic (nocookie): la página abre sin nada de YouTube. */
function stopVideos(){
  $$('.vid iframe').forEach(f => f.contentWindow && f.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'));
}
$$('.vid-btn').forEach(b => b.addEventListener('click', () => {
  audio.pause();
  /* abriendo el sitio con doble clic (file://) YouTube rechaza el reproductor embebido (error 153,
     necesita un referer http): ahí el video se abre en YouTube, en otra pestaña */
  if (location.protocol === 'file:'){ window.open(`https://youtu.be/${b.dataset.yt}`, '_blank', 'noopener'); return; }
  stopVideos();
  const f = document.createElement('iframe');
  f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0&enablejsapi=1&playsinline=1`;
  f.title = b.getAttribute('aria-label').replace('Play video: ','');
  f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  f.referrerPolicy = 'strict-origin-when-cross-origin';
  f.allowFullscreen = true;
  b.replaceWith(f);
}));

/* ══════════════ GALERÍA + LIGHTBOX ══════════════ */
(() => {
  const gal = $('#gallery'), track = $('#galTrack');
  let dragged = false;      // si hubo arrastre, el clic que viene después no abre la foto
  PHOTOS.forEach((p,i) => {
    const b = document.createElement('button');
    b.className = 'gi'; b.setAttribute('aria-label', `Open photo ${i+1} of ${PHOTOS.length}`);
    b.style.aspectRatio = `${p.w} / ${p.h}`;
    b.innerHTML = `<img src="img/g/p${p.n}-s.webp" width="${p.w}" height="${p.h}" alt="${p.alt}" loading="lazy" decoding="async" draggable="false">`;
    b.addEventListener('click', e => { if (dragged){ e.preventDefault(); return; } open(i); });
    track.appendChild(b);
  });

  /* flechas */
  const prev = $('#galPrev'), next = $('#galNext');
  const ends = () => {
    prev.disabled = gal.scrollLeft < 4;
    next.disabled = gal.scrollLeft > gal.scrollWidth - gal.clientWidth - 4;
  };
  const step = d => gal.scrollBy({left: d * gal.clientWidth * .8, behavior:'smooth'});
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  gal.addEventListener('scroll', ends, {passive:true});
  addEventListener('resize', ends); ends();
  gal.addEventListener('keydown', e => {
    if (e.key==='ArrowRight'){ step(.5); e.preventDefault(); }
    if (e.key==='ArrowLeft'){  step(-.5); e.preventDefault(); }
  });

  /* arrastrar con el mouse (el touch scrollea solo), con un poco de inercia al soltar */
  let down = false, sx0 = 0, sl0 = 0, lastX = 0, lastT = 0, vel = 0, raf = 0;
  gal.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; dragged = false; sx0 = lastX = e.clientX; sl0 = gal.scrollLeft; lastT = performance.now(); vel = 0;
    cancelAnimationFrame(raf);
  });
  addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - sx0;
    if (!dragged && Math.abs(dx) > 6){ dragged = true; gal.classList.add('drag'); }
    if (!dragged) return;
    gal.scrollLeft = sl0 - dx;
    const now = performance.now();
    vel = (e.clientX - lastX) / Math.max(1, now - lastT); lastX = e.clientX; lastT = now;
  });
  addEventListener('pointerup', () => {
    if (!down) return; down = false;
    gal.classList.remove('drag');
    if (!dragged) return;
    let v = vel * 16;
    const glide = () => { if (Math.abs(v) < .4) return; gal.scrollLeft -= v; v *= .94; raf = requestAnimationFrame(glide); };
    glide();
    /* el click llega después del pointerup: recién ahí se suelta la marca */
    setTimeout(() => { dragged = false; }, 0);
  });

  const lb = $('#lb'), img = $('#lbImg'), count = $('#lbCount');
  let at = 0, last = null;
  const show = i => {
    at = (i + PHOTOS.length) % PHOTOS.length;
    const p = PHOTOS[at];
    img.classList.add('sw');
    const pre = new Image();
    pre.onload = pre.onerror = () => { img.src = pre.src; img.alt = p.alt; img.classList.remove('sw'); };
    pre.src = `img/g/p${p.n}.webp`;
    count.textContent = `${at+1} / ${PHOTOS.length}`;
    /* precarga las vecinas */
    [at+1, at-1].forEach(k => { const q = PHOTOS[(k+PHOTOS.length)%PHOTOS.length]; new Image().src = `img/g/p${q.n}.webp`; });
  };
  const open = i => { last = document.activeElement; lb.classList.add('open'); document.body.classList.add('no-scroll'); if (window.__lenis) window.__lenis.stop(); show(i); $('#lbX').focus(); };
  const close = () => { lb.classList.remove('open'); document.body.classList.remove('no-scroll'); if (window.__lenis) window.__lenis.start(); if (last) last.focus({preventScroll:true}); };

  $('#lbX').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', e => { e.stopPropagation(); show(at-1); });
  $('#lbNext').addEventListener('click', e => { e.stopPropagation(); show(at+1); });
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key==='Escape') close();
    if (e.key==='ArrowRight') show(at+1);
    if (e.key==='ArrowLeft')  show(at-1);
  });
  /* swipe en el celular */
  let sx = null;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive:true});
  lb.addEventListener('touchend', e => {
    if (sx == null) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1));
  });
})();

/* ══════════════ MOVIMIENTO CON EL SCROLL ══════════════
   Lo mismo que en Dashi: Lenis (scroll suave) + GSAP ScrollTrigger con scrub.
   ▸ .plx            la imagen se desliza adentro de su marco (data-plx = cuánto, en % de la imagen; máx 9.6)
   ▸ [data-float]    el elemento entero sube/baja esos px mientras pasa
   ▸ hero            la foto baja y el nombre sube y se apaga
   ▸ galería         la tira se corre de costado mientras se scrollea
   Si GSAP o Lenis no cargan (sin internet), la página queda quieta y anda igual. */
(() => {
  if (!MOTION || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  if (typeof Lenis !== 'undefined'){
    const lenis = window.__lenis = new Lenis({ duration:1.15, smoothWheel:true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t*1000));
    gsap.ticker.lagSmoothing(0);
    /* anclas por Lenis (si no, el salto nativo y el suave se pelean) */
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const t = $(a.getAttribute('href'));
      if (t){ e.preventDefault(); lenis.scrollTo(t, {offset: t.id==='home' ? 0 : -64}); }
    }));
  }

  /* hero: el scrub mueve la IMG y el bloque de texto; la entrada CSS anima wrapper e hijos */
  gsap.to('#heroImg img', { yPercent:14, scale:1.06, ease:'none',
    scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true } });
  gsap.to('.hero-txt', { yPercent:-18, opacity:.15, ease:'none',
    scrollTrigger:{ trigger:'.hero', start:'top top', end:'75% top', scrub:true } });

  /* imágenes que se deslizan adentro del marco. Las del about van pegadas (sticky):
     se miden contra la sección entera, así siguen moviéndose mientras están quietas */
  $$('.plx').forEach(f => {
    const img = $('img', f); if (!img) return;
    const amt = Math.min(9.6, parseFloat(f.dataset.plx) || 8);
    gsap.fromTo(img, { yPercent:-amt }, { yPercent:amt, ease:'none',
      scrollTrigger:{ trigger: f.closest('.about') || f, start:'top bottom', end:'bottom top', scrub:true } });
  });

  /* elementos enteros que flotan */
  $$('[data-float]').forEach(el => {
    /* en el celular flota menos: las fotos no van pegadas y se montarían sobre el texto */
    const px = (parseFloat(el.dataset.float) || 30) * (innerWidth < 761 ? .4 : 1);
    gsap.fromTo(el, { y:px }, { y:-px, ease:'none',
      scrollTrigger:{ trigger: el.closest('.about, .album') || el, start:'top bottom', end:'bottom top', scrub:true } });
  });

  /* la tira de fotos se corre sola de costado con el scroll vertical */
  gsap.fromTo('#galTrack', { x:() => innerWidth*.06 }, { x:() => -innerWidth*.06, ease:'none',
    scrollTrigger:{ trigger:'#gallery', start:'top bottom', end:'bottom top', scrub:true, invalidateOnRefresh:true } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
