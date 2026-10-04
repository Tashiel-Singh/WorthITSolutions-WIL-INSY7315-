/**
 * Screen 7: Bulk Order Portal
 * Caption: Figure 7: Bulk Order Portal - Streamlined ordering for B2B clients with automatic bulk discounts.
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { showToast } from '../common/Toast.js';

export function renderBulkOrderScreen() {
  const state = store.getState();
  const clients = state.clients;
  const products = state.products;

  let selectedClientId = clients[0].id;
  let orderQuantities = {
    'PRD-101': 2, // 2 boxes of 12 = 24 units Arnica
    'PRD-103': 1, // 1 box of 24 Calendula
    'PRD-201': 1  // 1 set of 4 Waiting Room Chairs
  };

  const container = document.createElement('div');
  container.className = 'page-content';

  function renderContent() {
    const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

    // Compute subtotal, discount, VAT, and total
    let subtotal = 0;
    const selectedItems = [];

    Object.keys(orderQuantities).forEach((pId) => {
      const qty = orderQuantities[pId];
      if (qty > 0) {
        const prod = products.find((p) => p.id === pId);
        if (prod) {
          const itemUnits = prod.category === 'Homeopathic' ? qty * 12 : qty;
          const itemCost = prod.unitPriceBulk * itemUnits;
          subtotal += itemCost;
          selectedItems.push({
            productId: prod.id,
            productName: prod.name,
            quantity: itemUnits,
            displayQty: `${qty} ${prod.bulkPackaging}`,
            unitPrice: prod.unitPriceBulk,
            lineTotal: itemCost
          });
        }
      }
    });

    const discountRate = selectedClient.discountTier || 0.15;
    const discountAmount = subtotal * discountRate;
    const netAmount = subtotal - discountAmount;
    const vatAmount = netAmount * 0.15;
    const totalAmount = netAmount + vatAmount;

    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>B2B Bulk Order Portal</h1>
          <p>Direct wholesale ordering portal for contracted medical clinics and healthcare facilities.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" id="btn-back-dashboard">
            ← Dashboard
          </button>
          <button class="btn btn-primary" id="btn-next-screen8">
            Next: Invoicing →
          </button>
        </div>
      </div>

      <!-- Client Selection Bar -->
      <div class="card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="user-avatar" style="width: 42px; height: 42px; font-size: 1rem;">
              B2B
            </div>
            <div>
              <label class="form-label" style="margin-bottom: 0.2rem;">Select Purchasing Clinic / Client</label>
              <select id="bulk-client-select" class="form-select" style="min-width: 320px; font-weight: 700;">
                ${clients
                  .map(
                    (c) =>
                      `<option value="${c.id}" ${c.id === selectedClientId ? 'selected' : ''}>
                        ${c.name} (${c.contactPerson})
                      </option>`
                  )
                  .join('')}
              </select>
            </div>
          </div>

          <div style="text-align: right;">
            <span class="badge badge-bulk" style="font-size: 0.8125rem; padding: 0.35rem 0.75rem;">
              ✓ Auto Bulk Discount Applied: ${(discountRate * 100).toFixed(0)}% OFF
            </span>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem;">
              VAT Number: ${selectedClient.vatNumber}
            </div>
          </div>
        </div>
      </div>

      <div class="grid-cols-2-1">
        <!-- Left: Product Catalog Selection Cards -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <!-- Homeopathic Section -->
          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title">${Icons.prescriptions} Homeopathic Remedies (Wholesale Boxes)</div>
                <div class="card-subtitle">Packed in standard wholesale dispensable boxes of 12 / 24 units</div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${products
                .filter((p) => p.category === 'Homeopathic')
                .map((prod) => {
                  const currentQty = orderQuantities[prod.id] || 0;
                  return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                  <div>
                    <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${prod.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${prod.bulkPackaging} • Reserved: ${prod.bulkStock} units</div>
                    <div style="font-size: 0.8125rem; color: #10b981; font-weight: 700; margin-top: 0.2rem;">
                      R ${prod.unitPriceBulk.toFixed(2)} / unit
                    </div>
                  </div>

                  <!-- Quantity Controls -->
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button class="btn btn-secondary btn-sm btn-qty-minus" data-id="${prod.id}" style="width: 32px; height: 32px; padding: 0;">-</button>
                    <span style="font-weight: 800; font-size: 1rem; min-width: 24px; text-align: center;">${currentQty}</span>
                    <button class="btn btn-secondary btn-sm btn-qty-plus" data-id="${prod.id}" style="width: 32px; height: 32px; padding: 0;">+</button>
                  </div>
                </div>
              `;
                })
                .join('')}
            </div>
          </div>

          <!-- Furniture Section -->
          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title">${Icons.inventory} Clinic & Practice Furniture</div>
                <div class="card-subtitle">Heavy-duty healthcare furniture sets and treatment tables</div>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              ${products
                .filter((p) => p.category === 'Furniture')
                .map((prod) => {
                  const currentQty = orderQuantities[prod.id] || 0;
                  return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                  <div>
                    <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${prod.name}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${prod.bulkPackaging} • Reserved: ${prod.bulkStock} units</div>
                    <div style="font-size: 0.8125rem; color: #10b981; font-weight: 700; margin-top: 0.2rem;">
                      R ${prod.unitPriceBulk.toFixed(2)} / unit
                    </div>
                  </div>

                  <!-- Quantity Controls -->
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button class="btn btn-secondary btn-sm btn-qty-minus" data-id="${prod.id}" style="width: 32px; height: 32px; padding: 0;">-</button>
                    <span style="font-weight: 800; font-size: 1rem; min-width: 24px; text-align: center;">${currentQty}</span>
                    <button class="btn btn-secondary btn-sm btn-qty-plus" data-id="${prod.id}" style="width: 32px; height: 32px; padding: 0;">+</button>
                  </div>
                </div>
              `;
                })
                .join('')}
            </div>
          </div>
        </div>

        <!-- Right: Order Summary & Checkout Card -->
        <div class="card" style="position: sticky; top: calc(var(--header-height) + 1.5rem); height: fit-content;">
          <div class="card-header">
            <div>
              <div class="card-title">Order Summary</div>
              <div class="card-subtitle">${selectedItems.length} line items selected</div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem; max-height: 280px; overflow-y: auto;">
            ${
              selectedItems.length === 0
                ? `<div style="text-align: center; color: var(--text-muted); padding: 1.5rem 0;">No items selected yet. Use + to add boxes.</div>`
                : selectedItems
                    .map(
                      (it) => `
              <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
                <div>
                  <div style="font-weight: 700; color: var(--text-primary);">${it.productName}</div>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">${it.displayQty} (${it.quantity} units)</div>
                </div>
                <div style="font-weight: 700; color: var(--text-primary);">
                  R ${it.lineTotal.toFixed(2)}
                </div>
              </div>
            `
                    )
                    .join('')
            }
          </div>

          <!-- Price Calculations -->
          <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-secondary);">Wholesale Subtotal:</span>
              <span>R ${subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: #10b981; font-weight: 700;">
              <span>Bulk Discount (15%):</span>
              <span>- R ${discountAmount.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-secondary);">VAT (15% RSA Standard):</span>
              <span>R ${vatAmount.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-subtle); padding-top: 0.5rem; font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">
              <span>Total Payable:</span>
              <span style="color: var(--color-primary);">R ${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button class="btn btn-primary" id="btn-place-bulk-order" style="width: 100%; height: 44px;" ${selectedItems.length === 0 ? 'disabled' : ''}>
            ${Icons.check} Place Bulk Order & Generate Invoice
          </button>
        </div>
      </div>
    `;

    // Listeners
    container.querySelector('#bulk-client-select')?.addEventListener('change', (e) => {
      selectedClientId = e.target.value;
      renderContent();
    });

    // Plus buttons
    container.querySelectorAll('.btn-qty-plus').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        orderQuantities[id] = (orderQuantities[id] || 0) + 1;
        renderContent();
      });
    });

    // Minus buttons
    container.querySelectorAll('.btn-qty-minus').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (orderQuantities[id] > 0) {
          orderQuantities[id] -= 1;
          renderContent();
        }
      });
    });

    // Place Order handler -> creates order & redirects to Invoicing Screen 8!
    container.querySelector('#btn-place-bulk-order')?.addEventListener('click', () => {
      if (selectedItems.length === 0) return;

      const result = store.placeBulkOrder({
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        items: selectedItems,
        subtotal,
        discountAmount,
        vatAmount,
        totalAmount
      });

      showToast(
        'Bulk Order Placed Successfully',
        `Generated Order ${result.order.id} and Invoice ${result.invoice.id}.`,
        'success'
      );

      // Jump directly to Screen 8: Invoicing
      store.navigateTo('invoicing', { invoiceId: result.invoice.id });
    });

    container.querySelector('#btn-back-dashboard')?.addEventListener('click', () => {
      store.navigateTo('dashboard');
    });

    container.querySelector('#btn-next-screen8')?.addEventListener('click', () => {
      store.navigateTo('invoicing');
    });
  }

  renderContent();
  return container;
}
