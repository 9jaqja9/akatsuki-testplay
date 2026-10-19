// Canvas effects adapted from battle/effect-target-v9.html with its original textures.
(() => {
  const canvas = document.querySelector('#fx');
  const ctx = canvas.getContext('2d');
  const status = document.querySelector('#status');
  const images = {};
  for (const key of ['thunder', 'fire', 'halo', 'particle']) {
    const img = new Image();
    img.src = '../assets/battle-v9/' + key + '.png';
    images[key] = img;
  }
  const targets = {frontline: {x: 1030, y: 550}, hanzo: {x: 640, y: 550}, ieyasu: {x: 420, y: 550}};
  const labels = {slash: '虎徹の斬撃', hien: '飛燕', thunder: '半蔵の雷忍術', guard: '家康を守る', heal: '回復薬', combo: '半蔵とあやめの連携'};
  let effect = null;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  function sprite(key, x, y, width, height, alpha = 1, rotation = 0) {
    const img = images[key];
    if (!img.complete || !img.naturalWidth) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
  }
  // Original v9 slash and thunder drawing, positioned on the selected half.
  function slash(hit, t) {
    ctx.save();
    ctx.translate(hit.x, hit.y);
    ctx.rotate(-.6);
    ctx.strokeStyle = 'rgba(240,252,255,' + clamp(1 - t, 0, 1) + ')';
    ctx.lineWidth = 18;
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#c9e7ff';
    ctx.beginPath();
    ctx.moveTo(-145, -90);
    ctx.quadraticCurveTo(0, 10, 145, 90);
    ctx.stroke();
    ctx.restore();
    sprite('particle', hit.x, hit.y, 210, 210, clamp(1 - t, 0, 1));
  }
  function thunder(hit, t) {
    for (let i = 0; i < 5; i++) {
      sprite('thunder', hit.x + (i - 2) * 22, hit.y - 80 + Math.sin(t * 22 + i) * 14,
        65, 270, clamp(1 - t / 1.15, 0, 1), Math.sin(t * 12 + i) * .22);
    }
    sprite('halo', hit.x, hit.y, 220, 220, .45 * clamp((t - .2) / .2, 0, 1));
  }
  function heal(hit, t) {
    sprite('halo', hit.x, hit.y, 220 + t * 60, 220 + t * 60, clamp(1 - t / 1.25, 0, 1));
    for (let i = 0; i < 8; i++) {
      sprite('particle', hit.x + Math.sin(i * 2) * 65, hit.y + 75 - (t * 110 + i * 12) % 220,
        35, 35, clamp(1 - t / 1.5, 0, 1));
    }
  }
  function frame(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (effect) {
      const t = (now - effect.start) / 1000;
      if (t >= 1.55) {
        effect = null;
        status.textContent = '準備完了';
      } else {
        const alliedEffect = ['heal', 'guard'].includes(effect.kind);
        ctx.save();
        ctx.beginPath();
        ctx.rect(alliedEffect ? 0 : canvas.width / 2, 0, canvas.width / 2, canvas.height);
        ctx.clip();
        const hit = targets.frontline;
        if (effect.kind === 'slash') slash(hit, t);
        if (effect.kind === 'thunder') thunder(hit, t);
        if (effect.kind === 'hien') {
          // Wind trail with the provided v9 particle texture.
          for (let i = 0; i < 4; i++) {
            const angle = t * 15 + i * Math.PI / 2;
            sprite('particle', hit.x + Math.cos(angle) * 65, hit.y + Math.sin(angle) * 65,
              105, 45, clamp(1 - t, 0, 1), angle);
          }
          sprite('halo', hit.x, hit.y, 160, 160, clamp(1 - t, 0, 1), t * 8);
        }
        if (effect.kind === 'guard') {
          sprite('halo', targets.ieyasu.x, targets.ieyasu.y, 240, 300, clamp(1 - t / 1.5, 0, 1));
        }
        if (effect.kind === 'heal') {
          for (const x of [200, 420, 640]) heal({x, y: 550}, t);
        }
        if (effect.kind === 'combo') {
          slash(hit, t);
          if (t > .2) thunder(hit, t - .2);
        }
        ctx.restore();
      }
    }
    requestAnimationFrame(frame);
  }
  window.akatsukiReferenceEffects = {
    run(kind) {
      if (!labels[kind]) return;
      effect = {kind, start: performance.now()};
      status.textContent = labels[kind];
    },
    clear() {
      effect = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      status.textContent = '準備完了';
    }
  };
  requestAnimationFrame(frame);
})();
