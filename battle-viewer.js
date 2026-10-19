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
  function openBattle(kind, opener, battleId = null) {
    if (dialog.open) return false;
    session = { kind, opener, battleId, reading: gameStarted, index: returnIndex(), resumeMusic: !soundtrack.paused };
    if (gameStarted && phase === 'typing') finishCurrent();
    if (kind !== 'chapter') soundtrack.pause();
    frame.src = kind === 'chapter' ? 'battle/story.html' : kind === 'playable' ? 'battle/playable.html' : 'battle/effect-target-v9.html';
    dialog.showModal();
    frame.focus();
    return true;
  }
  function closeBattle(completed = false) {
    if (!dialog.open || !session) return;
    const previous = session;
    session = null;
    // Unload the frame so pending turns, effects, and timers cannot keep running.
    frame.removeAttribute('src');
    dialog.close();
    if (completed && previous.kind === 'chapter') {
      const nextIndex = window.chapterBattles.complete(previous.battleId);
      if (previous.reading && idx === previous.index && Number.isInteger(nextIndex) && nextIndex >= 0) goTo(nextIndex);
      saveProgress();
      if (previous.resumeMusic) soundtrack.play().catch(() => {});
      document.getElementById('next').focus();
    } else if (completed && previous.kind === 'playable' && !previous.reading) {
      closeTitle();
      goTo(previous.index);
      saveProgress();
      document.getElementById('next').focus();
    } else {
      if (previous.resumeMusic) soundtrack.play().catch(() => {});
      previous.opener.focus();
    }
  }
  for (const [id, kind] of [['battleOpen', 'playable'], ['effectDemoOpen', 'demo']]) {
    const button = document.getElementById(id);
    button.addEventListener('click', () => openBattle(kind, button));
  }
  window.akatsukiBattle = {
    openChapter(id) {
      if (id !== 'iga-protect-ieyasu') return false;
      return openBattle('chapter', document.getElementById('next'), id);
    }
  };
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
    if (session.kind === 'chapter') {
      if (event.data?.battleId !== session.battleId) return;
      if (event.data.type === 'akatsuki:chapter-close') closeBattle();
      if (event.data.type === 'akatsuki:chapter-complete') closeBattle(true);
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
