/* ============================================
   MAISON CÉLESTE — main.js
   ============================================ */

/* ---- Curseur personnalisé ---- */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  if (!cursor || !ring) return;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    setTimeout(() => {
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';
    }, 60);
  });
})();

/* ---- Navbar scroll ---- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ---- Menu hamburger mobile ---- */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const menu  = document.getElementById('nav-mobile');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Ferme le menu au clic sur un lien
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
      btn.setAttribute('aria-expanded', false);
    });
  });
})();

/* ---- Reveal au scroll (IntersectionObserver) ---- */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
})();

/* ---- Filtre galerie desktop ---- */
(function initGalerieFilter() {
  const tabs  = document.querySelectorAll('.tab');
  const items = document.querySelectorAll('.galerie-item');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.cat;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      items.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.style.opacity   = show ? '1'    : '0.2';
        item.style.transform = show ? 'scale(1)' : 'scale(0.97)';
        item.style.transition = 'opacity .3s, transform .3s';
      });
    });
  });
})();

/* ---- Carousel mobile avec Swiper.js ---- */
(function initSwiper() {
  // N'initialise Swiper que si on est sur mobile (≤ 900px)
  // et si le conteneur existe
  const container = document.querySelector('.galerie-swiper');
  if (!container) return;

  let swiperInstance = null;

  function mountSwiper() {
    if (swiperInstance) return;
    swiperInstance = new Swiper('.galerie-swiper', {
      slidesPerView: 'auto',
      spaceBetween: 16,
      centeredSlides: true,
      grabCursor: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      a11y: {
        prevSlideMessage: 'Création précédente',
        nextSlideMessage: 'Création suivante',
      },
    });
  }

  function destroySwiper() {
    if (!swiperInstance) return;
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }

  // Init / destroy selon breakpoint
  const mq = window.matchMedia('(max-width: 900px)');

  function handleBreakpoint(e) {
    if (e.matches) {
      mountSwiper();
    } else {
      destroySwiper();
    }
  }

  mq.addEventListener('change', handleBreakpoint);
  handleBreakpoint(mq); // exécution initiale
})();

/* ---- Filtres carousel mobile ---- */
(function initCarouselFilter() {
  const ctabs = document.querySelectorAll('.ctab');
  if (!ctabs.length) return;

  ctabs.forEach(ctab => {
    ctab.addEventListener('click', () => {
      const cat = ctab.dataset.cat;

      ctabs.forEach(t => t.classList.remove('active'));
      ctab.classList.add('active');

      document.querySelectorAll('.galerie-swiper .swiper-slide').forEach(slide => {
        const show = cat === 'all' || slide.dataset.cat === cat;
        slide.style.display = show ? '' : 'none';
      });

      // Recalcule Swiper après le filtre
      const swiper = document.querySelector('.galerie-swiper')?.swiper;
      if (swiper) {
        swiper.update();
        swiper.slideTo(0, 0);
      }
    });
  });
})();

/* ---- Formulaires ---- */
(function initForms() {
  const notif = document.getElementById('notif');
  if (!notif) return;

  function showNotif(msg) {
    notif.textContent = msg;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 4000);
  }

  const formCommande = document.getElementById('form-commande');
  if (formCommande) {
    formCommande.addEventListener('submit', (e) => {
      e.preventDefault();
      showNotif('Votre commande a été transmise. Je vous confirme tout sous 48h !');
      formCommande.reset();
    });
  }

  const formDevis = document.getElementById('form-devis');
  if (formDevis) {
    formDevis.addEventListener('submit', (e) => {
      e.preventDefault();
      showNotif('Votre demande de devis a bien été envoyée. Je vous réponds sous 48h !');
      formDevis.reset();
    });
  }
})();

/* ---- QR Code ---- */
(function initQRCode() {
  const el = document.getElementById('qrcode');
  if (!el || typeof QRCode === 'undefined') return;

  const url = window.location.href.split('#')[0] || 'https://maison-celeste.fr';
  new QRCode(el, {
    text: url,
    width: 110,
    height: 110,
    colorDark: '#0a0a0a',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M,
  });
})();
