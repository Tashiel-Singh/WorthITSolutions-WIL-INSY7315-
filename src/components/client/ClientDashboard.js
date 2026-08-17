/**
 * Patient / Client Portal — Overview Dashboard
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { showToast } from '../common/Toast.js';

export function renderClientDashboard() {
  const state = store.getState();
  const user = state.currentUser;

  // Find linked patient profile
  const patient =
    state.patients.find((p) => p.userId === user.id || p.id === user.patientId) ||
    state.patients[0];

  const myAppointments = state.appointments.filter(
    (a) => a.patientId === patient.id || a.patientName === user.name
  );

  const upcomingApts = myAppointments.filter((a) => a.status === 'Scheduled' || a.status === 'In Progress');
  const myPrescriptions = state.prescriptions.filter(
    (r) => r.patientId === patient.id || r.patientName === user.name
  );

  const container = document.createElement('div');
  container.className = 'page-content';

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Welcome back, ${user.name}</h1>
        <p>Your personal patient health portal, appointment scheduler, and prescription manager.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" id="btn-patient-book">
          ${Icons.appointments} Schedule Visit
        </button>
      </div>
    </div>

    <!-- KPI Metric Cards -->
    <div class="grid-cols-4">
      <div class="card kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Upcoming Visits</span>
          <div class="kpi-icon" style="color: #2563eb;">${Icons.appointments}</div>
        </div>
        <div class="kpi-value">${upcomingApts.length}</div>
        <div class="kpi-footer">
          <span class="kpi-trend-up">Confirmed</span>
          <span class="kpi-footer-text">in your schedule</span>
        </div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Active Prescriptions</span>
          <div class="kpi-icon" style="color: #0d9488;">${Icons.prescriptions}</div>
        </div>
        <div class="kpi-value">${myPrescriptions.length}</div>
        <div class="kpi-footer">
          <span class="kpi-trend-up">Ongoing Therapy</span>
          <span class="kpi-footer-text">pharmacy tracked</span>
        </div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Latest Blood Pressure</span>
          <div class="kpi-icon" style="color: #38bdf8;">${Icons.heart}</div>
        </div>
        <div class="kpi-value" style="font-size: 1.65rem;">${patient?.vitals?.bloodPressure || '120/80'}</div>
        <div class="kpi-footer">
          <span class="kpi-trend-up">Optimal</span>
          <span class="kpi-footer-text">recorded ${patient?.lastVisit || 'recently'}</span>
        </div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Primary Physician</span>
          <div class="kpi-icon" style="color: #a78bfa;">${Icons.stethoscope}</div>
        </div>
        <div style="font-size: 1.15rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; line-height: 1.3;">
          ${patient?.assignedDoctor || 'Dr. Sarah Smith'}
        </div>
        <div class="kpi-footer">
          <span class="kpi-footer-text">Cardiology Dept</span>
        </div>
      </div>
    </div>

    <!-- Main Section: Upcoming Appointments & Active Medications -->
    <div class="grid-cols-2">
      <!-- Upcoming Appointments -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${Icons.appointments} Next Scheduled Visit</div>
            <div class="card-subtitle">Consultation details and arrival reminders</div>
          </div>
          <button class="btn btn-sm btn-secondary" id="btn-patient-all-apts">Manage</button>
        </div>

        ${
          upcomingApts.length === 0
            ? `
          <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
            <div style="margin-bottom: 0.75rem; color: #60a5fa;">${Icons.appointments}</div>
            <p>You have no upcoming consultations scheduled.</p>
            <button class="btn btn-sm btn-primary" id="btn-book-empty" style="margin-top: 1rem;">Book an Appointment</button>
          </div>
        `
            : upcomingApts
                .map(
                  (apt) => `
          <div style="padding: 1.25rem; background: rgba(37, 99, 235, 0.08); border: 1px solid rgba(37, 99, 235, 0.3); border-radius: var(--radius-lg); margin-bottom: 0.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
              <div>
                <span class="badge badge-info" style="margin-bottom: 0.35rem;">${apt.type}</span>
                <h3 style="font-size: 1.1rem; font-weight: 700; color: #fff;">${apt.doctorName}</h3>
                <div style="font-size: 0.8125rem; color: var(--text-secondary);">${apt.department}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 1.05rem; font-weight: 800; color: #60a5fa;">${apt.time}</div>
                <div style="font-size: 0.78125rem; color: var(--text-muted);">${apt.date}</div>
              </div>
            </div>
            <div style="font-size: 0.8125rem; color: var(--text-secondary); padding-top: 0.75rem; border-top: 1px solid var(--border-subtle);">
              <strong>Consultation Reason:</strong> ${apt.symptoms}
            </div>
          </div>
        `
                )
                .join('')
        }
      </div>

      <!-- Active Prescriptions with 1-Click Refill -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${Icons.prescriptions} My Prescribed Medications</div>
            <div class="card-subtitle">Active medication schedules and refill status</div>
          </div>
          <button class="btn btn-sm btn-secondary" id="btn-patient-all-rxs">All Refills</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          ${
            myPrescriptions.length === 0
              ? `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No active prescriptions recorded for your profile.</div>`
              : myPrescriptions
                  .map(
                    (rx) => `
            <div style="padding: 1rem 1.15rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
              <div>
                <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">${rx.medication}</div>
                <div style="font-size: 0.8125rem; color: #60a5fa; margin-top: 0.15rem;">${rx.dosage}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.2rem;">${rx.instructions}</div>
              </div>
              <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem;">
                <span class="badge ${rx.refillsRemaining > 0 ? 'badge-success' : 'badge-warning'}">
                  ${rx.refillsRemaining} Refill(s) Available
                </span>
                ${
                  rx.refillsRemaining > 0
                    ? `
                  <button class="btn btn-sm btn-primary btn-request-refill" data-id="${rx.id}" data-name="${rx.medication}">
                    Request Refill
                  </button>
                `
                    : `<span style="font-size: 0.7rem; color: var(--status-warning);">Contact Doctor</span>`
                }
              </div>
            </div>
          `
                  )
                  .join('')
          }
        </div>
      </div>
    </div>
  `;

  // Refill request action
  container.querySelectorAll('.btn-request-refill').forEach((btn) => {
    btn.addEventListener('click', () => {
      const rxId = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const success = store.requestPrescriptionRefill(rxId);
      if (success) {
        showToast(
          'Refill Request Transmitted',
          `Your refill for ${name} has been processed and forwarded to the hospital pharmacy.`,
          'success'
        );
      }
    });
  });

  // Navigation handlers
  container.querySelector('#btn-patient-book')?.addEventListener('click', () => {
    store.setActiveTab('appointments');
  });

  container.querySelector('#btn-book-empty')?.addEventListener('click', () => {
    store.setActiveTab('appointments');
  });

  container.querySelector('#btn-patient-all-apts')?.addEventListener('click', () => {
    store.setActiveTab('appointments');
  });

  container.querySelector('#btn-patient-all-rxs')?.addEventListener('click', () => {
    store.setActiveTab('prescriptions');
  });

  return container;
}
