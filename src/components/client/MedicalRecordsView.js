/**
 * Client Portal — Personal Health Summary & Medical Records View
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { showToast } from '../common/Toast.js';

export function renderMedicalRecordsView() {
  const state = store.getState();
  const user = state.currentUser;

  const patient =
    state.patients.find((p) => p.userId === user.id || p.id === user.patientId) ||
    state.patients[0];

  const container = document.createElement('div');
  container.className = 'page-content';

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Personal Health Records & Vitals</h1>
        <p>Electronic health record summary, clinical notes, and allergy profiles.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" id="btn-download-ehr">
          ${Icons.records} Download EHR Summary
        </button>
      </div>
    </div>

    <div class="grid-cols-1-2">
      <!-- Left: Patient Profile & Vitals Card -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${Icons.user} Patient Profile</div>
            <div class="card-subtitle">Demographics & Emergency Info</div>
          </div>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <div class="user-avatar" style="width: 50px; height: 50px; font-size: 1.25rem;">
              ${user.avatarInitials || 'PT'}
            </div>
            <div>
              <h2 style="font-size: 1.25rem; font-weight: 800; color: #fff;">${patient.name}</h2>
              <div style="font-size: 0.8125rem; color: var(--text-muted);">
                Patient ID: <span class="code-tag">${patient.id}</span>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.875rem;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
              <span style="color: var(--text-muted);">Date of Birth:</span>
              <span style="color: var(--text-primary); font-weight: 600;">${patient.dob} (${patient.age} yrs)</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
              <span style="color: var(--text-muted);">Gender:</span>
              <span style="color: var(--text-primary); font-weight: 600;">${patient.gender}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
              <span style="color: var(--text-muted);">Blood Group:</span>
              <span class="badge badge-danger" style="font-weight: 700;">${patient.bloodType}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
              <span style="color: var(--text-muted);">Contact Phone:</span>
              <span style="color: var(--text-primary); font-weight: 600;">${patient.phone}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">Primary Physician:</span>
              <span style="color: #60a5fa; font-weight: 600;">${patient.assignedDoctor}</span>
            </div>
          </div>
        </div>

        <!-- Allergy Warnings -->
        <div style="padding: 1rem; border-radius: var(--radius-md); background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: #ef4444; font-weight: 700; font-size: 0.875rem; margin-bottom: 0.35rem;">
            ${Icons.alertTriangle} Drug & Environmental Allergies
          </div>
          <div style="font-size: 0.8125rem; color: #fee2e2;">
            ${
              patient.allergies && patient.allergies.length > 0
                ? patient.allergies.join(', ')
                : 'No documented drug allergies on record.'
            }
          </div>
        </div>

        <!-- Chronic Conditions -->
        <div style="padding: 1rem; border-radius: var(--radius-md); background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3);">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: #f59e0b; font-weight: 700; font-size: 0.875rem; margin-bottom: 0.35rem;">
            ${Icons.activity} Documented Conditions
          </div>
          <div style="font-size: 0.8125rem; color: #fef3c7;">
            ${
              patient.chronicConditions && patient.chronicConditions.length > 0
                ? patient.chronicConditions.join(', ')
                : 'No chronic conditions diagnosed.'
            }
          </div>
        </div>
      </div>

      <!-- Right: Recorded Vitals & Doctor Notes -->
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <!-- Recorded Vitals Grid -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">${Icons.activity} Clinical Vitals Telemetry</div>
              <div class="card-subtitle">Recorded during your last physical examination on ${patient.lastVisit}</div>
            </div>
          </div>

          <div class="grid-cols-4" style="margin-bottom: 0;">
            <div style="padding: 1rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Blood Pressure</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #38bdf8; margin: 0.25rem 0;">
                ${patient.vitals?.bloodPressure || '124/82'}
              </div>
              <span class="badge badge-success" style="font-size: 0.65rem;">Normal</span>
            </div>

            <div style="padding: 1rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Heart Rate</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #10b981; margin: 0.25rem 0;">
                ${patient.vitals?.heartRate || '72 bpm'}
              </div>
              <span class="badge badge-success" style="font-size: 0.65rem;">Resting</span>
            </div>

            <div style="padding: 1rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Body Temp</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #fbbf24; margin: 0.25rem 0;">
                ${patient.vitals?.temperature || '98.4 °F'}
              </div>
              <span class="badge badge-success" style="font-size: 0.65rem;">Normal</span>
            </div>

            <div style="padding: 1rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Oxygen SpO2</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: #a78bfa; margin: 0.25rem 0;">
                ${patient.vitals?.spo2 || '99%'}
              </div>
              <span class="badge badge-success" style="font-size: 0.65rem;">Optimal</span>
            </div>
          </div>
        </div>

        <!-- Doctor Consultation Notes -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">${Icons.records} Physician Consultation Notes</div>
              <div class="card-subtitle">Direct records written by your treating physician</div>
            </div>
          </div>

          <div style="padding: 1.25rem; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 0.9rem; color: var(--text-primary); line-height: 1.6; white-space: pre-wrap;">
${patient.recentNotes || 'No notes currently recorded.'}
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-download-ehr')?.addEventListener('click', () => {
    showToast('Record Exported', 'Health record summary PDF generated (simulated download).', 'success');
  });

  return container;
}
