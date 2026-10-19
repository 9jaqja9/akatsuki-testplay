(() => {
  const battleId = 'iga-protect-ieyasu';
  const beats = [
    {
      action: '家康の前に立つ', speaker: '半蔵', character: 'hanzo', cue: 'guard',
      text: '半蔵は家康へ近づく者を、正確に退ける。\n守るべき人を背に、虎鉄が迫る刃を受け止めた。',
      hint: '家康の前を守った。反対側では、あやめが飛燕を構える。'
    },
    {
      action: 'あやめと道を開く', speaker: 'あやめ', character: 'ayame', cue: 'slash',
      text: '反対側では、飛燕が迫る敵をまとめて弾き飛ばした。\n半蔵とあやめが、家康を挟んで道を開く。',
      hint: '二人の連携が、包囲にわずかな切れ目を作った。'
    },
    {
      action: '家康とともに押し返す', speaker: '家康', character: 'ieyasu', cue: 'guard',
      text: '家康自身も刀を抜く。\n護られるだけではなく、自らも一行の道を切り開こうとしていた。',
      hint: '最初の襲撃をしのいだ。家康が、前へ出るあやめに声を掛ける。'
    }
  ];
  const action = document.getElementById('storyAction');
  const finish = document.getElementById('finishBattle');
  const readOnly = document.getElementById('readOnly');
  const summary = document.getElementById('readingSummary');
  const speaker = document.getElementById('speaker');
  const text = document.getElementById('sceneText');
  const hint = document.getElementById('actionHint');
  let step = 0;
  let finished = false;
  let timer = null;
  function notify(type) {
    const origin = location.protocol === 'file:' ? '*' : location.origin;
    window.parent.postMessage({ type, battleId }, origin);
  }
  function markProgress() {
    beats.forEach((_, i) => {
      const element = document.getElementById(`beat${i}`);
      element.classList.toggle('done', i < step);
      if (i === step) element.setAttribute('aria-current', 'step');
      else element.removeAttribute('aria-current');
    });
  }
  function showBeat(beat) {
    speaker.textContent = beat.speaker;
    text.textContent = beat.text;
    hint.textContent = beat.hint;
    document.querySelectorAll('.character').forEach(img => img.classList.toggle('active', img.dataset.character === beat.character));
    const fx = document.getElementById('sceneFx');
    fx.className = '';
    void fx.offsetWidth;
    fx.className = beat.cue;
  }
  function finishScene() {
    finished = true;
    action.hidden = true;
    readOnly.hidden = true;
    finish.hidden = false;
  }
  action.addEventListener('click', () => {
    if (action.disabled || finished) return;
    action.disabled = true;
    showBeat(beats[step]);
    step++;
    markProgress();
    if (step < beats.length) action.replaceChildren(document.createTextNode(beats[step].action + ' 〉'));
    const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 650;
    timer = setTimeout(() => {
      timer = null;
      if (finished) return;
      action.disabled = false;
      if (step === beats.length) {
        finishScene();
        finish.focus();
      }
    }, delay);
  });
  readOnly.addEventListener('click', () => {
    clearTimeout(timer);
    timer = null;
    summary.replaceChildren();
    const heading = document.createElement('h2');
    heading.textContent = '守るべきもの';
    summary.append(heading);
    for (const beat of beats) {
      const paragraph = document.createElement('p');
      paragraph.textContent = beat.text;
      summary.append(paragraph);
    }
    summary.hidden = false;
    document.querySelector('.scene').hidden = true;
    document.querySelector('.story-controls').hidden = true;
    step = beats.length;
    showBeat(beats.at(-1));
    markProgress();
    finishScene();
    summary.append(finish);
    summary.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  document.getElementById('returnReader').addEventListener('click', () => notify('akatsuki:chapter-close'));
  finish.addEventListener('click', () => {
    if (finished) notify('akatsuki:chapter-complete');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      notify('akatsuki:chapter-close');
    }
  });
  if (window.parent === window) {
    document.getElementById('returnReader').hidden = true;
    finish.textContent = 'もう一度読む';
    finish.addEventListener('click', () => location.reload());
  }
  action.disabled = false;
  readOnly.disabled = false;
  document.getElementById('returnReader').disabled = false;
})();
