/* ══════════════════════════════════════════════════════════
   EL DISCO ADENTRO DEL PORTFOLIO — "Boston a BSAS"
   Portado del sitio del disco (Julia\album\sitio\js\app.js): el cartel con la lupa a
   color, los autos con humo, el grafiti, la barra que pasa, los créditos y el collage en
   alta. Los temas NO están acá: los maneja el reproductor del portfolio (js/app.js), que
   es uno solo para toda la página. Se carga después de app.js y usa sus helpers ($, $$, clamp).
   ══════════════════════════════════════════════════════════ */
(() => {
const hero = $('#albHero');
if (!hero) return;

/* los créditos generales del disco: la suma de los de cada tema (documento de Julia, 21/9). Sólo nombres, sin escuela ni banda (pedido de Julia) */
const ALBUM_CREDITS = [
  ['Produced & arranged','Julia Marro',''],
  ['Co-production & arrangement','Nicolas Damm',''],
  ['Vocals','Alejandro Guerra Ricco · Ariel Garcia · Alex Varvar · Santiago Bascope',''],
  ['Lyrics & co-writing','Alejandro Guerra Ricco · Ariel Garcia · Alex Varvar · Santiago Bascope',''],
  ['Guitar','Ariel Nuñez',''],
  ['Saxophone','Alejandro Taveras',''],
  ['Percussion','Maxi Sayes',''],
  ['Bass','Luciano Fortuny',''],
  ['Mixing','Santiago Bascope · Julia Marro',''],
  ['Mastering','Alessio De Marzo','']
];

/* Zonas del arte, en fracción 0-1: `wide` sobre hero-wide.jpg (escritorio) y `square`
   sobre cover.jpg (vertical). Son las mismas medidas del sitio del disco: si se cambian
   esas imágenes hay que volver a medir (ver el README de Julia\album\sitio). */
const ZONES = {
  wide:   { photo:{ x:0.3921, y:0.2379, w:0.2191, h:0.3306 }, logo:{ x:0.3681, y:0.6284, w:0.0982 } },
  square: { photo:{ x:0.2815, y:0.2609, w:0.4437, h:0.3206 }, logo:{ x:0.2329, y:0.6397, w:0.1988 } }
};
const WIDE = matchMedia('(min-width:761px)');
const img = $('#albCover'), hit = $('#albPhoto'), title = $('#albTitle'), logo = $('#albLogo');

$('#albCredits').innerHTML = ALBUM_CREDITS.map(([k,v,s]) =>
  `<div><dt>${k}</dt><dd>${v}${s ? ` <i>· ${s}</i>` : ''}</dd></div>`).join('');

/* ── calce ──
   La imagen va con object-fit:cover anclada abajo, así que se recorta distinto en cada
   ventana. Esto devuelve qué rectángulo ocupa de verdad adentro de su caja, para poder
   calzarle cosas encima. offsetWidth y no getBoundingClientRect: la caja lleva el
   transform del parallax y se quiere la medida SIN transformar. */
function coverBox(){
  const cw = img.offsetWidth, ch = img.offsetHeight, nw = img.naturalWidth, nh = img.naturalHeight;
  if (!nw || !nh || !cw || !ch) return null;
  const s = Math.max(cw/nw, ch/nh), w = nw*s, h = nh*s;
  return { x:(cw-w)*.5, y:(ch-h), w, h };
}
function place(){
  const r = coverBox(); if (!r) return;
  const z = ZONES[WIDE.matches ? 'wide' : 'square'], p = z.photo, l = z.logo;
  hit.classList.add('ready');
  hit.style.left = (r.x + p.x*r.w) + 'px';  hit.style.top = (r.y + p.y*r.h) + 'px';
  hit.style.width = (p.w*r.w) + 'px';       hit.style.height = (p.h*r.h) + 'px';
  title.style.left = (r.x + l.x*r.w) + 'px'; title.style.top = (r.y + l.y*r.h) + 'px';
  logo.style.width = (l.w*r.w) + 'px';
}
img.addEventListener('load', place);
addEventListener('resize', place);
WIDE.addEventListener('change', () => setTimeout(place, 60));   // cambia la imagen: esperar a que cargue
addEventListener('load', place);
if (img.complete) place();
/* la pestaña Album puede estar escondida al cargar o al cambiar de tamaño: recalzar al volver */
new ResizeObserver(place).observe($('#albFrame'));

/* ── la entrada: el grafiti se escribe de izquierda a derecha cuando el cartel aparece ── */
let visible = false;
new IntersectionObserver(es => {
  visible = es[0].isIntersecting;
  if (es[0].intersectionRatio > .35) hero.classList.add('in');
}, {threshold:[0,.35]}).observe(hero);
if (!MOTION) hero.classList.add('in');

/* (el cartel va quieto: el parallax que seguía al mouse se sacó el 21/9, a Nacho lo mareaba.
   Del cartel sólo se mueven la lupa y los autos.) */

/* ── la lupa a color ──
   El radio se suaviza con rAF: con una transición de CSS la posición del círculo también
   quedaría retrasada y arrastraría. */
(() => {
  if (!matchMedia('(hover:hover)').matches) return;
  const frame = $('#albFrame'), color = $('#albColor'), ring = $('#albRing');
  let x = 0, y = 0, r = 0, target = 0, raf = null;
  const paint = () => {
    r += (target - r)*.2;
    const m = `radial-gradient(circle ${r.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px,#000 78%,transparent 100%)`;
    color.style.webkitMaskImage = m; color.style.maskImage = m;
    const d = r*1.56;                          // el aro va donde la máscara ya se apagó
    ring.style.width = ring.style.height = d + 'px';
    ring.style.transform = `translate(${(x-d/2).toFixed(1)}px,${(y-d/2).toFixed(1)}px)`;
    if (Math.abs(target - r) > .4 || target > 0) raf = requestAnimationFrame(paint);
    else { r = 0; raf = null; }
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(paint); };
  const move = e => {
    const f = frame.getBoundingClientRect();
    x = e.clientX - f.left; y = e.clientY - f.top;
    target = clamp(hit.offsetWidth*.26, 70, 145);   // el radio acompaña el tamaño de la foto
    ring.classList.add('on'); kick();
  };
  const out = () => { target = 0; ring.classList.remove('on'); kick(); };
  hit.addEventListener('pointerenter', move);
  hit.addEventListener('pointermove', move);
  hit.addEventListener('pointerleave', out);
  hit.addEventListener('blur', out);
})();

/* ── los autos que pasan atrás del cartel ──
   Cada tanto sale uno (al azar cuál, para qué lado y a qué velocidad), cruza toda la caja
   y se borra. Va dibujado entre la pared y el recorte del cartel (hero-cut.webp). El blur
   de movimiento viene pintado en el WebP; las ruedas son discos aparte que giran a la
   velocidad que corresponde. x/y = centro de la rueda, r = radio, d = lado del disco,
   todo en fracción del ancho del cuerpo. No mira prefers-reduced-motion: son parte del arte. */
const CARS = [
  { id:'taxi',    w:1400, h:586, wheels:[{x:.1898,y:.3470,r:.0748,d:.1517},{x:.7973,y:.3465,r:.0748,d:.1517}] },
  { id:'policia', w:1400, h:604, wheels:[{x:.1930,y:.3256,r:.0747,d:.1514},{x:.7423,y:.3387,r:.0747,d:.1514}] },
  { id:'roto',    w:1400, h:459, wheels:[{x:.1754,y:.2489,r:.0667,d:.1352},{x:.7444,y:.2534,r:.0667,d:.1352}] },
  { id:'fitito',  w:1400, h:671, wheels:[{x:.1758,y:.3687,r:.0857,d:.1740},{x:.7916,y:.3728,r:.0833,d:.1690}] }
];
const CAR_FLOOR = { wide:.8506, square:.8552 };   // la línea vereda/pared, en fracción del alto del arte
(() => {
  const layer = $('#albCars');
  let timer = null, last = -1, raf = null, loaded = false;
  const live = new Set();
  const rnd = (a,b) => a + Math.random()*(b-a);
  const schedule = s => { clearTimeout(timer); timer = setTimeout(spawn, s*1000); };

  /* una bocanada de humo, en coordenadas de la capa: se queda atrás mientras el auto sigue */
  function puff(x, y, size, dir){
    const p = document.createElement('i');
    p.className = 'alb-smoke s' + (1 + Math.floor(Math.random()*3));
    p.style.cssText = `left:${(x-size/2).toFixed(1)}px;top:${(y-size/2).toFixed(1)}px;width:${size.toFixed(1)}px;height:${size.toFixed(1)}px`;
    layer.appendChild(p);
    const k = size/40, rot = rnd(-40,40), up = -rnd(28,64)*k, back = -dir*rnd(4,22)*k;
    p.animate([
      { transform:'translate(0,0) rotate(0deg) scale(.3)', opacity:0 },
      { transform:`translate(${(back*.3).toFixed(1)}px,${(up*.22).toFixed(1)}px) rotate(${(rot*.3).toFixed(0)}deg) scale(1.1)`, opacity:.45, offset:.16 },
      { transform:`translate(${back.toFixed(1)}px,${up.toFixed(1)}px) rotate(${rot.toFixed(0)}deg) scale(3.1)`, opacity:0 }
    ], { duration:rnd(1400,2000), easing:'cubic-bezier(.25,.5,.5,1)' }).onfinish = () => p.remove();
  }
  /* por frame: humo en la cola de cada auto, y el grafiti en verde mientras uno le pasa por atrás */
  function tick(now){
    if (!live.size){ raf = null; logo.classList.remove('lit'); return; }
    const L = { x:parseFloat(title.style.left)||0, y:parseFloat(title.style.top)||0, w:logo.offsetWidth, h:logo.offsetHeight };
    let lit = false;
    for (const c of live){
      const k = clamp((c.anim.currentTime||0)/(c.dur*1000), 0, 1), x = c.from + (c.to-c.from)*k;
      if (x < L.x+L.w && x+c.w > L.x && c.top < L.y+L.h && c.top+c.h > L.y) lit = true;
      if (now - c.lastPuff > 40 && k < .97){
        c.lastPuff = now;
        puff(c.toRight ? x + c.w*.03 : x + c.w*.97, c.top + c.h*.84 + rnd(-3,3), c.w*.06 + rnd(0, c.w*.03), c.toRight ? 1 : -1);
      }
    }
    logo.classList.toggle('lit', lit);
    raf = requestAnimationFrame(tick);
  }
  function spawn(){
    /* si el cartel no está a la vista (o la pestaña Album está cerrada) no se sueltan autos */
    if (!visible || document.hidden || !img.naturalWidth) return schedule(rnd(1,2));
    const r = coverBox(); if (!r) return schedule(2);
    if (!loaded){ loaded = true; CARS.forEach(c => ['','-a','-b'].forEach(s => { new Image().src = `img/album/car-${c.id}${s}.webp`; })); return schedule(1.2); }
    let i; do { i = Math.floor(Math.random()*CARS.length); } while (i === last);
    last = i;
    const c = CARS[i], toRight = Math.random() < .5;
    const w = r.w*(WIDE.matches ? .34 : .6), h = w*c.h/c.w;
    const floorY = r.y + r.h*(WIDE.matches ? CAR_FLOOR.wide : CAR_FLOOR.square);
    const top = floorY - Math.max(...c.wheels.map(o => o.y + o.r))*w;
    const el = document.createElement('div');
    el.className = 'alb-car' + (toRight ? ' flip' : '');
    el.style.width = w + 'px'; el.style.top = top + 'px';
    el.innerHTML = `<div class="alb-car-in"><img class="alb-car-body" src="img/album/car-${c.id}.webp" alt="">` +
      c.wheels.map((o,k) => { const d = (o.d*w).toFixed(1);
        return `<img class="alb-wheel" src="img/album/car-${c.id}-${k ? 'b' : 'a'}.webp" alt="" style="left:${((o.x-o.d/2)*w).toFixed(1)}px;top:${((o.y-o.d/2)*w).toFixed(1)}px;width:${d}px;height:${d}px">`;
      }).join('') + '</div>';
    const W = layer.offsetWidth, pad = 60, from = toRight ? -w-pad : W+pad, to = toRight ? W+pad : -w-pad;
    const dur = rnd(1.4, 2.2), v = Math.abs(to-from)/dur;
    /* giro real: v / (2πr), con tope para que no estrobe */
    el.style.setProperty('--roll', (1/Math.min(v/(2*Math.PI*c.wheels[0].r*w), 3)).toFixed(3) + 's');
    layer.appendChild(el);
    const anim = el.animate([{ transform:`translateX(${from}px)` }, { transform:`translateX(${to}px)` }], { duration:dur*1000, easing:'linear' });
    const car = { el, anim, from, to, w, h, top, dur, toRight, lastPuff:0 };
    live.add(car);
    anim.onfinish = () => { live.delete(car); el.remove(); };
    if (!raf) raf = requestAnimationFrame(tick);
    schedule(rnd(7, 15));
  }
  schedule(1.5);
  window.__albCar = spawn;      // para pruebas: suelta un auto ya
})();

/* ── la barra negra con los títulos: corre sola y se apura un poco al scrollear ── */
(() => {
  const track = $('#albMq'), names = TRACKS.filter(t => (t.cat||'album') === 'album').map(t => t.title);
  let html = ''; for (let r = 0; r < 3; r++) names.forEach(n => html += `<span>${n}</span><b></b>`);
  track.innerHTML = html;
  if (!MOTION) return;
  let x = 0, extra = 0, lastY = scrollY, w = 0, on = false, raf = null;
  const measure = () => { w = track.scrollWidth/3; };
  measure(); addEventListener('resize', measure);
  if (document.fonts) document.fonts.ready.then(measure);
  addEventListener('scroll', () => { extra = clamp(Math.abs(scrollY-lastY)*.14, 0, 9); lastY = scrollY; }, {passive:true});
  const loop = () => {
    extra *= .93; x -= .55 + extra;
    if (!w) measure();
    if (w && -x >= w) x += w;
    track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    raf = on ? requestAnimationFrame(loop) : null;
  };
  /* sólo corre mientras está a la vista */
  new IntersectionObserver(es => { on = es[0].isIntersecting; if (on && !raf) raf = requestAnimationFrame(loop); }).observe(track.parentNode);
})();

/* ── el collage a color, en alta: clic = acercar/alejar, con zoom se arrastra ── */
(() => {
  const box = $('#albLb'), pic = $('#albLbImg'), stage = $('#albLbStage'), SRC = 'img/album/collage-color.jpg';
  let shown = false, zoom = false, px = 0, py = 0, drag = null;
  const preload = () => { if (shown) return; shown = true; pic.onload = () => box.classList.add('loaded'); pic.src = SRC; };
  hit.addEventListener('pointerenter', preload);
  const open = () => {
    preload();
    box.classList.add('open'); document.body.classList.add('no-scroll');
    if (window.__lenis) window.__lenis.stop();
    $('#albLbX').focus();
  };
  const close = () => {
    box.classList.remove('open','zoom'); document.body.classList.remove('no-scroll');
    if (window.__lenis) window.__lenis.start();
    zoom = false; px = py = 0; pic.style.transform = '';
    hit.focus({preventScroll:true});
  };
  hit.addEventListener('click', open);
  $('#albLbX').addEventListener('click', close);
  box.addEventListener('click', e => { if (e.target === box) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) close(); });
  const pan = () => pic.style.transform = `translate(${px}px,${py}px)`;
  stage.addEventListener('click', e => {
    if (drag && drag.moved) return;               // fue un arrastre, no un clic
    if (e.target !== pic){ close(); return; }
    zoom = !zoom; box.classList.toggle('zoom', zoom); px = py = 0; pan();
  });
  stage.addEventListener('pointerdown', e => {
    if (!zoom) return;
    drag = { x:e.clientX, y:e.clientY, px, py, moved:false };
    stage.classList.add('grabbing'); stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    px = drag.px + dx; py = drag.py + dy; pan();
  });
  const end = () => { stage.classList.remove('grabbing'); setTimeout(() => { drag = null; }, 0); };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
})();
})();

/* ── la visa del About: torcida, se inclina en 3D siguiendo el mouse, con un brillo que lo
   acompaña (el JS escribe --mx/--my). Portado del sitio del disco. ── */
(() => {
  const v = document.querySelector('#visa');
  if (!v || !matchMedia('(hover:hover)').matches) return;
  v.addEventListener('pointermove', e => {
    const r = v.getBoundingClientRect(), x = (e.clientX - r.left)/r.width, y = (e.clientY - r.top)/r.height;
    v.style.setProperty('--mx', (x*100).toFixed(1) + '%');
    v.style.setProperty('--my', (y*100).toFixed(1) + '%');
    v.style.transform = `perspective(900px) rotate(var(--tilt)) rotateX(${(-(y-.5)*12).toFixed(2)}deg) rotateY(${((x-.5)*12).toFixed(2)}deg) scale(1.04)`;
  });
  v.addEventListener('pointerleave', () => { v.style.transform = ''; });
})();

/* ── "Download the cover": que BAJE el archivo y no lo abra ──
   El atributo `download` solo no alcanza: varios navegadores abren la imagen en una pestaña,
   y abriendo el sitio con doble clic (file://) Chrome directamente lo ignora. Entonces la
   descarga se arma a mano desde un blob:
     1) por fetch (cuando el sitio está servido por http/https), y si eso falla
     2) desde data/cover-b64.js, la misma tapa en base64, que se carga recién con el clic
        (un <script> sí carga en file://, un fetch no).
   Si se cambia la tapa hay que regenerar ese archivo (ver README). */
(() => {
  const a = document.querySelector('#albDl');
  if (!a) return;
  const NAME = a.getAttribute('download') || 'Boston a BSAS - cover.jpg';
  const save = blob => {
    const url = URL.createObjectURL(new Blob([blob], {type:'application/octet-stream'}));
    const t = document.createElement('a');
    t.href = url; t.download = NAME; t.style.display = 'none';
    document.body.appendChild(t); t.click(); t.remove();
    setTimeout(() => URL.revokeObjectURL(url), 8000);
  };
  const fromB64 = () => new Promise((ok, no) => {
    const done = () => {
      const bin = atob(window.COVER_B64), u8 = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      ok(new Blob([u8]));
    };
    if (window.COVER_B64) return done();
    const s = document.createElement('script');
    s.src = 'data/cover-b64.js'; s.onload = done; s.onerror = no;
    document.head.appendChild(s);
  });
  a.addEventListener('click', async e => {
    e.preventDefault();
    if (a.classList.contains('busy')) return;
    a.classList.add('busy');
    try {
      let blob;
      try {
        if (location.protocol === 'file:') throw 0;          // en file:// el fetch no anda: directo al base64
        const r = await fetch(a.getAttribute('href')); if (!r.ok) throw 0;
        blob = await r.blob();
      } catch (_) { blob = await fromB64(); }
      save(blob);
    } catch (err) { window.open(a.getAttribute('href'), '_blank'); }   // último recurso
    a.classList.remove('busy');
  });
})();
