import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const pw = (p: string) => bcrypt.hash(p, 12);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@medflow.test' }, update: {},
    create: { email: 'owner@medflow.test', passwordHash: await pw('OwnerPass123'), role: 'OWNER' },
  });
  const pharmUser = await prisma.user.upsert({
    where: { email: 'stmarys@medflow.test' }, update: {},
    create: { email: 'stmarys@medflow.test', passwordHash: await pw('PharmacyPass123'), role: 'PHARMACY_MANAGER' },
  });
  await prisma.pharmacy.upsert({
    where: { id: pharmUser.id }, update: {},
    create: { id: pharmUser.id, name: "St. Mary's Pharmacy", licenseNumber: 'PH-0001', creditLimit: 50000, creditTermsDays: 30 },
  });

  const products = [
    { name: 'CBD Oil 30ml', category: 'CBD_OIL', unitPrice: 450, bulkPrice: 330 },
    { name: 'CBD Capsules 60s', category: 'CBD_CAPSULE', unitPrice: 380, bulkPrice: 275 },
    { name: 'Arnica Homeopathic Cream', category: 'HOMEOPATHIC_CREAM', unitPrice: 180, bulkPrice: 130 },
  ] as const;
  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (existing) continue;
    const created = await prisma.product.create({ data: p });
    const exp = new Date(); exp.setFullYear(exp.getFullYear() + 1);
    await prisma.inventoryItem.createMany({ data: [
      { productId: created.id, poolType: 'BULK', quantityOnHand: 500, reorderThreshold: 100, expiryDate: exp },
      { productId: created.id, poolType: 'RETAIL', quantityOnHand: 100, reorderThreshold: 20, expiryDate: exp },
    ] });
  }
  console.log('Seeded. Owner:', owner.email, '(change passwords immediately outside dev)');
}

main().finally(() => prisma.$disconnect());
