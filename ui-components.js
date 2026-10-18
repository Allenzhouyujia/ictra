/* Progressive reading controls. Links and native details remain the no-JS fallback. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 950px)');
  const NS = 'http://www.w3.org/2000/svg';
  const icon = (paths, className = '') => {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('class', `control-icon ${className}`.trim());
    paths.forEach(([d, cls]) => {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      if (cls) path.setAttribute('class', cls);
      svg.append(path);
    });
    return svg;
  };

  // One interruptible mobile menu; a desktop resize clears mobile-only inert state.
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  let menuTimer = 0;
  if (menu && nav) {
    const label = document.createElement('span');
    label.textContent = menu.textContent;
    const glyph = document.createElement('span');
    glyph.className = 'menu-glyph';
    glyph.setAttribute('aria-hidden', 'true');
    menu.replaceChildren(label, glyph);
    const setMenu = (open, instant = false) => {
      clearTimeout(menuTimer);
      nav.classList.remove('is-closing');
      menu.setAttribute('aria-expanded', String(open));
      label.textContent = open ? 'Close' : 'Menu';
      nav.inert = mobile.matches && !open;
      if (open) nav.classList.add('is-open');
      else if (!instant && !reduced.matches && mobile.matches && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        nav.classList.add('is-closing');
        menuTimer = setTimeout(() => nav.classList.remove('is-closing'), 150);
      } else nav.classList.remove('is-open');
    };
    menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        setMenu(false); menu.focus();
      }
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a') && mobile.matches) setMenu(false, true);
    });
    mobile.addEventListener('change', () => setMenu(false, true));
    reduced.addEventListener('change', () => setMenu(menu.getAttribute('aria-expanded') === 'true', true));
    setMenu(false, true);
  }

  document.querySelectorAll('.btn-primary').forEach(button => {
    button.append(icon([['M4 12h15M13 6l6 6-6 6']]));
  });
  const waveButton = document.getElementById('wave-toggle');
  if (waveButton) {
    const sync = () => { waveButton.dataset.waveState = /^Pause/.test(waveButton.textContent.trim()) ? 'playing' : 'paused'; };
    new MutationObserver(sync).observe(waveButton, {childList:true, subtree:true});
    sync();
  }

  // Grid reveal adapts to real content without fixed heights. Long appendices open immediately.
  const disclosureControllers = [];
  document.querySelectorAll('details.technical-details,details.explanation').forEach(details => {
    const summary = [...details.children].find(child => child.tagName === 'SUMMARY');
    if (!summary) return;
    const body = document.createElement('div');
    const inner = document.createElement('div');
    body.className = 'disclosure-body';
    inner.className = 'disclosure-inner';
    [...details.childNodes].filter(child => child !== summary).forEach(child => inner.append(child));
    body.append(inner); details.append(body);
    summary.append(icon([['M5 12h14'], ['M12 5v14', 'vertical']], 'disclosure-icon'));
    details.classList.add('is-enhanced');
    let desired = details.open;
    let timer = 0;
    let moving = false;
    const finish = () => {
      clearTimeout(timer);
      details.classList.add('is-instant');
      details.classList.toggle('is-expanded', desired);
      details.open = desired;
      inner.inert = false; // Native closed details already hide focus; keep browser Find available at rest.
      moving = false;
    };
    const change = open => {
      clearTimeout(timer);
      desired = open;
      moving = true;
      details.classList.remove('is-instant');
      if (open) details.open = true;
      inner.inert = !open;
      if (!open) {
        inner.querySelectorAll('video').forEach(video => video.pause());
        if (details.contains(document.activeElement) && document.activeElement !== summary) summary.focus({preventScroll:true});
      }
      if (reduced.matches || inner.scrollHeight > Math.max(900, innerHeight * 1.5)) { finish(); return; }
      body.getBoundingClientRect(); // Commit the current grid before changing its target once per action.
      details.classList.toggle('is-expanded', open);
      timer = setTimeout(finish, 260);
    };
    finish();
    summary.addEventListener('click', event => {
      if (event.defaultPrevented || event.target.closest('a,button,input,select,textarea') || event.metaKey || event.ctrlKey || event.altKey) return;
      event.preventDefault();
      change(!desired);
    });
    details.addEventListener('toggle', () => {
      if (!moving && details.open !== desired) { desired = details.open; finish(); }
    });
    disclosureControllers.push(finish);
  });
  reduced.addEventListener('change', () => disclosureControllers.forEach(finish => finish()));

  // Source images stay unchanged. The original destination remains available in the viewer and with modifier-click.
  if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;
  const links = [...document.querySelectorAll('a.image-link,a.lab-image')].filter(link => link.querySelector('img'));
  if (!links.length) return;
  const viewer = document.createElement('dialog');
  viewer.className = 'figure-viewer';
  viewer.setAttribute('aria-labelledby', 'figure-viewer-title');
  viewer.innerHTML = '<div class="viewer-heading"><h2 id="figure-viewer-title"></h2><button type="button" class="viewer-button viewer-close" aria-label="Close figure"></button></div><div class="viewer-tools"><button type="button" class="viewer-button viewer-zoom" aria-pressed="false" aria-controls="figure-viewer-stage">Actual size</button><a class="viewer-original" target="_blank" rel="noopener">Open original file ↗</a></div><div id="figure-viewer-stage" class="viewer-stage" tabindex="0" role="region" aria-label="Figure inspection area" aria-describedby="figure-viewer-help"><p class="viewer-status" role="status"></p><img class="viewer-image" hidden></div><div class="viewer-context"><p id="figure-viewer-help">Fit to window. Select Actual size to inspect details; scroll or use arrow keys in the image area.</p><details><summary>Read figure context and labels</summary><p class="viewer-caption"></p></details></div>';
  document.body.append(viewer);
  const title = viewer.querySelector('h2');
  const closeButton = viewer.querySelector('.viewer-close');
  const zoom = viewer.querySelector('.viewer-zoom');
  const original = viewer.querySelector('.viewer-original');
  const stage = viewer.querySelector('.viewer-stage');
  const image = viewer.querySelector('.viewer-image');
  const status = viewer.querySelector('.viewer-status');
  const help = viewer.querySelector('#figure-viewer-help');
  const caption = viewer.querySelector('.viewer-caption');
  const context = viewer.querySelector('.viewer-context details');
  closeButton.append(icon([['M6 6l12 12M18 6L6 18']]));
  let opener = null;
  zoom.addEventListener('click', () => {
    const actual = zoom.getAttribute('aria-pressed') !== 'true';
    zoom.setAttribute('aria-pressed', String(actual));
    stage.classList.toggle('is-actual', actual);
    stage.scrollLeft = 0; stage.scrollTop = 0;
    help.textContent = actual ? 'Actual size. Focus the image area to scroll with arrow keys, or select Actual size again to fit the window.' : 'Fit to window. Select Actual size to inspect details; scroll or use arrow keys in the image area.';
  });
  closeButton.addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const rect = viewer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
  });
  viewer.addEventListener('close', () => {
    document.body.classList.remove('figure-viewing');
    opener?.focus({preventScroll:true});
  });
  links.forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const source = link.querySelector('img');
      const figure = link.closest('figure');
      opener = link;
      const linkTitle = link.getAttribute('aria-label')?.replace(/^Open\s+(?:the\s+)?/i, '').replace(/\bfull[ -]size\b/gi, '').trim();
      const heading = figure?.querySelector('h3,h4')?.textContent.trim()
        || (linkTitle && !/^(figure|image|photograph)$/i.test(linkTitle) ? linkTitle : '')
        || figure?.querySelector('figcaption strong')?.textContent.trim()
        || 'Research figure';
      title.textContent = heading.charAt(0).toUpperCase() + heading.slice(1);
      caption.textContent = figure?.querySelector('figcaption')?.textContent.trim() || source.alt || 'No additional caption was supplied.';
      image.alt = source.alt;
      original.href = link.href;
      zoom.setAttribute('aria-pressed', 'false');
      zoom.disabled = true;
      stage.classList.remove('is-actual');
      stage.scrollLeft = 0; stage.scrollTop = 0;
      context.open = false;
      help.textContent = 'Fit to window. Select Actual size to inspect details; scroll or use arrow keys in the image area.';
      status.hidden = false; status.textContent = 'Loading source figure…'; image.hidden = true;
      image.onload = () => {
        // A viewBox-only SVG has no natural pixel size. Use its supplied figure dimensions.
        const svg = /\.svg(?:[?#]|$)/i.test(link.href);
        const width = svg ? Number(source.getAttribute('width')) || image.naturalWidth : image.naturalWidth;
        const height = svg ? Number(source.getAttribute('height')) || image.naturalHeight : image.naturalHeight;
        image.style.setProperty('--source-width', `${width}px`);
        image.style.setProperty('--source-height', `${height}px`);
        viewer.style.setProperty('--figure-ratio', `${width} / ${height}`);
        status.hidden = true; image.hidden = false; zoom.disabled = false;
      };
      image.onerror = () => { status.hidden = false; status.textContent = 'The source figure could not load. Use Open original file to view or download it.'; image.hidden = true; };
      image.src = link.href;
      viewer.showModal();
      document.body.classList.add('figure-viewing');
      closeButton.focus({preventScroll:true});
    });
  });
})();
