/**
 * Patient Records & Clinical Charts Directory (Doctor)
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { openModal } from '../common/Modal.js';
import { showToast } from '../common/Toast.js';
import { openPatientChartModal } from './DoctorDashboard.js';

export function renderPatientRecordsView() {
  const state = store.getState();
  let patients = [...state.patients];
  let searchTerm = '';

  const container = document.createElement('div');
  container.className = 'page-content';

  function renderContent() {
    let filtered = patients.filter((p) => {
      return (
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.chronicConditions?.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Master Patient Index & Records</h1>
          <p>Complete clinical repository of patient medical histories, vitals, allergies, and active therapies.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" id="btn-add-patient-record">
            ${Icons.plus} New Patient Chart
          </button>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <div class="search-input-wrapper" style="flex: 1; min-width: 280px;">
            <span class="search-icon-inside">${Icons.search}</span>
            <input 
              type="text" 
              id="patient-search-input" 
              class="form-input search-input" 
              placeholder="Search by patient name, ID (e.g. PAT-8821), blood type, or condition..." 
              value="${searchTerm}"
            />
          </div>
          <div style="font-size: 0.8125rem; color: var(--text-muted);">
            Total Patients: <strong>${filtered.length}</strong>
          </div>
        </div>
      </div>

      <!-- Patients Table -->
      <div class="card" style="padding: 0;">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Patient Name & ID</th>
                <th>Demographics</th>
                <th>Blood Type</th>
                <th>Allergy Alerts</th>
                <th>Chronic Conditions</th>
                <th>Primary Clinician</th>
                <th>Last Visit</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${
                filtered.length === 0
                  ? `<tr><td colspan="8" style="text-align: center; padding: 3rem; color: var(--text-muted);">No patients match the search term.</td></tr>`
                  : filtered
                      .map(
                        (p) => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">${p.name}</div>
                    <span class="code-tag">${p.id}</span>
                  </td>
                  <td>
                    <span style="color: var(--text-secondary);">${p.gender}, ${p.age} yrs</span>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">${p.phone}</div>
                  </td>
                  <td>
                    <span class="badge badge-danger" style="font-weight: 700;">${p.bloodType}</span>
                  </td>
                  <td>
                    ${
                      p.allergies && p.allergies.length > 0
                        ? p.allergies
                            .map(
                              (a) =>
                                `<span class="badge badge-danger" style="font-size: 0.7rem; margin-right: 0.25rem;">${a}</span>`
                            )
                            .join('')
                        : `<span style="font-size: 0.75rem; color: var(--text-muted);">None known</span>`
                    }
                  </td>
                  <td>
                    ${
                      p.chronicConditions && p.chronicConditions.length > 0
                        ? p.chronicConditions
                            .map(
                              (c) =>
                                `<span class="badge badge-warning" style="font-size: 0.7rem; margin-right: 0.25rem;">${c}</span>`
                            )
                            .join('')
                        : `<span style="font-size: 0.75rem; color: var(--text-muted);">None</span>`
                    }
                  </td>
                  <td>
                    <span style="color: var(--text-secondary); font-size: 0.8125rem;">${p.assignedDoctor || 'Dr. Sarah Smith'}</span>
                  </td>
                  <td>
                    <span style="color: var(--text-muted); font-size: 0.78125rem;">${p.lastVisit || '2026-08-01'}</span>
                  </td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; gap: 0.4rem;">
                      <button class="btn btn-sm btn-primary btn-open-chart" data-id="${p.id}">
                        Open Chart
                      </button>
                      <button class="btn btn-sm btn-secondary btn-quick-rx" data-id="${p.id}" data-name="${p.name}" title="Prescribe Medication">
                        ${Icons.prescriptions}
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
    container.querySelector('#patient-search-input')?.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderContent();
    });

    container.querySelectorAll('.btn-open-chart').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openPatientChartModal(id);
      });
    });

    container.querySelectorAll('.btn-quick-rx').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.setActiveTab('prescribe');
      });
    });

    // Add Patient Record Modal
    container.querySelector('#btn-add-patient-record')?.addEventListener('click', () => {
      openModal({
        title: 'Create Patient Medical Record',
        contentHtml: `
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" id="add-p-name" class="form-input" placeholder="e.g. Maria Gonzalez" required />
          </div>
          <div class="grid-cols-2" style="margin-bottom: 0;">
            <div class="form-group">
              <label class="form-label">Age</label>
              <input type="number" id="add-p-age" class="form-input" value="38" />
            </div>
            <div class="form-group">
              <label class="form-label">Gender</label>
              <select id="add-p-gender" class="form-select">
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 0;">
            <div class="form-group">
              <label class="form-label">Blood Group</label>
              <select id="add-p-blood" class="form-select">
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
                <option value="A-">A-</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Contact Phone</label>
              <input type="text" id="add-p-phone" class="form-input" value="+1 (555) 674-8890" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Known Allergies</label>
            <input type="text" id="add-p-allergies" class="form-input" placeholder="e.g. Aspirin, Shellfish" />
          </div>
          <div class="form-group">
            <label class="form-label">Chronic Medical Conditions</label>
            <input type="text" id="add-p-conditions" class="form-input" placeholder="e.g. Asthma, Hyperlipidemia" />
          </div>
        `,
        confirmText: 'Register Record',
        onConfirm: (modalEl) => {
          const name = modalEl.querySelector('#add-p-name').value.trim();
          if (!name) {
            showToast('Validation Error', 'Name is required.', 'error');
            return false;
          }
          const age = modalEl.querySelector('#add-p-age').value;
          const gender = modalEl.querySelector('#add-p-gender').value;
          const bloodType = modalEl.querySelector('#add-p-blood').value;
          const phone = modalEl.querySelector('#add-p-phone').value;
          const allergies = modalEl.querySelector('#add-p-allergies').value;
          const chronicConditions = modalEl.querySelector('#add-p-conditions').value;

          const newP = store.addPatient({ name, age, gender, bloodType, phone, allergies, chronicConditions });
          showToast('Record Created', `Patient ${newP.name} added to repository.`, 'success');
        }
      });
    });
  }

  renderContent();
  return container;
}
