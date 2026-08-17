/**
 * Screen 1: Login Page
 * Caption: Figure 1: Login Screen - Secure access to the Integrated Financial, Inventory, and Operational Management System.
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { openModal } from '../common/Modal.js';
import { showToast } from '../common/Toast.js';

export function renderLoginScreen() {
  const container = document.createElement('div');
  container.style.minHeight = '100vh';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.padding = '2rem 1rem';
  container.style.backgroundColor = 'var(--bg-app)';

  container.innerHTML = `
    <div style="width: 100%; max-width: 440px;">
      <div class="card" style="padding: 2.25rem 2rem; box-shadow: var(--shadow-lg); border-top: 3px solid var(--color-primary);">
        <!-- Clinical Header -->
        <div style="text-align: center; margin-bottom: 1.75rem;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: var(--radius-sm); background: var(--color-primary); color: white; margin-bottom: 0.75rem; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.25);">
            ${Icons.medicalCross}
          </div>
          <h1 style="font-size: 1.45rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.02em;">
            MedFlow
          </h1>
          <p style="font-size: 0.8125rem; font-weight: 600; color: var(--color-primary); margin-top: 0.15rem; text-transform: uppercase; letter-spacing: 0.04em;">
            Rolling Stoned Natural Health & Clinical Supplies
          </p>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.35rem; line-height: 1.4;">
            Clinical Inventory & Enterprise Management Portal<br />
            Cape Town, South Africa • info@rollingstoned.co.za
          </div>
        </div>

        <!-- Login Form -->
        <form id="screen1-login-form">
          <div class="form-group">
            <label class="form-label" for="login-username">Username or Institutional Email</label>
            <div class="search-input-wrapper">
              <span class="search-icon-inside">${Icons.user}</span>
              <input 
                type="text" 
                id="login-username" 
                class="form-input search-input" 
                value="admin" 
                placeholder="Enter username (e.g. admin)" 
                required 
              />
            </div>
          </div>

          <div class="form-group">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <label class="form-label" for="login-password" style="margin-bottom: 0;">Password</label>
              <a href="#" id="link-forgot-password" style="font-size: 0.75rem;">Forgot Password?</a>
            </div>
            <input 
              type="password" 
              id="login-password" 
              class="form-input" 
              value="password123" 
              placeholder="Enter your password" 
              required 
            />
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; height: 40px; margin-top: 0.35rem;">
            Sign In to Clinical Portal
          </button>
        </form>

        <!-- Hoverable Demo Credentials Tooltip & Directory -->
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.72rem; color: var(--text-muted);">Evaluation Mode</span>
          
          <div class="credentials-tooltip-wrapper">
            <button type="button" class="credentials-tooltip-btn" id="btn-toggle-creds" title="Hover or click to view copyable demo credentials">
              ${Icons.info}
              <span>Demo Credentials</span>
            </button>

            <!-- Popover Content -->
            <div class="credentials-popover" id="creds-popover">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; padding-bottom: 0.35rem; border-bottom: 1px solid var(--border-subtle);">
                <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary);">Demo Access Directory</span>
                <span style="font-size: 0.68rem; color: var(--text-muted);">Click to Copy</span>
              </div>

              <!-- Role 1: Administrator -->
              <div class="cred-role-item">
                <div class="cred-info">
                  <span class="cred-role-title">Administrator (John Admin)</span>
                  <span class="cred-creds">admin / password123</span>
                </div>
                <button type="button" class="cred-copy-btn" data-copy-user="admin" data-copy-pass="password123" title="Copy Administrator credentials">
                  ${Icons.copy}
                  <span>Copy</span>
                </button>
              </div>

              <!-- Role 2: Clinic Client B2B -->
              <div class="cred-role-item">
                <div class="cred-info">
                  <span class="cred-role-title">Clinic Client (B2B)</span>
                  <span class="cred-creds">dr.naidoo / password123</span>
                </div>
                <button type="button" class="cred-copy-btn" data-copy-user="dr.naidoo" data-copy-pass="password123" title="Copy Doctor credentials">
                  ${Icons.copy}
                  <span>Copy</span>
                </button>
              </div>

              <!-- Role 3: Retail Customer B2C -->
              <div class="cred-role-item">
                <div class="cred-info">
                  <span class="cred-role-title">Retail Customer (B2C)</span>
                  <span class="cred-creds">sarah.m / password123</span>
                </div>
                <button type="button" class="cred-copy-btn" data-copy-user="sarah.m" data-copy-pass="password123" title="Copy Retail credentials">
                  ${Icons.copy}
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Developer Credit -->
        <div style="margin-top: 1rem; text-align: center; font-size: 0.7rem; color: var(--text-muted);">
          System Architecture & Application Developed by <strong>WorthIT Solutions</strong>
        </div>
      </div>
    </div>
  `;

  // Form submit
  container.querySelector('#screen1-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const u = container.querySelector('#login-username').value;
    const p = container.querySelector('#login-password').value;
    const res = store.login(u, p);
    if (res.success) {
      showToast('Authentication Successful', `Signed in as ${res.user.name}`, 'success');
    } else {
      showToast('Authentication Failed', res.message, 'error');
    }
  });

  // Toggle popover on mobile/click
  const toggleBtn = container.querySelector('#btn-toggle-creds');
  const popover = container.querySelector('#creds-popover');
  if (toggleBtn && popover) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      popover.classList.toggle('active');
    });
    document.addEventListener('click', () => {
      popover.classList.remove('active');
    });
  }

  // Copy credential actions
  container.querySelectorAll('.cred-copy-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const username = btn.getAttribute('data-copy-user');
      const password = btn.getAttribute('data-copy-pass');

      // Populate form inputs directly for convenience
      const userInput = container.querySelector('#login-username');
      const passInput = container.querySelector('#login-password');
      if (userInput) userInput.value = username;
      if (passInput) passInput.value = password;

      // Copy text to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`Username: ${username} | Password: ${password}`).catch(() => {});
      }

      showToast('Credentials Copied', `Loaded ${username} into login form`, 'info');
      popover.classList.remove('active');
    });
  });

  // Forgot password
  container.querySelector('#link-forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    openModal({
      title: 'Reset Account Access',
      contentHtml: `
        <p style="color: var(--text-secondary); margin-bottom: 1rem;">
          A secure password recovery token will be forwarded to your institutional email.
        </p>
        <div class="form-group">
          <label class="form-label">Registered Institutional Email</label>
          <input type="email" class="form-input" value="admin@rollingstoned.co.za" />
        </div>
      `,
      confirmText: 'Send Recovery Token',
      onConfirm: () => {
        showToast('Recovery Token Sent', 'Password reset instructions have been forwarded to the registered email.', 'info');
      }
    });
  });

  return container;
}
