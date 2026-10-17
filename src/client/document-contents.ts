export {};

const panel = document.querySelector<HTMLDetailsElement>('.page-contents-panel');
if (panel) {
  const desktop = matchMedia('(min-width: 80rem)');
  const resize = () => {
    panel.open = desktop.matches;
  };
  resize();
  desktop.addEventListener('change', resize);
  panel.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', () => {
      if (!desktop.matches) panel.open = false;
    });
  });
}
