/**
 * Modal and Slide-over Drawer Handler
 */
import { Icons } from './Icons.js';

export function openModal({
  title,
  contentHtml,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm = null,
  isSlideOver = false,
  customFooter = null
}) {
  const root = document.getElementById('modal-root');
  if (!root) return;

  const backdrop = document.createElement('div');
  backdrop.className = isSlideOver ? 'slideover-backdrop' : 'modal-backdrop';

  const innerPanel = document.createElement('div');
  innerPanel.className = isSlideOver ? 'slideover-panel' : 'modal-card';

  innerPanel.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">${title}</h3>
      <button class="modal-close-btn" id="modal-btn-close" aria-label="Close modal">
        ${Icons.close}
      </button>
    </div>
    <div class="modal-body">
      ${contentHtml}
    </div>
    <div class="modal-footer">
      ${
        customFooter
          ? customFooter
          : `
        <button class="btn btn-secondary" id="modal-btn-cancel">${cancelText}</button>
        ${
          onConfirm
            ? `<button class="btn btn-primary" id="modal-btn-confirm">${confirmText}</button>`
            : ''
        }
      `
      }
    </div>
  `;

  backdrop.appendChild(innerPanel);
  root.appendChild(backdrop);

  const close = () => {
    backdrop.style.opacity = '0';
    backdrop.style.transition = 'opacity 0.2s ease';
    setTimeout(() => {
      if (backdrop.parentElement) backdrop.parentElement.removeChild(backdrop);
    }, 200);
  };

  backdrop.querySelector('#modal-btn-close')?.addEventListener('click', close);
  backdrop.querySelector('#modal-btn-cancel')?.addEventListener('click', close);

  // Close when clicking outside content on normal modal
  if (!isSlideOver) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });
  }

  const confirmBtn = backdrop.querySelector('#modal-btn-confirm');
  if (confirmBtn && onConfirm) {
    confirmBtn.addEventListener('click', async (e) => {
      const result = await onConfirm(backdrop);
      if (result !== false) {
        close();
      }
    });
  }

  return { close, element: backdrop };
}
