function fitElevenLabsWidget() {
  const widget = document.querySelector('elevenlabs-convai');
  const root = widget?.shadowRoot;
  if (!root) return false;

  const overlay = root.querySelector('.overlay');
  const sheet = root.querySelector('.sheet');
  if (!overlay || !sheet) return false;
  const poweredBy = [...root.querySelectorAll('p')]
    .find((element) => element.textContent?.includes('Powered by'));

  overlay.style.inset = '0';
  overlay.style.right = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.justifyContent = 'stretch';
  overlay.style.alignItems = 'stretch';

  sheet.dataset.variant = 'fullscreen';
  sheet.style.inset = '0 0 34px 0';
  sheet.style.top = '0';
  sheet.style.right = '0';
  sheet.style.bottom = '34px';
  sheet.style.left = '0';
  sheet.style.width = '100%';
  sheet.style.maxWidth = 'none';
  sheet.style.height = '100%';
  sheet.style.maxHeight = 'none';
  sheet.style.margin = '0';
  sheet.style.borderRadius = 'var(--el-sheet-radius)';
  sheet.style.transform = 'none';
  sheet.style.transformOrigin = 'center';

  if (poweredBy) {
    poweredBy.style.position = 'absolute';
    poweredBy.style.right = '16px';
    poweredBy.style.bottom = '10px';
    poweredBy.style.lineHeight = '18px';
    poweredBy.style.transform = 'none';
    poweredBy.style.padding = '0';
    poweredBy.style.zIndex = '20';
  }

  return true;
}

function keepWidgetFitted() {
  if (!fitElevenLabsWidget()) return;

  const root = document.querySelector('elevenlabs-convai')?.shadowRoot;
  if (!root || root.dataset.fitObserverAttached === 'true') return;

  root.dataset.fitObserverAttached = 'true';
  const observer = new MutationObserver(() => fitElevenLabsWidget());
  observer.observe(root, {
    attributes: true,
    childList: true,
    subtree: true,
  });
}

window.addEventListener('load', () => {
  keepWidgetFitted();
  const interval = window.setInterval(() => {
    keepWidgetFitted();
    if (document.querySelector('elevenlabs-convai')?.shadowRoot?.querySelector('.sheet')) {
      window.clearInterval(interval);
    }
  }, 250);
  window.setTimeout(() => window.clearInterval(interval), 8000);
});
