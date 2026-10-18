// Keep the long-page index aligned with the section being read.
const sectionLinks = [...document.querySelectorAll('.contents a[href^="#"]')];
const indexedSections = sectionLinks.map(link => ({
  link,
  section: document.getElementById(decodeURIComponent(link.hash.slice(1)))
})).filter(item => item.section);
const markSection = section => {
  indexedSections.forEach(item => {
    if (item.section === section) item.link.setAttribute('aria-current', 'location');
    else item.link.removeAttribute('aria-current');
  });
};
if (indexedSections.length) {
  let sectionIndexFrame = 0;
  const updateSectionIndex = () => {
    sectionIndexFrame = 0;
    const readingLine = (document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0) + 32;
    const positions = indexedSections.map(item => ({...item, rect:item.section.getBoundingClientRect()}));
    const containing = positions.filter(item => item.rect.top <= readingLine && item.rect.bottom > readingLine);
    // Nested evidence records take precedence over their enclosing pipeline section.
    const deepest = containing.reduce((current, item) => {
      if (!current || current.section.contains(item.section)) return item;
      if (!item.section.contains(current.section) && item.rect.top > current.rect.top) return item;
      return current;
    }, null);
    const preceding = positions.filter(item => item.rect.top <= readingLine)
      .sort((a,b) => b.rect.top - a.rect.top)[0];
    markSection((deepest || preceding || positions[0]).section);
  };
  const queueSectionIndex = () => {
    if (!sectionIndexFrame) sectionIndexFrame = requestAnimationFrame(updateSectionIndex);
  };
  window.addEventListener('scroll', queueSectionIndex, {passive:true});
  window.addEventListener('resize', queueSectionIndex, {passive:true});
  window.addEventListener('hashchange', queueSectionIndex);
  window.addEventListener('load', queueSectionIndex);
  document.addEventListener('load', event => {
    if (event.target.tagName === 'IMG') queueSectionIndex();
  }, true);
  document.fonts?.ready.then(queueSectionIndex);
  queueSectionIndex();
}

// Explicit keyboard access and a readable name for tables that overflow.
// Fitting and closed tables do not create extra tab stops.
(() => {
  const tables = [...document.querySelectorAll('.table-wrap,.scroll-x')]
    .filter(wrapper => wrapper.querySelector('table'))
    .map((wrapper, index) => {
      const hint = document.createElement('p');
      hint.className = 'table-scroll-hint';
      hint.id = `table-scroll-hint-${index + 1}`;
      hint.hidden = true;
      hint.textContent = 'This table scrolls horizontally. With a keyboard, focus it and use the left/right arrow keys.';
      wrapper.before(hint);
      const original = new Map(['tabindex','role','aria-label','aria-describedby'].map(name => [name, wrapper.getAttribute(name)]));
      const table = wrapper.querySelector('table');
      const heading = table.getAttribute('aria-labelledby')?.split(/\s+/)
        .map(id => document.getElementById(id)?.textContent || '').join(' ').trim()
        || table.caption?.textContent.trim()
        || wrapper.closest('.expr-exhibit,.research-section')?.querySelector('h2,h3')?.textContent.trim()
        || 'Research data';
      return {wrapper, hint, original, heading};
    });
  if (!tables.length) return;
  let frame = 0;
  const update = () => {
    frame = 0;
    tables.forEach(({wrapper, hint, original, heading}) => {
      const overflowing = wrapper.clientWidth > 0 && wrapper.scrollWidth > wrapper.clientWidth + 1;
      hint.hidden = !overflowing;
      wrapper.classList.toggle('is-scrollable', overflowing);
      if (overflowing) {
        if (original.get('tabindex') === null) wrapper.setAttribute('tabindex', '0');
        if (!original.get('role')) wrapper.setAttribute('role', 'region');
        if (!original.get('aria-label')) wrapper.setAttribute('aria-label', `${heading} — horizontally scrollable table`);
        wrapper.setAttribute('aria-describedby', [original.get('aria-describedby'), hint.id].filter(Boolean).join(' '));
      } else {
        original.forEach((value, name) => {
          if (value === null) wrapper.removeAttribute(name);
          else wrapper.setAttribute(name, value);
        });
      }
    });
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('resize', queue, {passive:true});
  window.addEventListener('load', queue);
  document.addEventListener('toggle', queue, true);
  document.fonts?.ready.then(queue);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(queue);
    tables.forEach(({wrapper}) => observer.observe(wrapper));
  }
  queue();
})();
