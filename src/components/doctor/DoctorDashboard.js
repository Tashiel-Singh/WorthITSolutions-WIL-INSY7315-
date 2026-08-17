/**
 * Doctor Portal — Clinical Dashboard & Daily Queue
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { openModal } from '../common/Modal.js';
import { showToast } from '../common/Toast.js';

export function renderDoctorDashboard() {
  const state = store.getState();
  const user = state.currentUser;
  const appointments = state.appointments;
  const patients = state.patients;
  const prescriptions = state.prescriptions;

  // Filter today's doctor appointments
  const myAppointments = appointments.filter(
    (a) => a.doctorId === user.id || a.doctorName.includes(user.name.split(' ').pop())
  );

  const todayScheduled = myAppointments.filter((a) => a.status === 'Scheduled' || a.status === 'In Progress');
  const completedToday = myAppointments.filter((a) => a.status === 'Completed');

  const container = document.createElement('div');
  container.className = 'page-content';

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Doctor Consultation & Clinical Portal</h1>
        <p>Good day, <strong>${user.name}</strong>. You have <strong>${todayScheduled.length}</strong> consultation(s) scheduled for today.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" id="btn-doc-prescribe">
          ${Icons.prescriptions} Write Prescription
        </button>
        <button class="btn btn-secondary" id="btn-doc-new-patient">
          ${Icons.plus} Register Patient
        </button>
      </div>
    </div>

    <!-- KPI Metric Cards -->
    <div class="grid-cols-4">
      <div class="card kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Today's Schedule</span>
          <div class="kpi-icon" style="color: #0d9488;">${Icons.appointments}</div>
        </div>
        <div class="kpi-value">${myAppointments.length}</div>
        <div class="kpi-footer">
          <span class="kpi-trend-up">${todayScheduled.length} Pending</span>
          <span class="kpi-footer-text">in your clinic queue</span>
        </div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Assigned Patients</span>
          <div class="kpi-icon" style="color: #60a5fa;">${Icons.patients}</div>
        </div>
        <div class="kpi-value">${patients.length}</div>
        <div class="kpi-footer">
          <span class="kpi-trend-up">Active Records</span>
          <span class="kpi-footer-text">in department directory</span>
        </div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Prescriptions Dispensed</span>
          <div class="kpi-icon" style="color: #818cf8;">${Icons.prescriptions}</div>
        </div>
        <div class="kpi-value">${prescriptions.length}</div>
        <div class="kpi-footer">
          <span class="kpi-trend-up">Live Stock Connected</span>
          <span class="kpi-footer-text">active therapy tracks</span>
        </div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Completed Today</span>
          <div class="kpi-icon" style="color: var(--status-success);">${Icons.check}</div>
        </div>
        <div class="kpi-value" style="color: #10b981;">${completedToday.length}</div>
        <div class="kpi-footer">
          <span class="kpi-trend-up">On Track</span>
          <span class="kpi-footer-text">consultations closed</span>
        </div>
      </div>
    </div>

    <!-- Main Schedule Table & Patient Focus Area -->
    <div class="grid-cols-2-1">
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${Icons.appointments} Today's Consultation Schedule</div>
            <div class="card-subtitle">Manage patient encounters, clinical progress, and status updates</div>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Time & Type</th>
                <th>Patient Name</th>
                <th>Clinical Reason / Symptoms</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${
                myAppointments.length === 0
                  ? `<tr><td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">No consultations on schedule for today.</td></tr>`
                  : myAppointments
                      .map(
                        (apt) => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: #fff;">${apt.time}</div>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${apt.type}</span>
                  </td>
                  <td>
                    <div style="font-weight: 700; color: #2dd4bf; cursor: pointer;" class="btn-open-patient-chart" data-id="${apt.patientId}">
                      ${apt.patientName}
                    </div>
                    <span class="code-tag">${apt.patientId}</span>
                  </td>
                  <td>
                    <span style="font-size: 0.8125rem; color: var(--text-secondary);">${apt.symptoms}</span>
                  </td>
                  <td>
                    <span class="badge ${
                      apt.status === 'Completed'
                        ? 'badge-success'
                        : apt.status === 'In Progress'
                        ? 'badge-info'
                        : 'badge-warning'
                    }">
                      <span class="badge-dot"></span>
                      ${apt.status}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; gap: 0.4rem;">
                      ${
                        apt.status !== 'Completed'
                          ? `
                        <button class="btn btn-sm btn-primary btn-complete-apt" data-id="${apt.id}" data-name="${apt.patientName}">
                          Complete
                        </button>
                      `
                          : `<span style="font-size: 0.75rem; color: var(--status-success); font-weight: 600;">✓ Done</span>`
                      }
                      <button class="btn btn-sm btn-secondary btn-open-patient-chart" data-id="${apt.patientId}" title="View Patient Chart">
                        ${Icons.records}
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

      <!-- Quick Patient Directory & Allergy Warnings -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${Icons.patients} Patient Roster</div>
            <div class="card-subtitle">Quick access to medical charts & vitals</div>
          </div>
          <button class="btn btn-sm btn-secondary" id="btn-view-all-patients">View All</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${patients
            .slice(0, 4)
            .map(
              (p) => `
            <div style="padding: 0.85rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <div style="font-weight: 700; color: #fff; font-size: 0.875rem;">${p.name} (${p.age}y, ${p.gender})</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">
                  Blood: <strong style="color: #f87171;">${p.bloodType}</strong> • BP: ${p.vitals?.bloodPressure || '120/80'}
                </div>
                ${
                  p.allergies && p.allergies.length > 0
                    ? `
                  <div style="margin-top: 0.35rem; display: flex; gap: 0.3rem; flex-wrap: wrap;">
                    ${p.allergies
                      .map(
                        (a) =>
                          `<span class="badge badge-danger" style="font-size: 0.65rem; padding: 0.1rem 0.4rem;">Allergy: ${a}</span>`
                      )
                      .join('')}
                  </div>
                `
                    : ''
                }
              </div>
              <button class="btn btn-sm btn-secondary btn-open-patient-chart" data-id="${p.id}">
                Chart
              </button>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
  `;

  // Complete Appointment action
  container.querySelectorAll('.btn-complete-apt').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      store.updateAppointmentStatus(id, 'Completed');
      showToast('Consultation Completed', `Marked appointment for ${name} as completed.`, 'success');
    });
  });

  // Open Chart slideover
  container.querySelectorAll('.btn-open-patient-chart').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pId = btn.getAttribute('data-id');
      openPatientChartModal(pId);
    });
  });

  // Navigate to tabs
  container.querySelector('#btn-doc-prescribe')?.addEventListener('click', () => {
    store.setActiveTab('prescribe');
  });

  container.querySelector('#btn-view-all-patients')?.addEventListener('click', () => {
    store.setActiveTab('patients');
  });

  // Register Patient modal
  container.querySelector('#btn-doc-new-patient')?.addEventListener('click', () => {
    openModal({
      title: 'Register New Patient Record',
      contentHtml: `
        <div class="form-group">
          <label class="form-label">Patient Full Name</label>
          <input type="text" id="p-name" class="form-input" placeholder="e.g. Robert Miller" required />
        </div>
        <div class="grid-cols-2" style="margin-bottom: 0;">
          <div class="form-group">
            <label class="form-label">Age</label>
            <input type="number" id="p-age" class="form-input" value="35" min="1" max="120" />
          </div>
          <div class="form-group">
            <label class="form-label">Gender</label>
            <select id="p-gender" class="form-select">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div class="grid-cols-2" style="margin-bottom: 0;">
          <div class="form-group">
            <label class="form-label">Blood Type</label>
            <select id="p-blood" class="form-select">
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Phone Contact</label>
            <input type="text" id="p-phone" class="form-input" value="+1 (555) 392-1049" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Known Drug Allergies (Comma separated)</label>
          <input type="text" id="p-allergies" class="form-input" placeholder="e.g. Penicillin, Codeine" />
        </div>
        <div class="form-group">
          <label class="form-label">Initial Clinical Notes</label>
          <textarea id="p-notes" class="form-textarea" rows="2" placeholder="Initial observation and complaints..."></textarea>
        </div>
      `,
      confirmText: 'Save Patient Record',
      onConfirm: (modalEl) => {
        const name = modalEl.querySelector('#p-name').value.trim();
        if (!name) {
          showToast('Validation Error', 'Patient name is required.', 'error');
          return false;
        }
        const age = modalEl.querySelector('#p-age').value;
        const gender = modalEl.querySelector('#p-gender').value;
        const bloodType = modalEl.querySelector('#p-blood').value;
        const phone = modalEl.querySelector('#p-phone').value;
        const allergies = modalEl.querySelector('#p-allergies').value;
        const notes = modalEl.querySelector('#p-notes').value;

        const newPat = store.addPatient({
          name,
          age,
          gender,
          bloodType,
          phone,
          allergies,
          notes,
          assignedDoctor: user.name,
          assignedDoctorId: user.id
        });

        showToast('Patient Registered', `Created chart for ${newPat.name} (${newPat.id}).`, 'success');
      }
    });
  });

  return container;
}

/**
 * Reusable slide-over chart for a patient
 */
export function openPatientChartModal(patientId) {
  const state = store.getState();
  const patient = state.patients.find((p) => p.id === patientId);
  if (!patient) return;

  const patientRxs = state.prescriptions.filter((r) => r.patientId === patientId);
  const patientApts = state.appointments.filter((a) => a.patientId === patientId);

  openModal({
    title: `Medical Chart: ${patient.name} (${patient.id})`,
    isSlideOver: true,
    contentHtml: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Header Info & Vitals Grid -->
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.25rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <div>
              <h2 style="font-size: 1.35rem; font-weight: 800; color: #fff;">${patient.name}</h2>
              <div style="font-size: 0.8125rem; color: var(--text-muted);">
                ${patient.gender} • ${patient.age} yrs • DOB: ${patient.dob} • Contact: ${patient.phone}
              </div>
            </div>
            <div style="text-align: right;">
              <span class="badge badge-danger" style="font-size: 0.85rem; font-weight: 800;">
                Blood: ${patient.bloodType}
              </span>
            </div>
          </div>

          <!-- Allergy Warning Box -->
          ${
            patient.allergies && patient.allergies.length > 0
              ? `
            <div style="padding: 0.75rem 1rem; border-radius: var(--radius-md); background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.35); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.75rem;">
              <span style="color: #ef4444;">${Icons.alertTriangle}</span>
              <div>
                <strong style="color: #fca5a5; font-size: 0.8125rem;">CRITICAL ALLERGIES:</strong>
                <span style="color: #fee2e2; font-size: 0.8125rem; margin-left: 0.35rem;">${patient.allergies.join(', ')}</span>
              </div>
            </div>
          `
              : ''
          }

          <!-- Vitals Summary -->
          <div class="grid-cols-4" style="margin-bottom: 0;">
            <div style="padding: 0.65rem; background: rgba(0,0,0,0.25); border-radius: var(--radius-sm); text-align: center;">
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Blood Pressure</div>
              <div style="font-weight: 800; color: #38bdf8; font-size: 0.95rem;">${patient.vitals?.bloodPressure || '120/80'}</div>
            </div>
            <div style="padding: 0.65rem; background: rgba(0,0,0,0.25); border-radius: var(--radius-sm); text-align: center;">
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Heart Rate</div>
              <div style="font-weight: 800; color: #10b981; font-size: 0.95rem;">${patient.vitals?.heartRate || '72 bpm'}</div>
            </div>
            <div style="padding: 0.65rem; background: rgba(0,0,0,0.25); border-radius: var(--radius-sm); text-align: center;">
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">SpO2 Oxygen</div>
              <div style="font-weight: 800; color: #a78bfa; font-size: 0.95rem;">${patient.vitals?.spo2 || '99%'}</div>
            </div>
            <div style="padding: 0.65rem; background: rgba(0,0,0,0.25); border-radius: var(--radius-sm); text-align: center;">
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">BMI Index</div>
              <div style="font-weight: 800; color: #fbbf24; font-size: 0.95rem;">${patient.vitals?.bmi || '22.5'}</div>
            </div>
          </div>
        </div>

        <!-- Clinical Notes & Consultation History -->
        <div>
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
            ${Icons.records} Clinical Consultation Notes
          </h4>
          <div style="padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 0.75rem;">
            ${patient.recentNotes || 'No previous consultation notes recorded.'}
          </div>

          <div class="form-group">
            <label class="form-label">Append New Doctor Note / Diagnosis</label>
            <textarea id="chart-new-note" class="form-textarea" rows="3" placeholder="Enter follow-up observations, medication recommendations, or diagnostic orders..."></textarea>
            <button class="btn btn-sm btn-primary" id="btn-save-chart-note" style="margin-top: 0.5rem;">
              Save Note to Chart
            </button>
          </div>
        </div>

        <!-- Active Prescriptions -->
        <div>
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.4rem;">
            ${Icons.prescriptions} Active Medications & Therapy
          </h4>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${
              patientRxs.length === 0
                ? `<div style="font-size: 0.8125rem; color: var(--text-muted);">No active prescriptions for this patient.</div>`
                : patientRxs
                    .map(
                      (rx) => `
              <div style="padding: 0.75rem 1rem; background: rgba(13, 148, 136, 0.08); border: 1px solid rgba(13, 148, 136, 0.3); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 700; color: #2dd4bf; font-size: 0.875rem;">${rx.medication}</div>
                  <div style="font-size: 0.78125rem; color: var(--text-secondary);">${rx.dosage}</div>
                </div>
                <div style="text-align: right;">
                  <span class="badge badge-success" style="font-size: 0.7rem;">${rx.refillsRemaining} Refills Left</span>
                  <div style="font-size: 0.6875rem; color: var(--text-muted); margin-top: 0.2rem;">Issued: ${rx.issuedDate}</div>
                </div>
              </div>
            `
                    )
                    .join('')
            }
          </div>
        </div>
      </div>
    `,
    cancelText: 'Close Chart'
  });

  // Save Note handler
  const saveBtn = document.getElementById('btn-save-chart-note');
  saveBtn?.addEventListener('click', () => {
    const noteEl = document.getElementById('chart-new-note');
    if (!noteEl || !noteEl.value.trim()) {
      showToast('Empty Note', 'Please enter note text before saving.', 'warning');
      return;
    }
    const fullNote = `${patient.recentNotes ? patient.recentNotes + '\n\n' : ''}[${new Date().toLocaleDateString()}] ${noteEl.value.trim()}`;
    store.addPatientNote(patientId, fullNote);
    showToast('Chart Updated', 'Clinical note recorded successfully.', 'success');
  });
}
