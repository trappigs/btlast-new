// values-timeline.js — masaüstünde knot kutularını birbirine bağlayan animasyonlu çizgi
(function () {
  // ---- 0) Gerekli stilleri JS içinden enjekte et (ekstra CSS dosyası şart değil)
  function injectStyles() {
    if (document.getElementById('vz-connector-style')) return;
    const css = `
/* === VZ Connector (SVG overlay) === */
.vz__svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1}
.vz__line--track{stroke:var(--track,#d4d4d4);stroke-width:4;fill:none;stroke-linecap:round}
.vz__line--anim{stroke:var(--green,#0b5e3f);stroke-width:4;fill:none;stroke-linecap:round}
@media (max-width: 991.98px){.vz__svg{display:none}}
/* knotlar çizginin üstünde kalsın */
@media (min-width: 992px){.vz__knot{z-index:2;position:relative}}
@media (prefers-reduced-motion: reduce){.vz__line--anim{transition:none!important}}
`;
    const style = document.createElement('style');
    style.id = 'vz-connector-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---- 1) Mevcut: görünür oldukça item'ların içeri girişi (korundu)
  function animateItemsIn(scope) {
    const items = scope.querySelectorAll('.vz__item');
    if (!items.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('vz--in'), i * 100);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    items.forEach(el => io.observe(el));
  }

  // ---- 2) Knotları birbirine bağlayan çizgi
  const NS = 'http://www.w3.org/2000/svg';
  const mqDesktop = window.matchMedia('(min-width: 992px)');

  function setupConnector(root) {
    if (root.dataset.vzBound === '1') return;
    root.dataset.vzBound = '1';

    const inner = root.querySelector('.vz__inner') || root;
    // position relative olmazsa overlay konumlanamaz
    const computedPos = getComputedStyle(inner).position;
    if (computedPos === 'static' || !computedPos) inner.style.position = 'relative';

    // SVG'yi oluştur/temizle
    let svg = inner.querySelector('.vz__svg');
    if (!svg) {
      svg = document.createElementNS(NS, 'svg');
      svg.classList.add('vz__svg');
      inner.prepend(svg);
    } else {
      svg.innerHTML = '';
    }
    const track = document.createElementNS(NS, 'path');
    track.setAttribute('class', 'vz__line--track');
    const anim = document.createElementNS(NS, 'path');
    anim.setAttribute('class', 'vz__line--anim');
    svg.appendChild(track);
    svg.appendChild(anim);

    let didAnimate = false;

    function getPoints() {
      const rect = inner.getBoundingClientRect();
      const knots = [...inner.querySelectorAll('.vz__knot')];
      return knots.map(k => {
        const r = k.getBoundingClientRect();
        return { x: r.left + r.width / 2 - rect.left, y: r.top + r.height / 2 - rect.top };
      });
    }

    function buildPath(points) {
      if (points.length < 2) return '';
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1], p1 = points[i];
        const cx = (p0.x + p1.x) / 2;
        d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
      }
      return d;
    }

    function draw(animateOnce = true) {
      if (!mqDesktop.matches) { svg.style.display = 'none'; return; }
      svg.style.display = '';
      svg.setAttribute('viewBox', `0 0 ${inner.clientWidth} ${inner.clientHeight}`);

      const pts = getPoints();
      if (pts.length < 2) { track.setAttribute('d', ''); anim.setAttribute('d', ''); return; }

      const d = buildPath(pts);
      track.setAttribute('d', d);
      anim.setAttribute('d', d);

      const len = anim.getTotalLength();
      anim.style.strokeDasharray = String(len);

      if (animateOnce && !didAnimate) {
        anim.style.transition = 'none';
        anim.style.strokeDashoffset = String(len);
        void anim.getBoundingClientRect(); // reflow
        anim.style.transition = 'stroke-dashoffset 1600ms cubic-bezier(.4,0,.2,1)';
        anim.style.strokeDashoffset = '0';
        didAnimate = true;
      } else {
        anim.style.transition = 'none';
        anim.style.strokeDashoffset = '0';
      }
    }

    // İlk görünümde animasyonu bir kez oynat
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => {
        if (e.isIntersecting) { draw(true); io.disconnect(); }
      });
    }, { threshold: 0.2 });
    io.observe(inner);

    // Boyut değişikliği
    const ro = new ResizeObserver(() => draw(false));
    ro.observe(inner);

    window.addEventListener('orientationchange', () => draw(false));
    window.addEventListener('load', () => draw(!didAnimate));

    // İlk kurulumda çiz
    draw(false);
  }

  // ---- 3) Başlat
  function init() {
    injectStyles();
    // .vz varsa onu, yoksa .vz__inner olanları kök olarak kullan
    const roots = document.querySelectorAll('.vz, .vz__inner');
    if (!roots.length) return;
    roots.forEach(root => {
      // .vz__inner seçildiyse root = inner'ın kendisi olsun
      if (root.classList.contains('vz__inner')) {
        animateItemsIn(root);
        setupConnector(root);
      } else {
        animateItemsIn(root);
        setupConnector(root);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
