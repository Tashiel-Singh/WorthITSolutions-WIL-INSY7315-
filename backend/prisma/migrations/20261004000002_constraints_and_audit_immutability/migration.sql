-- CHECK constraints: the database itself rejects invalid financial/stock data
ALTER TABLE "products" ADD CONSTRAINT "products_prices_non_negative" CHECK ("unit_price" >= 0 AND "bulk_price" >= 0);
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_qty_non_negative" CHECK ("quantity_on_hand" >= 0 AND "reorder_threshold" >= 0);
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_qty_positive" CHECK ("quantity" > 0 AND "unit_price" >= 0);
ALTER TABLE "orders" ADD CONSTRAINT "orders_non_negative" CHECK ("quantity" >= 0 AND "bulk_revenue" >= 0);
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_amounts_valid" CHECK ("vat_amount" >= 0 AND "total_amount" >= "vat_amount");
ALTER TABLE "payments" ADD CONSTRAINT "payments_amount_positive" CHECK ("amount_paid" > 0);
ALTER TABLE "pharmacies" ADD CONSTRAINT "pharmacies_credit_valid" CHECK ("credit_limit" >= 0 AND "credit_terms_days" >= 0);
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_non_negative" CHECK ("bulk_revenue" >= 0 AND "quantity" >= 0);
ALTER TABLE "assets" ADD CONSTRAINT "assets_non_negative" CHECK ("cost" >= 0 AND "bulk_revenue" >= 0 AND "quantity" >= 0);
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_non_negative" CHECK ("amount" >= 0 AND "bulk_revenue" >= 0 AND "quantity" >= 0);
ALTER TABLE "prescribers" ADD CONSTRAINT "prescribers_commission_valid" CHECK ("commission_rate" >= 0 AND "commission_rate" <= 1);

-- Immutable audit log (NFR: Auditability). UPDATE/DELETE are rejected at DB level.
CREATE OR REPLACE FUNCTION audit_logs_immutable() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs is append-only';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_logs_no_update BEFORE UPDATE OR DELETE ON "audit_logs"
FOR EACH ROW EXECUTE FUNCTION audit_logs_immutable();
