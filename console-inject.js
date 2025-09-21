(() => {
  const img = document.querySelector('.eagle-footer-image');
  if (!img) {
    console.warn('No eagle-footer-image found');
    return;
  }

  /*** 1) STOP ORIGINAL LOOP ***/
  let id = setTimeout(() => {}, 0);
  while (id--) clearTimeout(id);
  id = setInterval(() => {}, 0);
  while (id--) clearInterval(id);

  const origRAF = window.requestAnimationFrame;
  window.requestAnimationFrame = () => {};

  /*** 2) SETTINGS ***/
  const totalFrames = 580; // 00000 through 00579 inclusive
  const pad = n => String(n).padStart(5, '0'); // comp_2_00000.png format
  const baseURL = 'https://trumpcard.gov/img/footer/footer-anim/comp_2_';

  const sensitivity = 3; // higher = more dramatic
  const snap = true;     // instant frame change
  const ease = 0.6;      // only used if snap=false

  let targetFrame = 0;
  let currentFrame = 0;

  /*** 3) MOUSE CONTROL ***/
  const onMouseMove = e => {
    const h = window.innerHeight || document.documentElement.clientHeight;
    const yRatio = Math.min(1, Math.max(0, e.clientY / h));
    const adjustedRatio = (1 - yRatio) ** (1 / sensitivity);
    targetFrame = Math.round(adjustedRatio * (totalFrames - 1));

    if (snap) {
      currentFrame = targetFrame;
      img.src = `${baseURL}${pad(currentFrame)}.png`;
    }
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  if (!snap) {
    const tick = () => {
      currentFrame += (targetFrame - currentFrame) * ease;
      img.src = `${baseURL}${pad(Math.round(currentFrame))}.png`;
      origRAF(tick);
    };
    tick();
  }

  /*** 4) US FLAG CURSOR ***/
  const flagURL = 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/48px-Flag_of_the_United_States.svg.png';
  const style = document.createElement('style');
  style.textContent = `
    body {
      cursor: url("${flagURL}") 16 16, auto !important;
    }
  `;
  document.head.appendChild(style);

  console.log(`Eagle head now follows mouse (full 0–579 frames) and cursor set to US flag image.`);
})();
