/**
 * Doctor Portal — Live Inventory-Linked Prescription Pad & Dispenser
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { showToast } from '../common/Toast.js';

export function renderPrescriptionDispenserView() {
  const state = store.getState();
  const patients = state.patients;
  const inventory = state.inventory;
  const prescriptions = state.prescriptions;
  const user = state.currentUser;

  // Filter pharmaceutical items
  const pharmaItems = inventory.filter(
    (i) => i.category === 'Pharmaceuticals' || i.category === 'Clinical Supplies'
  );

  const container = document.createElement('div');
  container.className = 'page-content';

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Prescription Pad & Live Stock Dispenser</h1>
        <p>Issue clinical prescriptions verified against real-time hospital pharmacy stock levels.</p>
      </div>
    </div>

    <div class="grid-cols-1-2">
      <!-- Left: Interactive Prescription Form -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${Icons.prescriptions} New Prescription Form</div>
            <div class="card-subtitle">Select patient and inventory drug</div>
          </div>
        </div>

        <form id="rx-dispenser-form">
          <!-- Select Patient -->
          <div class="form-group">
            <label class="form-label" for="rx-patient-select">Select Patient Chart</label>
            <select id="rx-patient-select" class="form-select" required>
              ${patients
                .map(
                  (p) =>
                    `<option value="${p.id}" data-name="${p.name}">${p.name} (${p.id}) — ${p.bloodType}, ${p.age}y</option>`
                )
                .join('')}
            </select>
          </div>

          <!-- Select Medication from Live Inventory -->
          <div class="form-group">
            <label class="form-label" for="rx-med-select">Pharmaceutical Stock Item</label>
            <select id="rx-med-select" class="form-select" required>
              ${pharmaItems
                .map(
                  (i) =>
                    `<option value="${i.sku}" data-name="${i.name}" data-stock="${i.stockQuantity}" data-unit="${i.unit}">
                      ${i.name} — [${i.stockQuantity} in stock] (${i.status})
                    </option>`
                )
                .join('')}
            </select>
          </div>

          <!-- Stock Level Warning Indicator -->
          <div id="rx-stock-preview" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); background: rgba(13, 148, 136, 0.1); border: 1px solid rgba(13, 148, 136, 0.3); margin-bottom: 1.15rem; display: flex; align-items: center; justify-content: space-between;">
            <div style="font-size: 0.8125rem;">
              <span style="color: var(--text-muted);">Available in Central Bay:</span>
              <strong id="stock-count-display" style="color: #2dd4bf; margin-left: 0.25rem;">180 units</strong>
            </div>
            <span id="stock-badge-display" class="badge badge-success">In Stock</span>
          </div>

          <!-- Dosage & Frequency -->
          <div class="grid-cols-2" style="margin-bottom: 0;">
            <div class="form-group">
              <label class="form-label" for="rx-dosage">Dosage Specification</label>
              <input type="text" id="rx-dosage" class="form-input" placeholder="e.g. 500mg, 1 tablet BID" value="1 tablet twice daily with food" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="rx-qty">Dispense Quantity (Deducted)</label>
              <input type="number" id="rx-qty" class="form-input" value="30" min="1" required />
            </div>
          </div>

          <div class="grid-cols-2" style="margin-bottom: 0;">
            <div class="form-group">
              <label class="form-label" for="rx-refills">Authorized Refills</label>
              <select id="rx-refills" class="form-select">
                <option value="0">0 (No Refills)</option>
                <option value="1">1 Refill</option>
                <option value="2" selected>2 Refills</option>
                <option value="3">3 Refills</option>
                <option value="5">5 Refills</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Prescribing Clinician</label>
              <input type="text" class="form-input" value="${user.name}" disabled />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="rx-instructions">Clinical Instructions for Patient</label>
            <textarea id="rx-instructions" class="form-textarea" rows="2" placeholder="Take with full glass of water. Complete full antibiotic course.">Take with water after meals. Report any rash or nausea.</textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; height: 42px;">
            ${Icons.check} Authorize & Dispense Medication
          </button>
        </form>
      </div>

      <!-- Right: Prescriptions History Table -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${Icons.prescriptions} Active Hospital Prescriptions</div>
            <div class="card-subtitle">Issued therapy tracks with refill telemetry</div>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Patient & Rx ID</th>
                <th>Medication & SKU</th>
                <th>Dosage & Instructions</th>
                <th>Refills</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${
                prescriptions.length === 0
                  ? `<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">No prescriptions on file.</td></tr>`
                  : prescriptions
                      .map(
                        (rx) => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: #fff;">${rx.patientName}</div>
                    <span class="code-tag">${rx.id}</span>
                  </td>
                  <td>
                    <div style="font-weight: 600; color: #2dd4bf;">${rx.medication}</div>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">${rx.sku}</span>
                  </td>
                  <td>
                    <div style="font-size: 0.8125rem; color: var(--text-primary);">${rx.dosage}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${rx.instructions}</div>
                  </td>
                  <td>
                    <span class="badge ${rx.refillsRemaining > 0 ? 'badge-success' : 'badge-warning'}">
                      ${rx.refillsRemaining} Refills
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-info">${rx.status}</span>
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

  // Update stock preview when drug select changes
  const medSelect = container.querySelector('#rx-med-select');
  const updateStockPreview = () => {
    const selectedOption = medSelect.options[medSelect.selectedIndex];
    const stockQty = parseInt(selectedOption.getAttribute('data-stock'), 10) || 0;
    const unit = selectedOption.getAttribute('data-unit') || 'units';

    const countDisplay = container.querySelector('#stock-count-display');
    const badgeDisplay = container.querySelector('#stock-badge-display');

    if (countDisplay && badgeDisplay) {
      countDisplay.textContent = `${stockQty} ${unit}`;
      if (stockQty <= 0) {
        badgeDisplay.className = 'badge badge-danger';
        badgeDisplay.textContent = 'Out of Stock';
      } else if (stockQty <= 20) {
        badgeDisplay.className = 'badge badge-warning';
        badgeDisplay.textContent = 'Low Stock';
      } else {
        badgeDisplay.className = 'badge badge-success';
        badgeDisplay.textContent = 'In Stock';
      }
    }
  };

  medSelect.addEventListener('change', updateStockPreview);
  updateStockPreview();

  // Form Submission
  const form = container.querySelector('#rx-dispenser-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const patSelect = container.querySelector('#rx-patient-select');
    const patientId = patSelect.value;
    const patientName = patSelect.options[patSelect.selectedIndex].getAttribute('data-name');

    const medOption = medSelect.options[medSelect.selectedIndex];
    const sku = medOption.value;
    const medication = medOption.getAttribute('data-name');
    const stockQty = parseInt(medOption.getAttribute('data-stock'), 10);

    const dosage = container.querySelector('#rx-dosage').value.trim();
    const quantity = parseInt(container.querySelector('#rx-qty').value, 10);
    const refillsRemaining = parseInt(container.querySelector('#rx-refills').value, 10);
    const instructions = container.querySelector('#rx-instructions').value.trim();

    if (stockQty <= 0) {
      showToast(
        'Inventory Depleted',
        `Cannot dispense ${medication}: 0 items left in pharmacy stock. Request admin restock.`,
        'error'
      );
      return;
    }

    const newRx = store.issuePrescription({
      patientId,
      patientName,
      doctorId: user.id,
      doctorName: user.name,
      medication,
      sku,
      dosage,
      quantity,
      refillsRemaining,
      instructions
    });

    showToast(
      'Prescription Issued & Stock Deducted',
      `Dispensed ${quantity} units of ${medication} for ${patientName}.`,
      'success'
    );
  });

  return container;
}
