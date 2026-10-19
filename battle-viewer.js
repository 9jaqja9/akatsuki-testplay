(() => {
  const dialog = document.getElementById('battleDialog');
  const frame = document.getElementById('battleFrame');
  const soundtrack = document.getElementById('music');
  let session = null;

  function returnIndex() {
    if (gameStarted) return idx;
    let saved = 0;
    try { saved = Number(localStorage.getItem('akatsuki_testplay_save')) || 0; } catch {}
    return Math.min(units.length - 1, Math.max(0, Math.trunc(saved)));
  }
  function openBattle(kind, opener) {
    if (dialog.open) return;
    session = { kind, opener, reading: gameStarted, index: returnIndex(), resumeMusic: !soundtrack.paused };
    if (gameStarted && phase === 'typing') finishCurrent();
    soundtrack.pause();
    frame.src = kind === 'playable' ? 'battle/playable.html' : 'battle/effect-target-v9.html';
    dialog.showModal();
    frame.focus();
  }
  function closeBattle(completed = false) {
    if (!dialog.open || !session) return;
    const previous = session;
    session = null;
    // Unload the frame so pending turns, effects, and timers cannot keep running.
    frame.removeAttribute('src');
    dialog.close();
    if (completed && previous.kind === 'playable' && !previous.reading) {
      closeTitle();
      goTo(previous.index);
      saveProgress();
      document.getElementById('next').focus();
    } else {
      if (previous.resumeMusic) soundtrack.play().catch(() => {});
      previous.opener.focus();
    }
  }
  for (const [id, kind] of [['battleOpen', 'playable'], ['storyBattleOpen', 'playable'], ['effectDemoOpen', 'demo']]) {
    const button = document.getElementById(id);
    button.addEventListener('click', () => openBattle(kind, button));
  }
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeBattle();
  });
  window.addEventListener('message', event => {
    // Messages must come from the active sandboxed frame, whose origin is opaque.
    if (!dialog.open || !session || event.source !== frame.contentWindow || event.origin !== 'null') return;
    if (session.kind === 'demo') {
      if (event.data?.type === 'akatsuki:battle-demo-close') closeBattle();
      return;
    }
    if (event.data?.type === 'akatsuki:battle-close') closeBattle();
    if (event.data?.type === 'akatsuki:battle-complete') closeBattle(true);
  });
  document.addEventListener('keydown', event => {
    if (!dialog.open) return;
    event.stopImmediatePropagation();
    if (event.key === 'Escape') {
      event.preventDefault();
      closeBattle();
    }
  }, true);
})();
