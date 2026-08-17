/**
 * Staff & User Management View (Admin)
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { openModal } from '../common/Modal.js';
import { showToast } from '../common/Toast.js';

export function renderUserManagementView() {
  const state = store.getState();
  let users = [...state.users];
  let selectedRole = 'all';
  let searchTerm = '';

  const container = document.createElement('div');
  container.className = 'page-content';

  function renderContent() {
    let filtered = users.filter((u) => {
      const matchRole = selectedRole === 'all' || u.role === selectedRole;
      const matchSearch =
        !searchTerm ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.department?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchRole && matchSearch;
    });

    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Staff & User Directory</h1>
          <p>Manage authenticated system accounts across Admin, Doctor, and Client (Patient) roles.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" id="btn-add-new-user">
            ${Icons.users} Add New Account
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <div class="search-input-wrapper" style="flex: 1; min-width: 260px;">
            <span class="search-icon-inside">${Icons.search}</span>
            <input 
              type="text" 
              id="user-search-input" 
              class="form-input search-input" 
              placeholder="Search user name, email, or department..." 
              value="${searchTerm}"
            />
          </div>

          <div style="min-width: 180px;">
            <select id="user-role-filter" class="form-select">
              <option value="all" ${selectedRole === 'all' ? 'selected' : ''}>All Roles (${users.length})</option>
              <option value="admin" ${selectedRole === 'admin' ? 'selected' : ''}>Administrators</option>
              <option value="doctor" ${selectedRole === 'doctor' ? 'selected' : ''}>Doctors & Physicians</option>
              <option value="client" ${selectedRole === 'client' ? 'selected' : ''}>Patients / Clients</option>
            </select>
          </div>

          <div style="font-size: 0.8125rem; color: var(--text-muted);">
            Showing <strong>${filtered.length}</strong> active & suspended users
          </div>
        </div>
      </div>

      <!-- Users Table Card -->
      <div class="card" style="padding: 0;">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>User / Name</th>
                <th>Role</th>
                <th>Department / Specialization</th>
                <th>Username & Auth</th>
                <th>Member Since</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${
                filtered.length === 0
                  ? `<tr><td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted);">No users match the search criteria.</td></tr>`
                  : filtered
                      .map(
                        (u) => `
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <div class="user-avatar" style="width: 36px; height: 36px; background: ${
                        u.role === 'admin'
                          ? 'linear-gradient(135deg, #6366f1, #4338ca)'
                          : u.role === 'doctor'
                          ? 'linear-gradient(135deg, #0d9488, #047857)'
                          : 'linear-gradient(135deg, #2563eb, #0284c7)'
                      };">
                        ${u.avatarInitials || 'US'}
                      </div>
                      <div>
                        <div style="font-weight: 700; color: #fff;">${u.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge ${
                      u.role === 'admin'
                        ? 'badge-info'
                        : u.role === 'doctor'
                        ? 'badge-success'
                        : 'badge-neutral'
                    }" style="text-transform: uppercase;">
                      ${u.role}
                    </span>
                  </td>
                  <td>
                    <span style="color: var(--text-secondary);">${u.department || u.title || 'General'}</span>
                  </td>
                  <td>
                    <span class="code-tag">${u.username}</span>
                  </td>
                  <td>
                    <span style="color: var(--text-secondary); font-size: 0.8125rem;">${u.joinedDate || '2024-01-01'}</span>
                  </td>
                  <td>
                    <span class="badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}">
                      <span class="badge-dot"></span>
                      ${u.status.toUpperCase()}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; gap: 0.4rem;">
                      <button class="btn btn-sm ${u.status === 'active' ? 'btn-secondary' : 'btn-success'} btn-toggle-status" data-id="${u.id}" data-name="${u.name}">
                        ${u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button class="btn btn-sm btn-secondary btn-switch-to-user" data-id="${u.id}" data-role="${u.role}" title="Test login as this user">
                        Switch Session
                      </button>
                    </div>
                  </td>
                </tr>
              `
                      )
                      .join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Listeners
    container.querySelector('#user-search-input')?.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderContent();
    });

    container.querySelector('#user-role-filter')?.addEventListener('change', (e) => {
      selectedRole = e.target.value;
      renderContent();
    });

    // Toggle user status
    container.querySelectorAll('.btn-toggle-status').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const newStatus = store.toggleUserStatus(id);
        showToast('User Status Updated', `${name} account is now ${newStatus.toUpperCase()}.`, 'info');
      });
    });

    // Switch Session to User
    container.querySelectorAll('.btn-switch-to-user').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const role = btn.getAttribute('data-role');
        const res = store.quickLoginAs(role, id);
        if (res.success) {
          showToast('Session Switched', `Logged in as ${res.user.name} (${res.user.role.toUpperCase()})`, 'success');
        }
      });
    });

    // Add User Modal
    container.querySelector('#btn-add-new-user')?.addEventListener('click', () => {
      openModal({
        title: 'Create System Account',
        contentHtml: `
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" id="add-name" class="form-input" placeholder="e.g. Dr. Jennifer Adams" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="add-email" class="form-input" placeholder="jennifer.adams@hospital.care" required />
          </div>
          <div class="grid-cols-2" style="margin-bottom: 0;">
            <div class="form-group">
              <label class="form-label">Assigned Role</label>
              <select id="add-role" class="form-select">
                <option value="doctor">Doctor / Clinician</option>
                <option value="admin">Administrator</option>
                <option value="client">Client / Patient</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Department / Clinic</label>
              <input type="text" id="add-dept" class="form-input" value="Cardiology & Surgery" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Default Access Password</label>
            <input type="password" class="form-input" value="password123" disabled />
          </div>
        `,
        confirmText: 'Create Account',
        onConfirm: (modalEl) => {
          const name = modalEl.querySelector('#add-name').value.trim();
          const email = modalEl.querySelector('#add-email').value.trim();
          const role = modalEl.querySelector('#add-role').value;
          const department = modalEl.querySelector('#add-dept').value.trim();

          if (!name || !email) {
            showToast('Validation Error', 'Name and Email are mandatory.', 'error');
            return false;
          }

          const newUser = store.addUser({ name, email, role, department, username: email.split('@')[0] });
          showToast('Account Created', `Created account for ${newUser.name}.`, 'success');
        }
      });
    });
  }

  renderContent();
  return container;
}
