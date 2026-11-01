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

  // Doctor (Prescriber)
  const doctorUser = await prisma.user.upsert({
    where: { email: 'dr.hendrik@medflow.test' }, update: {},
    create: { email: 'dr.hendrik@medflow.test', passwordHash: await pw('DoctorPass123'), role: 'DOCTOR' },
  });
  await prisma.prescriber.upsert({
    where: { userId: doctorUser.id }, update: {},
    create: {
      userId: doctorUser.id,
      name: 'Dr. Hendrik van der Merwe',
      hpcsaNumber: 'MP0492819',
      type: 'DOCTOR',
      practice: 'Cape Integrative Medical Practice',
      specialization: 'Integrative Medicine & Chronic Pain',
      commissionRate: 0.10,
    },
  });

  // Psychiatrist (Prescriber)
  const psychUser = await prisma.user.upsert({
    where: { email: 'dr.nkosi@medflow.test' }, update: {},
    create: { email: 'dr.nkosi@medflow.test', passwordHash: await pw('PsychPass123'), role: 'PSYCHIATRIST' },
  });
  await prisma.prescriber.upsert({
    where: { userId: psychUser.id }, update: {},
    create: {
      userId: psychUser.id,
      name: 'Dr. Thandi Nkosi',
      hpcsaNumber: 'PS0128492',
      type: 'PSYCHIATRIST',
      practice: 'MindWellness Clinic',
      specialization: 'Neuropsychiatry & Anxiety Disorders',
      commissionRate: 0.12,
    },
  });

  // Pharmacist (Prescriber)
  const pharmacistUser = await prisma.user.upsert({
    where: { email: 'sipho.pharmacist@medflow.test' }, update: {},
    create: { email: 'sipho.pharmacist@medflow.test', passwordHash: await pw('PharmPass123'), role: 'PHARMACIST' },
  });
  await prisma.prescriber.upsert({
    where: { userId: pharmacistUser.id }, update: {},
    create: {
      userId: pharmacistUser.id,
      name: 'Sipho Dlamini',
      hpcsaNumber: 'PC0098412',
      type: 'PHARMACIST',
      practice: 'Atlantic Seaboard Dispensary',
      specialization: 'Natural Compounds & Pharmacology',
      commissionRate: 0.08,
    },
  });

  // Patient
  const patientUser = await prisma.user.upsert({
    where: { email: 'sarah.meyer@medflow.test' }, update: {},
    create: { email: 'sarah.meyer@medflow.test', passwordHash: await pw('PatientPass123'), role: 'PATIENT' },
  });
  await prisma.patient.upsert({
    where: { userId: patientUser.id }, update: {},
    create: {
      userId: patientUser.id,
      name: 'Sarah Meyer',
      dateOfBirth: new Date('1988-04-12'),
      contactNumber: '+27 82 555 1928',
    },
  });

  // Leisure Client
  await prisma.user.upsert({
    where: { email: 'chloe.leisure@medflow.test' }, update: {},
    create: { email: 'chloe.leisure@medflow.test', passwordHash: await pw('LeisurePass123'), role: 'LEISURE_CLIENT' },
  });

  console.log('Seeded successfully with all 7 roles, dual inventory pools, and sample clinical entities.');
}

main().finally(() => prisma.$disconnect());
