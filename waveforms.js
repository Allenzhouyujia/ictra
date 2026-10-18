/* Synthetic signal demo, adapted from the original ICTRA waveform equations.
   No device connection, patient data, classifier output or alert simulation. */
(() => {
  const panel = document.getElementById('signal-demo');
  if (!panel) return;
  const button = document.getElementById('wave-toggle');
  const status = document.getElementById('wave-state');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const names = ['eeg', 'ecg', 'emg'];
  const paths = names.map(name => document.getElementById(`wave-${name}`));
  const count = 960, sampleRate = 160;
  const buffers = names.map(() => new Float32Array(count));
  let head = 0, time = 0, beatPhase = 0, seed = 7;
  let paused = reduced.matches, visible = false, frame = 0, last = 0, carried = 0;
  const random = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647 - 0.5; };
  function sample() {
    time += 1 / sampleRate;
    const cycle = time % 22;
    const ramp = cycle > 11 && cycle < 19 ? Math.min(1, (cycle - 11) / 2.5) : 0;
    let eeg = .35 * Math.sin(2 * Math.PI * 10 * time) + .25 * Math.sin(2 * Math.PI * 2.1 * time) + .12 * random();
    if (ramp) eeg = (.4 + 1.4 * ramp) * Math.sin(2 * Math.PI * 3 * time) + .3 * ramp * Math.sin(2 * Math.PI * 9 * time) + .1 * random();
    beatPhase = (beatPhase + (72 + 58 * ramp) / 60 / sampleRate) % 1;
    let ecg = .05 * Math.sin(2 * Math.PI * beatPhase * 2);
    if (beatPhase < .04) ecg = -.2;
    else if (beatPhase < .09) ecg = 1;
    else if (beatPhase < .13) ecg = -.35;
    else if (beatPhase > .3 && beatPhase < .45) ecg = .25 * Math.sin(Math.PI * (beatPhase - .3) / .15);
    let emg = .12 * random();
    if (cycle % 7 > 5.6 && cycle % 7 < 6) emg = .6 * random();
    if (ramp) emg = (.6 + .8 * ramp) * random();
    buffers[0][head] = eeg;
    buffers[1][head] = ecg;
    buffers[2][head] = emg;
    head = (head + 1) % count;
  }
  function draw() {
    paths.forEach((path, lane) => {
      const points = [];
      for (let i = 0; i < count; i++) {
        const value = buffers[lane][(head + i) % count];
        points.push(`${(86 + i / (count - 1) * 510).toFixed(1)},${(58 + lane * 100 - value * (lane === 1 ? 32 : 20)).toFixed(1)}`);
      }
      path.setAttribute('points', points.join(' '));
    });
    const cycle = time % 22;
    status.textContent = paused ? (reduced.matches ? 'Paused · reduced motion' : 'Paused · synthetic signals') : cycle > 11 && cycle < 19 ? 'Increased activity · synthetic' : 'Baseline pattern · synthetic';
  }
  function loop(now) {
    frame = 0;
    if (paused || !visible || document.hidden) return;
    if (!last) last = now;
    const elapsed = now - last;
    if (elapsed >= 1000 / 30) {
      carried += Math.min(elapsed / 1000, .1);
      last = now;
      while (carried >= 1 / sampleRate) { sample(); carried -= 1 / sampleRate; }
      draw();
    }
    frame = requestAnimationFrame(loop);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; last = 0; carried = 0;
    button.textContent = paused ? 'Play waves' : 'Pause waves';
    draw();
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(loop);
  }
  for (let i = 0; i < count; i++) sample();
  button.disabled = false;
  button.addEventListener('click', () => { paused = !paused; sync(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, {threshold: .05}).observe(panel);
  } else visible = true;
  sync();
})();
