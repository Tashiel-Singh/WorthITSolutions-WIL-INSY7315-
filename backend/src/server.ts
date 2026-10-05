import { app } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

const server = app.listen(env.port, () => console.log(`MedFlow API listening on :${env.port}`));
const shutdown = async () => { server.close(); await prisma.$disconnect(); process.exit(0); };
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
