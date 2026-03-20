// ── NAV scroll state ──────────────────────────────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Reveal on scroll ──────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // stagger siblings in same parent
            const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
            const idx = siblings.indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, idx * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── Menu tabs ─────────────────────────────────────────────────
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.menu__panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(target).classList.add('active');
    });
});

// ── Smooth anchor scroll (offset for fixed nav) ───────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = nav.offsetHeight + 16;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
});

// ── Parallax hero image ───────────────────────────────────────
const heroBg = document.querySelector('.hero__bg img');

window.addEventListener('scroll', () => {
    if (!heroBg) return;
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
}, { passive: true });

// ── Gallery lightbox (simple) ─────────────────────────────────
const galleryItems = document.querySelectorAll('.gallery__item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery__caption');

        const overlay = document.createElement('div');
        overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 999;
      background: rgba(20,12,6,0.92);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      cursor: pointer; padding: 24px;
      animation: fadeIn 0.3s ease;
    `;

        const lightImg = document.createElement('img');
        lightImg.src = img.src;
        lightImg.style.cssText = `
      max-width: 90vw; max-height: 80vh;
      object-fit: contain; border: none;
      animation: scaleIn 0.35s cubic-bezier(0.4,0,0.2,1);
    `;

        const cap = document.createElement('p');
        cap.textContent = caption ? caption.textContent : '';
        cap.style.cssText = `
      font-family: 'Jost', sans-serif;
      font-size: 0.72rem; letter-spacing: 0.16em;
      text-transform: uppercase; color: rgba(212,201,184,0.7);
      margin-top: 20px;
    `;

        overlay.appendChild(lightImg);
        overlay.appendChild(cap);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        overlay.addEventListener('click', () => {
            overlay.remove();
            document.body.style.overflow = '';
        });
    });
});

// inject keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes scaleIn { from { transform: scale(0.92); opacity: 0 } to { transform: scale(1); opacity: 1 } }
`;
document.head.appendChild(style);
