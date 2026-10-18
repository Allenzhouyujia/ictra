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
  let head = 0, time = 0, seed = 7;
  let paused = reduced.matches, visible = false, frame = 0, last = 0, carried = 0;
  const random = () => { seed = seed * 16807 % 2147483647; return seed / 2147483647 - 0.5; };
  // Background EEG: a 1/f-weighted mixture of non-harmonic rhythms with drifting phase,
  // alpha (8-12 Hz) that waxes and wanes, and a little sensor noise. Seizure: rhythmic
  // spike-and-wave at ~3-4 Hz that builds in amplitude and speeds up slightly.
  const eegBands = [1.3, 2.7, 4.4, 6.1, 7.4, 9.8, 13.2, 17.9, 22.6].map((f, i) => ({f, a: 0.7 / Math.pow(f, 0.6), ph: i * 1.7}));
  let rr = 60 / 72, beatT = 0, alphaEnv = 0, alphaTarget = 0.4, drift = 0, emgBurst = 0;
  function gauss(x, w) { return Math.exp(-(x * x) / (2 * w * w)); }
  function sample() {
    time += 1 / sampleRate;
    const cycle = time % 22;
    const ramp = cycle > 11 && cycle < 19 ? Math.min(1, (cycle - 11) / 2.5) : 0;

    // ---- EEG ----
    if (Math.floor(time * sampleRate) % 160 === 0) alphaTarget = 0.08 + 0.45 * (random() + 0.5);
    alphaEnv += (alphaTarget - alphaEnv) * 0.004;
    drift += (random() * 0.02 - drift * 0.002);
    let eeg = drift;
    for (const b of eegBands) { b.ph += random() * 0.002; eeg += b.a * Math.sin(2 * Math.PI * b.f * time + b.ph); }
    eeg += alphaEnv * Math.sin(2 * Math.PI * 10.2 * time) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 0.9 * time));
    eeg += 0.09 * random();
    if (ramp) {
      const f = 3.0 + 1.2 * ramp;                      // spike-and-wave frequency
      const ph = (time * f) % 1;                       // 0..1 within one complex
      const spike = 1.8 * gauss(ph - 0.08, 0.035);     // sharp spike
      const wave = -0.9 * Math.sin(Math.PI * Math.max(0, Math.min(1, (ph - 0.14) / 0.7)));  // slow wave
      eeg = (0.35 + 0.65 * ramp) * (spike + wave) + 0.3 * (1 - ramp) * eeg + 0.08 * random();
    }

    // ---- ECG: P-QRS-T from Gaussians, with RR variability and baseline wander ----
    beatT += 1 / sampleRate;
    if (beatT >= rr) { beatT -= rr; const hr = 72 + 58 * ramp; rr = 60 / hr * (1 + 0.05 * random()); }
    const t = beatT;
    let ecg = 0.14 * gauss(t - 0.16, 0.025)            // P
            - 0.12 * gauss(t - 0.235, 0.008)           // Q
            + 1.0  * gauss(t - 0.25, 0.010)            // R
            - 0.28 * gauss(t - 0.268, 0.009)           // S
            + 0.32 * gauss(t - 0.48, 0.045);           // T
    ecg += 0.03 * Math.sin(2 * Math.PI * 0.25 * time) + 0.015 * random();

    // ---- EMG: quiet baseline, occasional small bursts; tonic then clonic during the event ----
    if (random() > 0.497) emgBurst = 0.5 + random();
    emgBurst *= 0.97;
    let emg = (0.06 + 0.5 * emgBurst) * random();
    if (ramp) {
      const clonic = ramp > 0.6 ? (Math.sin(2 * Math.PI * 3.2 * time) > 0.2 ? 1 : 0.25) : 1;
      emg = (0.5 + 1.1 * ramp) * clonic * random();
    }

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
    if (paused || !visible || document.hidden || document.documentElement.classList.contains('intro-active')) return;
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
    if (!paused && visible && !document.hidden && !document.documentElement.classList.contains('intro-active')) frame = requestAnimationFrame(loop);
  }
  for (let i = 0; i < count; i++) sample();
  button.disabled = false;
  button.addEventListener('click', () => { paused = !paused; sync(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('ictra:introchange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, {threshold: .05}).observe(panel);
  } else visible = true;
  sync();
})();
