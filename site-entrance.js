/* A single, muted 4-second concept clip before the first visit in this tab.
   ?intro=1 replays it; intentful deep links and reduced-motion users bypass it. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'ictra-entry-seen-v1';
  const replay = new URL(location.href).searchParams.get('intro') === '1';
  const skip = reason => {
    root.dataset.entryState = 'skipped'; root.dataset.entryReason = reason;
    try { sessionStorage.setItem(key, '1'); } catch (_) { /* An intentional bypass still counts as entry. */ }
  };
  if (reduced.matches) { skip('reduced-motion'); return; }
  if (location.hash) { skip('deep-link'); return; }
  if (document.hidden) { skip('background'); return; }
  if (performance.getEntriesByType('navigation')[0]?.type === 'back_forward') { skip('history'); return; }
  if (!replay && performance.now() > 1800) { skip('late-bootstrap'); return; }
  try { if (!replay && sessionStorage.getItem(key) === '1') { skip('session'); return; } } catch (_) { /* Private storage must not block access. */ }
  if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) { skip('unsupported'); return; }

  const dialog = document.createElement('dialog');
  dialog.className = 'site-entrance';
  dialog.id = 'site-entrance';
  dialog.setAttribute('aria-labelledby', 'entry-title');
  dialog.setAttribute('aria-describedby', 'entry-caption');
  dialog.innerHTML = '<div class="entry-header"><span class="entry-brand" aria-hidden="true">ICTRA</span><h2 class="entry-title" id="entry-title">ICTRA concept introduction</h2><button type="button" class="entry-skip">Skip intro</button></div><div class="entry-media"><video class="entry-video" src="assets/video/intro.mp4" poster="assets/video/intro-poster.jpg" muted playsinline preload="auto" aria-label="AI-generated concept animation of the proposed sensor patch assembling"></video></div><p class="entry-caption" id="entry-caption"><strong>Concept render (AI-generated)</strong>Proposed wearable design, not verified hardware or experimental evidence.</p>';
  document.body.append(dialog);
  const video = dialog.querySelector('video');
  const button = dialog.querySelector('button');
  video.muted = true;
  video.defaultMuted = true;
  let finished = false, safetyTimer = 0, startupTimer = 0, exitTimer = 0;
  const focusMain = () => {
    const main = document.querySelector('main');
    if (!main) return;
    const original = main.getAttribute('tabindex');
    if (original === null) {
      main.setAttribute('tabindex', '-1');
      main.addEventListener('blur', () => main.removeAttribute('tabindex'), {once:true});
    }
    main.focus({preventScroll:true});
  };
  const complete = () => {
    clearTimeout(exitTimer);
    if (dialog.open) dialog.close();
    root.classList.remove('intro-active');
    root.dataset.entryState = 'done';
    video.removeAttribute('src');
    video.load();
    dialog.remove();
    document.dispatchEvent(new CustomEvent('ictra:introchange'));
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', focusMain, {once:true});
    else focusMain();
  };
  const dismiss = (reason, immediate = false) => {
    if (finished) return;
    finished = true;
    clearTimeout(safetyTimer); clearTimeout(startupTimer);
    video.pause();
    root.dataset.entryReason = reason;
    if (immediate || reduced.matches) complete();
    else { dialog.classList.add('is-leaving'); exitTimer = setTimeout(complete, 190); }
  };
  button.addEventListener('click', () => dismiss('skip'));
  dialog.addEventListener('cancel', event => { event.preventDefault(); dismiss('escape'); });
  dialog.addEventListener('close', () => { if (!finished) dismiss('closed', true); });
  video.addEventListener('ended', () => dismiss('ended'));
  video.addEventListener('error', () => dismiss('media-error', true));
  video.addEventListener('playing', () => {
    if (!finished) { root.dataset.entryState = 'playing'; clearTimeout(startupTimer); }
  });
  reduced.addEventListener('change', () => { if (reduced.matches) dismiss('reduced-motion', true); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) dismiss('background', true); });
  window.addEventListener('pagehide', () => dismiss('pagehide', true), {once:true});
  try {
    dialog.showModal();
    root.classList.add('intro-active');
    root.dataset.entryState = 'loading';
    try { sessionStorage.setItem(key, '1'); } catch (_) { /* Session storage is optional. */ }
    document.dispatchEvent(new CustomEvent('ictra:introchange'));
    button.focus({preventScroll:true});
    // Only the playing event cancels this deadline; decoded data alone is not playback.
    startupTimer = setTimeout(() => dismiss('slow-start', true), 1600);
    safetyTimer = setTimeout(() => dismiss('timeout', true), 6500);
    const play = video.play();
    if (play?.catch) play.catch(() => dismiss('autoplay-blocked', true));
  } catch (_) { dismiss('unavailable', true); }
})();
