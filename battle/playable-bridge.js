(() => {
  const returnButton = document.getElementById('battleReturn');
  const completeButton = document.getElementById('battleComplete');
  if (window.parent === window) {
    returnButton.hidden = true;
    completeButton.hidden = true;
    return;
  }
  function notify(type) {
    const targetOrigin = location.protocol === 'file:' ? '*' : location.origin;
    window.parent.postMessage({ type }, targetOrigin);
  }
  returnButton.addEventListener('click', () => notify('akatsuki:battle-close'));
  completeButton.addEventListener('click', () => {
    if (turn >= 8 && document.getElementById('end').style.display === 'flex') {
      notify('akatsuki:battle-complete');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      notify('akatsuki:battle-close');
    }
  });
})();
