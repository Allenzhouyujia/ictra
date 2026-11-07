/* Reveal each portrait once; content remains visible without animation support. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const animations = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (reduced.matches) return;
      const animation = entry.target.animate(
        [{ opacity: 0.45, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 650, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
      );
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.member > img.av-photo').forEach(photo => {
    if (photo.complete) observer.observe(photo);
    else photo.addEventListener('load', () => observer.observe(photo), { once: true });
  });
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer.disconnect();
    animations.forEach(animation => animation.cancel());
    animations.clear();
  });
})();
