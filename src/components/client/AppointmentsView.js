/**
 * Client Portal — Appointments Booking Wizard & Schedule Manager
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { openModal } from '../common/Modal.js';
import { showToast } from '../common/Toast.js';

export function renderAppointmentsView() {
  const state = store.getState();
  const user = state.currentUser;
  const doctors = state.users.filter((u) => u.role === 'doctor' && u.status === 'active');

  const myAppointments = state.appointments.filter(
    (a) => a.patientName === user.name || a.patientId === user.patientId
  );

  const container = document.createElement('div');
  container.className = 'page-content';

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Appointment Schedule & Booking</h1>
        <p>Book consultations with specialist physicians and view upcoming clinic appointments.</p>
      </div>
    </div>

    <div class="grid-cols-1-2">
      <!-- Left: Interactive Booking Card -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${Icons.appointments} Schedule a New Consultation</div>
            <div class="card-subtitle">Choose physician and appointment slot</div>
          </div>
        </div>

        <form id="book-apt-form">
          <!-- Choose Doctor -->
          <div class="form-group">
            <label class="form-label" for="apt-doc-select">Select Doctor & Specialty</label>
            <select id="apt-doc-select" class="form-select" required>
              ${doctors
                .map(
                  (d) =>
                    `<option value="${d.id}" data-name="${d.name}" data-dept="${d.department}">
                      ${d.name} — ${d.department}
                    </option>`
                )
                .join('')}
            </select>
          </div>

          <!-- Appointment Type -->
          <div class="form-group">
            <label class="form-label" for="apt-type-select">Consultation Category</label>
            <select id="apt-type-select" class="form-select" required>
              <option value="General Health Checkup">General Health Checkup</option>
              <option value="Follow-up Consultation" selected>Follow-up Consultation</option>
              <option value="Specialist Clinical Review">Specialist Clinical Review</option>
              <option value="Prescription Refill Consultation">Prescription Refill Consultation</option>
            </select>
          </div>

          <!-- Date & Time Picker -->
          <div class="grid-cols-2" style="margin-bottom: 0;">
            <div class="form-group">
              <label class="form-label" for="apt-date">Date</label>
              <input type="date" id="apt-date" class="form-input" value="2026-08-20" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="apt-time-slot">Preferred Time Slot</label>
              <select id="apt-time-slot" class="form-select">
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:45 AM">11:45 AM</option>
                <option value="02:15 PM" selected>02:15 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:45 PM">04:45 PM</option>
              </select>
            </div>
          </div>

          <!-- Reason / Symptoms -->
          <div class="form-group">
            <label class="form-label" for="apt-symptoms">Reason for Visit / Symptoms</label>
            <textarea id="apt-symptoms" class="form-textarea" rows="3" placeholder="Briefly describe your symptoms or reason for visit..." required>Routine blood pressure monitoring and prescription review.</textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; height: 42px;">
            ${Icons.check} Confirm & Book Appointment
          </button>
        </form>
      </div>

      <!-- Right: My Appointments List -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${Icons.appointments} My Clinic Appointments</div>
            <div class="card-subtitle">Scheduled and completed visits history</div>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Physician & Dept</th>
                <th>Visit Type & Symptoms</th>
                <th>Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${
                myAppointments.length === 0
                  ? `<tr><td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">You have no appointments booked yet.</td></tr>`
                  : myAppointments
                      .map(
                        (apt) => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: #fff;">${apt.date}</div>
                    <span style="font-size: 0.8125rem; color: #60a5fa; font-weight: 600;">${apt.time}</span>
                  </td>
                  <td>
                    <div style="font-weight: 600; color: #fff;">${apt.doctorName}</div>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">${apt.department}</span>
                  </td>
                  <td>
                    <div style="font-size: 0.8125rem; color: var(--text-primary); font-weight: 500;">${apt.type}</div>
                    <div style="font-size: 0.72rem; color: var(--text-secondary);">${apt.symptoms}</div>
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
                    ${
                      apt.status === 'Scheduled'
                        ? `
                      <button class="btn btn-sm btn-danger btn-cancel-apt" data-id="${apt.id}" data-doc="${apt.doctorName}">
                        Cancel
                      </button>
                    `
                        : `<span style="font-size: 0.75rem; color: var(--text-muted);">Completed</span>`
                    }
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
    </div>
  `;

  // Handle Booking Form Submit
  const form = container.querySelector('#book-apt-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const docSelect = container.querySelector('#apt-doc-select');
    const doctorId = docSelect.value;
    const selectedOption = docSelect.options[docSelect.selectedIndex];
    const doctorName = selectedOption.getAttribute('data-name');
    const department = selectedOption.getAttribute('data-dept');

    const type = container.querySelector('#apt-type-select').value;
    const date = container.querySelector('#apt-date').value;
    const time = container.querySelector('#apt-time-slot').value;
    const symptoms = container.querySelector('#apt-symptoms').value.trim();

    store.bookAppointment({
      patientId: user.patientId || 'PAT-8821',
      patientName: user.name,
      doctorId,
      doctorName,
      department,
      type,
      date,
      time,
      symptoms
    });

    showToast(
      'Appointment Confirmed!',
      `Booked with ${doctorName} on ${date} at ${time}.`,
      'success'
    );
  });

  // Handle Cancel Appointment
  container.querySelectorAll('.btn-cancel-apt').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const doc = btn.getAttribute('data-doc');

      openModal({
        title: 'Cancel Appointment?',
        contentHtml: `<p style="color: var(--text-secondary);">Are you sure you want to cancel your consultation with <strong>${doc}</strong>?</p>`,
        confirmText: 'Yes, Cancel Visit',
        onConfirm: () => {
          store.updateAppointmentStatus(id, 'Cancelled');
          showToast('Appointment Cancelled', 'Your scheduled visit has been cancelled.', 'info');
        }
      });
    });
  });

  return container;
}
