const panel = document.querySelector<HTMLDetailsElement>('.contents-panel');
const contents = panel?.querySelector<HTMLElement>('.textbook-sidebar');
if (panel && contents) {
  const desktop = matchMedia('(min-width: 64rem)');
  const revealCurrent = () => {
    const current = contents.querySelector<HTMLElement>('[aria-current="page"]');
    if (!panel.open || !current) return;
    // Scroll only the menu, so opening it never moves the reading position.
    const item = current.getBoundingClientRect();
    const viewport = contents.getBoundingClientRect();
    if (item.top < viewport.top || item.bottom > viewport.bottom) {
      contents.scrollTop += item.top - viewport.top - contents.clientHeight / 3;
    }
  };
  const resize = () => {
    // Preserve an open mobile menu while following a link to the legacy anchor.
    panel.open = desktop.matches || location.hash === '#unit-contents';
    requestAnimationFrame(revealCurrent);
  };
  resize();
  desktop.addEventListener('change', resize);
  panel.addEventListener('toggle', revealCurrent);
  const followFragment = () => {
    if (location.hash === '#unit-contents') panel.open = true;
  };
  window.addEventListener('hashchange', followFragment);
  document.querySelectorAll('a[href="#unit-contents"]').forEach((link) => {
    link.addEventListener('click', () => {
      // Clicking the same fragment again does not fire hashchange.
      panel.open = true;
    });
  });
}
