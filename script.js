function fitElevenLabsWidget() {
  const widget = document.querySelector('elevenlabs-convai');
  const root = widget?.shadowRoot;
  if (!root) return false;
  const isMobile = window.matchMedia('(max-width: 680px)').matches;

  const overlay = root.querySelector('.overlay');
  const sheet = root.querySelector('.sheet');
  if (!overlay || !sheet) return false;
  const poweredBy = [...root.querySelectorAll('p')]
    .find((element) => element.textContent?.includes('Powered by'));

  widget.style.setProperty('--el-overlay-padding', isMobile ? '8px' : '18px');
  widget.style.setProperty('--el-sheet-radius', isMobile ? '22px' : '24px');
  widget.style.setProperty('--el-input-radius', isMobile ? '14px' : '14px');

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
  sheet.style.borderRadius = isMobile ? '22px' : 'var(--el-sheet-radius)';
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

  replacePermissionError(root);
  fitActiveConversationLayout(root, sheet);

  return true;
}

function replacePermissionError(root) {
  const errorElement = [...root.querySelectorAll('div, p, span')]
    .find((element) => {
      const text = element.textContent || '';
      return (
        text.includes('An error occurred') &&
        text.includes('request is not allowed')
      );
    });

  if (!errorElement || errorElement.dataset.friendlyPermissionError === 'true') return;

  errorElement.dataset.friendlyPermissionError = 'true';
  errorElement.textContent = '';
  errorElement.style.display = 'flex';
  errorElement.style.flexDirection = 'column';
  errorElement.style.alignItems = 'center';
  errorElement.style.justifyContent = 'center';
  errorElement.style.gap = '10px';
  errorElement.style.maxWidth = 'min(420px, 86%)';
  errorElement.style.margin = '0 auto';
  errorElement.style.color = '#374151';
  errorElement.style.textAlign = 'center';
  errorElement.style.lineHeight = '1.35';

  const title = document.createElement('strong');
  title.textContent = 'Voice was blocked by your browser.';
  title.style.color = '#111827';
  title.style.fontSize = '18px';

  const body = document.createElement('span');
  body.textContent = 'You can still type below. To use voice on mobile, allow microphone access for this site, then refresh and try again. If it still fails, try on desktop.';
  body.style.fontSize = '15px';

  errorElement.append(title, body);
}

function fitActiveConversationLayout(root, sheet) {
  const text = root.textContent || '';
  const callLooksActive =
    text.includes('Talk to interrupt') ||
    text.includes('Listening') ||
    text.includes('Replying') ||
    Boolean(root.querySelector('[aria-label="End call"]'));
  const textChatLooksActive =
    text.includes('Chatting with') ||
    text.includes('Send a message') ||
    Boolean(root.querySelector('textarea, input'));

  if (!callLooksActive && !textChatLooksActive) return;

  const stageCandidates = [...root.querySelectorAll('div')]
    .filter((element) => {
      const className = element.className || '';
      const content = element.textContent || '';
      if (content.includes('Terms and conditions')) return false;
      if (!sheet.contains(element)) return false;

      const rect = element.getBoundingClientRect();
      const sheetRect = sheet.getBoundingClientRect();
      const minUsefulWidth = Math.min(260, sheetRect.width * 0.62);
      const minUsefulHeight = Math.min(260, sheetRect.height * 0.45);
      const isUsefulSize = rect.width > minUsefulWidth && rect.height > minUsefulHeight;
      const isConstrained =
        String(className).includes('max-w-') ||
        getComputedStyle(element).maxWidth !== 'none';

      return isUsefulSize && isConstrained && rect.width < sheetRect.width * 0.96;
    })
    .sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width);

  stageCandidates.forEach((stage) => {
    stage.style.width = '100%';
    stage.style.maxWidth = 'none';
    stage.style.height = '100%';
    stage.style.maxHeight = 'none';
    stage.style.margin = '0';
    stage.style.borderRadius = 'var(--el-sheet-radius)';
    stage.style.boxShadow = 'none';
  });

  root.querySelectorAll('textarea, input').forEach((input) => {
    const wrapper = input.closest('div');
    if (!wrapper) return;

    wrapper.style.width = '100%';
    wrapper.style.maxWidth = 'none';
  });
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
