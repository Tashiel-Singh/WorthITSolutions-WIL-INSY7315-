/**
 * Screen 8: Automated Invoicing
 * Caption: Figure 8: Automated Invoicing - VAT-compliant invoices generated in seconds.
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { showToast } from '../common/Toast.js';

export function renderInvoicingScreen() {
  const state = store.getState();
  const invoices = state.invoices;
  const company = state.companyInfo;

  let activeInvId = state.activeInvoiceId || invoices[0].id;
  let invoice = invoices.find((i) => i.id === activeInvId) || invoices[0];

  const container = document.createElement('div');
  container.className = 'page-content';

  function renderContent() {
    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Automated Tax-Compliant Invoicing</h1>
          <p>Instantaneous invoice rendering with isolated 15% VAT calculation and 30-day EFT settlement schedules.</p>
        </div>
        <div class="page-actions">
          <!-- Switch Active Invoice dropdown -->
          <select id="select-invoice-switcher" class="form-select" style="min-width: 220px;">
            ${invoices
              .map(
                (inv) =>
                  `<option value="${inv.id}" ${inv.id === invoice.id ? 'selected' : ''}>
                    ${inv.id} (${inv.clientName.slice(0, 20)}...)
                  </option>`
              )
              .join('')}
          </select>
          <button class="btn btn-secondary" id="btn-back-dashboard">
            ← Dashboard
          </button>
          <button class="btn btn-primary" id="btn-next-screen9">
            Next: Order Management →
          </button>
        </div>
      </div>

      <!-- Professional Printable Invoice Card -->
      <div class="card" style="max-width: 960px; margin: 0 auto 2rem; padding: 2.5rem; box-shadow: var(--shadow-lg);">
        <!-- Invoice Top Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 2rem; border-bottom: 2px solid var(--border-subtle); flex-wrap: wrap; gap: 1.5rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
              <div style="width: 36px; height: 36px; border-radius: var(--radius-md); background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800;">
                ${Icons.shield}
              </div>
              <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">${company.name}</h2>
            </div>
            <div style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.5;">
              <div>${company.tradingAs}</div>
              <div>${company.address}</div>
              <div>VAT Registration: <strong>${company.vatNumber}</strong></div>
              <div>Email: ${company.email} • Tel: ${company.phone}</div>
            </div>
          </div>

          <div style="text-align: right;">
            <span class="badge ${invoice.status === 'Paid' ? 'badge-success' : invoice.status === 'Overdue' ? 'badge-danger' : 'badge-info'}" style="font-size: 0.85rem; padding: 0.35rem 0.85rem; text-transform: uppercase;">
              ${invoice.status} TAX INVOICE
            </span>
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-top: 0.5rem; font-family: var(--font-mono);">
              ${invoice.id}
            </div>
            <div style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.25rem;">
              Order Ref: <strong>${invoice.orderId}</strong>
            </div>
          </div>
        </div>

        <!-- Billing Parties Details & Due Date -->
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem; padding: 1.75rem 0; border-bottom: 1px solid var(--border-subtle);">
          <div>
            <div style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 0.35rem;">
              BILLED TO (CLIENT):
            </div>
            <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary);">
              ${invoice.clientName}
            </div>
            <div style="font-size: 0.8125rem; color: var(--text-secondary); margin-top: 0.25rem; line-height: 1.5;">
              <div>Client ID: <span class="code-tag">${invoice.clientId}</span></div>
              <div>Official VAT: ZA419082910</div>
              <div>Terms: Contracted Net 30-Day Account</div>
            </div>
          </div>

          <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-md); padding: 1rem 1.25rem; display: flex; flex-direction: column; justify-content: center; gap: 0.4rem; border: 1px solid var(--border-subtle);">
            <div style="display: flex; justify-content: space-between; font-size: 0.8125rem;">
              <span style="color: var(--text-muted);">Issue Date:</span>
              <strong style="color: var(--text-primary);">${invoice.issueDate}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8125rem;">
              <span style="color: var(--text-muted);">Payment Due Date:</span>
              <strong style="color: #2563eb; font-size: 0.95rem;">${invoice.dueDate} (30 Days)</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8125rem;">
              <span style="color: var(--text-muted);">Payment Method:</span>
              <span style="color: var(--text-primary);">Electronic Funds Transfer (EFT)</span>
            </div>
          </div>
        </div>

        <!-- Line Items Table -->
        <div style="margin: 1.75rem 0;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Description / Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price (Excl)</th>
                <th style="text-align: right;">Line Total (Excl)</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items
                .map(
                  (item) => `
                <tr>
                  <td>
                    <strong style="color: var(--text-primary);">${item.description}</strong>
                  </td>
                  <td style="text-align: center; color: var(--text-secondary);">${item.qty}</td>
                  <td style="text-align: right; color: var(--text-secondary);">R ${item.unitPrice.toFixed(2)}</td>
                  <td style="text-align: right; font-weight: 700; color: var(--text-primary);">R ${item.total.toFixed(2)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <!-- VAT Highlight Box & Totals Summary -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
          <!-- EFT Banking Details Box -->
          <div style="padding: 1.25rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); font-size: 0.8125rem;">
            <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.35rem;">
              ${Icons.shield} Banking & Settlement Instructions
            </div>
            <div style="color: var(--text-secondary); line-height: 1.5;">
              <div>Bank: <strong>${company.bankDetails.bank}</strong></div>
              <div>Account Name: ${company.bankDetails.accountName}</div>
              <div>Account Number: <span class="code-tag">${company.bankDetails.accountNumber}</span></div>
              <div>Branch Code: ${company.bankDetails.branchCode} • SWIFT: ${company.bankDetails.swift}</div>
              <div style="margin-top: 0.35rem; color: var(--color-primary); font-weight: 600;">
                Reference: <strong>${invoice.id}</strong>
              </div>
            </div>
          </div>

          <!-- Total Calculation with VAT Highlight Box -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;">
            <div style="display: flex; justify-content: space-between; padding: 0.35rem 0;">
              <span style="color: var(--text-secondary);">Subtotal (Excl. VAT):</span>
              <strong style="color: var(--text-primary);">R ${invoice.subtotal.toFixed(2)}</strong>
            </div>

            <!-- Highlighted VAT Box -->
            <div style="padding: 0.85rem 1rem; background: var(--color-primary-bg); border: 1px solid var(--color-primary-border); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--color-primary);">Standard VAT Split (15%)</strong>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Qualifying input tax deduction item</div>
              </div>
              <strong style="color: var(--color-primary); font-size: 1.05rem;">R ${invoice.vatAmount.toFixed(2)}</strong>
            </div>

            <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-top: 2px solid var(--border-subtle); font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">
              <span>Total Amount Due:</span>
              <span style="color: var(--color-primary);">R ${invoice.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- Action Footer -->
        <div style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div style="font-size: 0.75rem; color: var(--text-muted);">
            Generated by MedFlow Invoicing Engine • Developed by <strong>WorthIT Solutions</strong>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <button class="btn btn-secondary" id="btn-download-invoice-pdf">
              ${Icons.records} Download PDF
            </button>
            <button class="btn btn-primary" id="btn-send-invoice-email">
              ${Icons.bell} Send Invoice to Client
            </button>
          </div>
        </div>
      </div>
    `;

    // Switch Invoice
    container.querySelector('#select-invoice-switcher')?.addEventListener('change', (e) => {
      activeInvId = e.target.value;
      invoice = invoices.find((i) => i.id === activeInvId) || invoices[0];
      store.state.activeInvoiceId = activeInvId;
      renderContent();
    });

    // Send Invoice Email Button
    container.querySelector('#btn-send-invoice-email')?.addEventListener('click', () => {
      showToast(
        'Invoice Dispatched',
        `Tax invoice ${invoice.id} sent to ${invoice.clientName} with 30-day payment terms.`,
        'success'
      );
    });

    // Download PDF Button
    container.querySelector('#btn-download-invoice-pdf')?.addEventListener('click', () => {
      showToast(
        'PDF Exported',
        `Generated official PDF for Tax Invoice ${invoice.id}.`,
        'info'
      );
    });

    container.querySelector('#btn-back-dashboard')?.addEventListener('click', () => {
      store.navigateTo('dashboard');
    });

    container.querySelector('#btn-next-screen9')?.addEventListener('click', () => {
      store.navigateTo('order-management');
    });
  }

  renderContent();
  return container;
}
