// index.js — reveal-on-scroll + simple parallax for elements with data-parallax

document.addEventListener('DOMContentLoaded', () => {
  // nav toggle for small screens
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.main-nav .navlinks');
  if (menuToggle) menuToggle.addEventListener('click', () => navLinks && navLinks.classList.toggle('active'));

  // Reveal on scroll using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => obs.observe(r));

  // Simple parallax for images with data-parallax attribute
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  if (parallaxEls.length) {
    const update = () => {
      const viewportHeight = window.innerHeight;
      parallaxEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.08;
        // amount between -0.5 .. 0.5
        const factor = (rect.top + rect.height/2 - viewportHeight/2) / (viewportHeight/2);
        const translate = -factor * 12 * speed; // tweak multiplier for subtle motion
        el.style.transform = `translateY(${translate}px)`;
      });
    };
    // use rAF for smoothness
    let ticking = false;
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); } };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }
});
