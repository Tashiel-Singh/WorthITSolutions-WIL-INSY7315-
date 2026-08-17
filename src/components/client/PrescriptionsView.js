/**
 * Client Portal — Prescriptions & Medication Refills View
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { showToast } from '../common/Toast.js';

export function renderClientPrescriptionsView() {
  const state = store.getState();
  const user = state.currentUser;

  const myPrescriptions = state.prescriptions.filter(
    (r) => r.patientName === user.name || r.patientId === user.patientId
  );

  const container = document.createElement('div');
  container.className = 'page-content';

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>My Medications & Refill Requests</h1>
        <p>Active pharmaceutical therapy tracks, dosage instructions, and 1-click pharmacy refill requests.</p>
      </div>
    </div>

    <!-- Prescriptions Grid Cards -->
    <div class="grid-cols-2">
      ${
        myPrescriptions.length === 0
          ? `
        <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <div style="color: #60a5fa; margin-bottom: 0.75rem;">${Icons.prescriptions}</div>
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #fff;">No Active Prescriptions</h3>
          <p style="color: var(--text-secondary); margin-top: 0.25rem;">You do not currently have any active medications prescribed.</p>
        </div>
      `
          : myPrescriptions
              .map(
                (rx) => `
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
              <div>
                <span class="badge badge-info" style="margin-bottom: 0.35rem;">Prescription ${rx.id}</span>
                <h3 style="font-size: 1.2rem; font-weight: 800; color: #fff;">${rx.medication}</h3>
                <span class="code-tag" style="margin-top: 0.25rem; display: inline-block;">SKU: ${rx.sku}</span>
              </div>
              <div style="text-align: right;">
                <span class="badge ${rx.refillsRemaining > 0 ? 'badge-success' : 'badge-warning'}">
                  ${rx.refillsRemaining} Refill(s) Left
                </span>
              </div>
            </div>

            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.25rem;">
                Dosage & Schedule
              </div>
              <div style="font-weight: 700; color: #38bdf8; font-size: 0.95rem;">${rx.dosage}</div>
              
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin: 0.75rem 0 0.25rem;">
                Instructions
              </div>
              <div style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.4;">${rx.instructions}</div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem;">
              <span>Prescribed by: <strong style="color: var(--text-primary);">${rx.doctorName}</strong></span>
              <span>Issued: ${rx.issuedDate}</span>
            </div>
          </div>

          <div>
            ${
              rx.refillsRemaining > 0
                ? `
              <button class="btn btn-primary btn-refill-now" data-id="${rx.id}" data-med="${rx.medication}" style="width: 100%;">
                ${Icons.refresh} Request 30-Day Refill
              </button>
            `
                : `
              <button class="btn btn-secondary" style="width: 100%; opacity: 0.6; cursor: not-allowed;" disabled>
                No Refills Remaining (Schedule Consult)
              </button>
            `
            }
          </div>
        </div>
      `
              )
              .join('')
      }
    </div>
  `;

  // Refill click
  container.querySelectorAll('.btn-refill-now').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const med = btn.getAttribute('data-med');
      const success = store.requestPrescriptionRefill(id);
      if (success) {
        showToast(
          'Refill Processed',
          `1 refill deducted for ${med}. Hospital inventory notified for preparation.`,
          'success'
        );
      }
    });
  });

  return container;
}
