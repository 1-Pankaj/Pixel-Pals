/* Pixel Pals — picker window logic */
(function () {
  'use strict';

  const params = new URLSearchParams(location.search);
  const currentPet = params.get('pet') || null;

  const cardsEl = document.getElementById('cards');
  const SFX = window.PET_SFX;

  document.getElementById('tb-close').addEventListener('click', () => {
    window.close();
  });

  const pets = [
    { id: 'mochi', name: 'Mochi', species: 'Orange Tabby', tagline: 'Professional napper. Will judge your playlist, lovingly.' },
    { id: 'biscuit', name: 'Biscuit', species: 'Shiba Inu', tagline: 'Maximum loyalty, minimum chill. 10/10 would fetch.' },
    { id: 'pudding', name: 'Pudding', species: 'Mint Slime', tagline: 'Small, squishy, full of big dreams and jelly.' },
    { id: 'luna', name: 'Luna', species: 'Little Ghost', tagline: 'Mostly here for the cozy vibes and gentle hovering.' },
    { id: 'clover', name: 'Clover', species: 'Bunny', tagline: 'Ears at maximum altitude. Heart at maximum softness.' },
    { id: 'miso', name: 'Miso', species: 'Axolotl', tagline: 'Always smiling. Scientifically unable to frown.' }
  ];

  const previews = [];

  pets.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'card' + (currentPet === p.id ? ' current' : '');

    const canvas = document.createElement('canvas');
    canvas.width = 32 * 3;
    canvas.height = 32 * 3;
    const g = canvas.getContext('2d');
    g.imageSmoothingEnabled = false;

    const info = document.createElement('div');
    info.className = 'info';
    info.innerHTML =
      '<div class="name">' + p.name + '<span class="badge">adopted</span></div>' +
      '<div class="species">' + p.species + '</div>' +
      '<div class="tagline">' + p.tagline + '</div>';

    const btn = document.createElement('button');
    btn.className = 'adopt';
    btn.textContent = 'ADOPT';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      SFX.unlock();
      SFX.chime();
      burst(p.id);
      setTimeout(() => window.petAPI.adopt(p.id), 550);
    });

    card.appendChild(canvas);
    card.appendChild(info);
    card.appendChild(btn);
    cardsEl.appendChild(card);

    card.addEventListener('mouseenter', () => {
      previews.find(x => x.id === p.id).happyUntil = Date.now() + 1400;
    });

    previews.push({
      id: p.id,
      sprite: PIXEL_PALS.build(p.id),
      g,
      blinkUntil: 0,
      nextBlink: Date.now() + 1500 + Math.random() * 3000,
      happyUntil: 0,
      hop: null
    });
  });

  function burst(id) {
    const pv = previews.find(x => x.id === id);
    if (pv) { pv.hop = { start: Date.now(), dur: 420, h: 14 }; pv.happyUntil = Date.now() + 1600; }
  }

  function hopY(pv, t) {
    if (!pv.hop) return 0;
    const k = (t - pv.hop.start) / pv.hop.dur;
    if (k >= 1) { pv.hop = null; return 0; }
    return pv.hop.h * Math.sin(Math.PI * k);
  }

  function loop() {
    const t = Date.now();
    for (const pv of previews) {
      const g = pv.g;
      g.clearRect(0, 0, 96, 96);
      g.save();
      g.scale(3, 3);
      g.translate(0, -0.4);

      if (t >= pv.nextBlink) {
        pv.blinkUntil = t + 130;
        pv.nextBlink = t + (Math.random() < 0.25 ? 320 : 2200 + Math.random() * 3200);
      }

      const happy = t < pv.happyUntil;
      const bob = Math.sin(t / 420) * 0.8 - 0.4;
      const hy = hopY(pv, t);

      g.save();
      g.translate(16, 31.4 - hy / 3 + bob * 0.25);
      g.scale(1 + (happy ? 0.03 : 0), 1 - (happy ? 0.03 : 0));
      g.translate(-16, -30);
      pv.sprite.draw(g, {
        face: happy ? 'happy' : (t < pv.blinkUntil ? 'blink' : 'open'),
        mouth: happy ? 'open' : 'idle',
        tail: Math.floor(t / (happy ? 160 : 900)) % 2,
        sprout: Math.floor(t / 1600) % 2,
        dx: 0, dy: 0
      });
      g.restore();
      g.restore();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // gentle unlock of audio on any click (needed for later sounds)
  window.addEventListener('pointerdown', () => SFX.unlock(), { once: true });

  /* ---------------- keyboard navigation ----------------
   * Arrow keys move between cards, Enter adopts, Escape closes. */
  let kbIndex = Math.max(0, pets.findIndex(p => p.id === currentPet));
  let kbCards = [];

  function drawKbFocus() {
    kbCards.forEach((el, i) => el.classList.toggle('kb-focus', i === kbIndex));
    const el = kbCards[kbIndex];
    if (el) {
      previews.find(x => x.id === pets[kbIndex].id).happyUntil = Date.now() + 900;
    }
  }

  window.addEventListener('keydown', (e) => {
    const cols = window.innerWidth >= 500 ? 2 : 1;
    if (e.key === 'Escape') { window.close(); return; }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      kbIndex = (kbIndex + 1) % pets.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      kbIndex = (kbIndex - 1 + pets.length) % pets.length;
    } else if (e.key === 'Enter') {
      const btn = kbCards[kbIndex] && kbCards[kbIndex].querySelector('button.adopt');
      if (btn) btn.click();
      return;
    } else {
      return;
    }
    e.preventDefault();
    drawKbFocus();
  });

  // collect card elements after creation (cards were appended above)
  kbCards = Array.prototype.slice.call(document.querySelectorAll('#cards .card'));
  drawKbFocus();
})();
