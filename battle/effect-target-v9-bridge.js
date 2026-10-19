// This imported file is an effects demo, not a combat rules engine.
const battleReturn = document.getElementById('battleReturn');
if (window.parent === window) {
  battleReturn.hidden = true;
} else {
  function returnToReader() {
    window.parent.postMessage({ type: 'akatsuki:battle-demo-close' }, window.location.origin);
  }
  battleReturn.addEventListener('click', returnToReader);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      returnToReader();
    }
  });
}
const targetToggle = document.getElementById('points');
targetToggle.setAttribute('aria-pressed', 'false');
targetToggle.addEventListener('click', () => {
  targetToggle.setAttribute('aria-pressed', String(showPoints));
});
