/**
 * Screen 10: Operational Workflow - Automated Payment Reminders
 * Caption: Figure 10: Payment Reminders - Automated follow-ups to reduce late payments.
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { showToast } from '../common/Toast.js';

export function renderPaymentRemindersScreen() {
  const state = store.getState();
  const invoices = state.invoices;
  const remindersLog = state.remindersLog;
  const settings = state.reminderSettings;

  const overdueInvoices = invoices.filter((i) => i.status === 'Overdue');
  const paidInvoices = invoices.filter((i) => i.status === 'Paid');

  const container = document.createElement('div');
  container.className = 'page-content';

  function renderContent() {
    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Automated Payment Reminders & Collections</h1>
          <p>Multi-stage automated reminder schedules and overdue invoice management.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" id="btn-back-dashboard">
            ← Dashboard
          </button>
          <button class="btn btn-primary" id="btn-next-screen11">
            Next: Executive Dashboard →
          </button>
        </div>
      </div>

      <!-- Upper Grid: Overdue Receivables Table + Automated Schedule Settings -->
      <div class="grid-cols-2-1">
        <!-- Overdue Invoices List Card -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">${Icons.alertTriangle} Overdue Invoices Requiring Follow-Up</div>
              <div class="card-subtitle">Direct action follow-up queue</div>
            </div>
            <span class="badge badge-danger">${overdueInvoices.length} Overdue</span>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Client & Invoice #</th>
                  <th>Original Due Date</th>
                  <th>Overdue Age</th>
                  <th>Outstanding Amount</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${
                  overdueInvoices.length === 0
                    ? `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No overdue invoices currently pending.</td></tr>`
                    : overdueInvoices
                        .map(
                          (inv) => `
                  <tr>
                    <td>
                      <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${inv.clientName}</div>
                      <span class="code-tag">${inv.id}</span>
                    </td>
                    <td>
                      <span style="color: var(--text-secondary); font-size: 0.8125rem;">${inv.dueDate}</span>
                    </td>
                    <td>
                      <span class="badge badge-danger" style="font-weight: 800;">
                        ${inv.daysOverdue} Days Overdue
                      </span>
                    </td>
                    <td>
                      <strong style="color: #ef4444; font-size: 1rem;">
                        R ${inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </strong>
                    </td>
                    <td style="text-align: right;">
                      <button class="btn btn-sm btn-primary btn-send-reminder-now" data-id="${inv.id}" data-client="${inv.clientName}">
                        ${Icons.bell} Send Reminder
                      </button>
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

        <!-- Automated Reminder Schedule Settings Card -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">${Icons.records} Auto-Reminder Cadence</div>
              <div class="card-subtitle">Automated email and SMS triggers</div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <!-- 7-Day Reminder Toggle -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div>
                <strong style="color: var(--text-primary); font-size: 0.875rem;">7-Day Advance Notice</strong>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Gentle courtesy reminder before due date</div>
              </div>
              <input type="checkbox" id="toggle-day7" ${settings.day7 ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;" />
            </div>

            <!-- 3-Day Reminder Toggle -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div>
                <strong style="color: var(--text-primary); font-size: 0.875rem;">3-Day Urgent Notice</strong>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Pre-due date reminder with EFT details</div>
              </div>
              <input type="checkbox" id="toggle-day3" ${settings.day3 ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;" />
            </div>

            <!-- 1-Day Reminder Toggle -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div>
                <strong style="color: var(--text-primary); font-size: 0.875rem;">1-Day / Overdue Escalation</strong>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Automated daily overdue notice & statement</div>
              </div>
              <input type="checkbox" id="toggle-day1" ${settings.day1 ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;" />
            </div>

            <div style="font-size: 0.75rem; color: var(--status-success); font-weight: 600; display: flex; align-items: center; gap: 0.35rem;">
              ✓ Automated Follow-Up Subsystem Active (Late payments reduced by 30%)
            </div>
          </div>
        </div>
      </div>

      <!-- Lower Card: Sent Reminders History Log -->
      <div class="card" style="margin-top: 1.5rem; padding: 0;">
        <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div class="card-title">Sent Reminders History & Audit Trail</div>
            <div class="card-subtitle">Verified delivery logs for automated collection notices</div>
          </div>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${remindersLog.length} Notices Logged</span>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Recipient / Client</th>
                <th>Invoice Ref</th>
                <th>Notice Stage</th>
                <th>Amount</th>
                <th>Channel</th>
                <th>Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              ${remindersLog
                .map(
                  (log) => `
                <tr>
                  <td style="font-family: var(--font-mono); font-size: 0.78125rem; color: var(--text-secondary);">${log.sentDate}</td>
                  <td><strong style="color: var(--text-primary);">${log.clientName}</strong></td>
                  <td><span class="code-tag">${log.invoiceId}</span></td>
                  <td><span class="badge badge-danger">${log.stage}</span></td>
                  <td><strong>${log.amount}</strong></td>
                  <td><span style="font-size: 0.8125rem; color: var(--text-secondary);">${log.channel}</span></td>
                  <td><span class="badge badge-success">✓ ${log.status}</span></td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Send Reminder button
    container.querySelectorAll('.btn-send-reminder-now').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const client = btn.getAttribute('data-client');
        const rem = store.sendPaymentReminder(id);
        if (rem) {
          showToast(
            'Payment Reminder Dispatched',
            `Automated notice delivered to ${client} for ${rem.amount}.`,
            'success'
          );
          renderContent();
        }
      });
    });

    // Toggle settings
    container.querySelector('#toggle-day7')?.addEventListener('change', () => {
      store.toggleReminderSetting('day7');
      showToast('Setting Saved', '7-Day reminder schedule updated.', 'info');
    });

    container.querySelector('#toggle-day3')?.addEventListener('change', () => {
      store.toggleReminderSetting('day3');
      showToast('Setting Saved', '3-Day reminder schedule updated.', 'info');
    });

    container.querySelector('#toggle-day1')?.addEventListener('change', () => {
      store.toggleReminderSetting('day1');
      showToast('Setting Saved', '1-Day reminder schedule updated.', 'info');
    });

    container.querySelector('#btn-back-dashboard')?.addEventListener('click', () => {
      store.navigateTo('dashboard');
    });

    container.querySelector('#btn-next-screen11')?.addEventListener('click', () => {
      store.navigateTo('executive-dashboard');
    });
  }

  renderContent();
  return container;
}
