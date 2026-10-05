-- Initial schema (matches prisma/schema.prisma and the Task 1 ERD)
CREATE TYPE "Role" AS ENUM ('OWNER','PHARMACY_MANAGER','PHARMACIST','DOCTOR','PSYCHIATRIST','PATIENT','LEISURE_CLIENT');
CREATE TYPE "Channel" AS ENUM ('PATIENT','PHARMACY','LEISURE');
CREATE TYPE "PoolType" AS ENUM ('RETAIL','BULK');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED');
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT','SENT','OVERDUE','PAID');
CREATE TYPE "PrescriberType" AS ENUM ('DOCTOR','PSYCHIATRIST','PHARMACIST');
CREATE TYPE "Category" AS ENUM ('CBD_OIL','CBD_CAPSULE','CBD_TOPICAL','CBD_EDIBLE','HOMEOPATHIC_REMEDY','HOMEOPATHIC_TINCTURE','HOMEOPATHIC_CREAM','HOMEOPATHIC_DROPS','BULK_PACK','WELLNESS');

CREATE TABLE "users" (
  "user_id" UUID NOT NULL,
  "email" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "role" "Role" NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
  "locked_until" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);
CREATE TABLE "pharmacies" (
  "pharmacy_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "license_number" TEXT NOT NULL,
  "credit_limit" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "credit_terms_days" INTEGER NOT NULL DEFAULT 30,
  CONSTRAINT "pharmacies_pkey" PRIMARY KEY ("pharmacy_id")
);
CREATE TABLE "patients" (
  "patient_id" UUID NOT NULL,
  "user_id" UUID,
  "name" TEXT NOT NULL,
  "date_of_birth" DATE,
  "contact_number" TEXT,
  "anonymised_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "patients_pkey" PRIMARY KEY ("patient_id")
);
CREATE TABLE "prescribers" (
  "prescriber_id" UUID NOT NULL,
  "user_id" UUID,
  "name" TEXT NOT NULL,
  "hpcsa_number" TEXT NOT NULL,
  "type" "PrescriberType" NOT NULL,
  "practice" TEXT,
  "specialization" TEXT,
  "commission_rate" DECIMAL(5,4) NOT NULL DEFAULT 0,
  CONSTRAINT "prescribers_pkey" PRIMARY KEY ("prescriber_id")
);
CREATE TABLE "products" (
  "product_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "category" "Category" NOT NULL,
  "unit_price" DECIMAL(10,2) NOT NULL,
  "bulk_price" DECIMAL(10,2) NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);
CREATE TABLE "inventory_items" (
  "item_id" UUID NOT NULL,
  "product_id" UUID NOT NULL,
  "pool_type" "PoolType" NOT NULL,
  "quantity_on_hand" INTEGER NOT NULL,
  "reorder_threshold" INTEGER NOT NULL DEFAULT 0,
  "expiry_date" DATE,
  CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("item_id")
);
CREATE TABLE "orders" (
  "order_id" UUID NOT NULL,
  "pharmacy_id" UUID NOT NULL,
  "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "channel" "Channel" NOT NULL DEFAULT 'PHARMACY',
  "quantity" INTEGER NOT NULL DEFAULT 0,
  "bulk_revenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
  CONSTRAINT "orders_pkey" PRIMARY KEY ("order_id")
);
CREATE TABLE "order_items" (
  "order_item_id" UUID NOT NULL,
  "order_id" UUID NOT NULL,
  "product_id" UUID NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unit_price" DECIMAL(10,2) NOT NULL,
  CONSTRAINT "order_items_pkey" PRIMARY KEY ("order_item_id")
);
CREATE TABLE "invoices" (
  "invoice_id" UUID NOT NULL,
  "order_id" UUID NOT NULL,
  "vat_amount" DECIMAL(12,2) NOT NULL,
  "total_amount" DECIMAL(12,2) NOT NULL,
  "due_date" DATE NOT NULL,
  "status" "InvoiceStatus" NOT NULL DEFAULT 'SENT',
  CONSTRAINT "invoices_pkey" PRIMARY KEY ("invoice_id")
);
CREATE TABLE "payments" (
  "payment_id" UUID NOT NULL,
  "invoice_id" UUID NOT NULL,
  "amount_paid" DECIMAL(12,2) NOT NULL,
  "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "method" TEXT NOT NULL,
  CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);
CREATE TABLE "prescriptions" (
  "prescription_id" UUID NOT NULL,
  "patient_id" UUID NOT NULL,
  "prescriber_id" UUID NOT NULL,
  "product_id" UUID NOT NULL,
  "dosage" TEXT NOT NULL,
  "date_issued" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("prescription_id")
);
CREATE TABLE "transactions" (
  "transaction_id" UUID NOT NULL,
  "order_id" UUID,
  "channel" "Channel" NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "bulk_revenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "quantity" INTEGER NOT NULL DEFAULT 0,
  "description" TEXT,
  "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);
CREATE TABLE "assets" (
  "asset_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "cost" DECIMAL(12,2) NOT NULL,
  "depreciable" BOOLEAN NOT NULL DEFAULT true,
  "channel" "Channel" NOT NULL DEFAULT 'PHARMACY',
  "bulk_revenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "acquired_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "assets_pkey" PRIMARY KEY ("asset_id")
);
CREATE TABLE "expenses" (
  "expense_id" UUID NOT NULL,
  "description" TEXT NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "channel" "Channel" NOT NULL DEFAULT 'PHARMACY',
  "bulk_revenue" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "incurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "expenses_pkey" PRIMARY KEY ("expense_id")
);
CREATE TABLE "refresh_tokens" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "revoked_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "consent_records" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "purpose" TEXT NOT NULL,
  "granted" BOOLEAN NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "audit_logs" (
  "id" UUID NOT NULL,
  "user_id" UUID,
  "action" TEXT NOT NULL,
  "entity" TEXT NOT NULL,
  "entity_id" TEXT,
  "metadata" JSONB,
  "ip" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- Unique indexes
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "pharmacies_license_number_key" ON "pharmacies"("license_number");
CREATE UNIQUE INDEX "patients_user_id_key" ON "patients"("user_id");
CREATE UNIQUE INDEX "prescribers_user_id_key" ON "prescribers"("user_id");
CREATE UNIQUE INDEX "prescribers_hpcsa_number_key" ON "prescribers"("hpcsa_number");
CREATE UNIQUE INDEX "invoices_order_id_key" ON "invoices"("order_id");
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- Performance indexes
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "prescribers_type_idx" ON "prescribers"("type");
CREATE INDEX "products_category_idx" ON "products"("category");
CREATE INDEX "products_name_idx" ON "products"("name");
CREATE INDEX "inventory_items_product_id_pool_type_idx" ON "inventory_items"("product_id","pool_type");
CREATE INDEX "inventory_items_expiry_date_idx" ON "inventory_items"("expiry_date");
CREATE INDEX "orders_pharmacy_id_status_idx" ON "orders"("pharmacy_id","status");
CREATE INDEX "orders_order_date_idx" ON "orders"("order_date");
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");
CREATE INDEX "order_items_product_id_idx" ON "order_items"("product_id");
CREATE INDEX "invoices_status_due_date_idx" ON "invoices"("status","due_date");
CREATE INDEX "payments_invoice_id_idx" ON "payments"("invoice_id");
CREATE INDEX "prescriptions_patient_id_idx" ON "prescriptions"("patient_id");
CREATE INDEX "prescriptions_prescriber_id_idx" ON "prescriptions"("prescriber_id");
CREATE INDEX "transactions_channel_occurred_at_idx" ON "transactions"("channel","occurred_at");
CREATE INDEX "transactions_occurred_at_idx" ON "transactions"("occurred_at");
CREATE INDEX "assets_channel_idx" ON "assets"("channel");
CREATE INDEX "expenses_channel_incurred_at_idx" ON "expenses"("channel","incurred_at");
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");
CREATE INDEX "consent_records_user_id_purpose_idx" ON "consent_records"("user_id","purpose");
CREATE INDEX "audit_logs_entity_entity_id_idx" ON "audit_logs"("entity","entity_id");
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id","created_at");

-- Foreign keys
ALTER TABLE "pharmacies" ADD CONSTRAINT "pharmacies_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "prescribers" ADD CONSTRAINT "prescribers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("pharmacy_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("invoice_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_prescriber_id_fkey" FOREIGN KEY ("prescriber_id") REFERENCES "prescribers"("prescriber_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
