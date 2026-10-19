(() => {
  const buttons = [...document.querySelectorAll('.command-grid button')];
  function select(button) {
    for (const other of buttons) other.classList.toggle('is-selected', other === button);
  }
  buttons.forEach(button => button.addEventListener('click', () => select(button)));
  document.getElementById('resetScene').addEventListener('click', () => select(buttons[0]));
  select(buttons[0]);
})();
