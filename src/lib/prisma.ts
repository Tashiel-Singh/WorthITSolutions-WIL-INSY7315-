import { PrismaClient } from '@prisma/client';

// All DB access goes through Prisma's query builder = parameterised queries only.
// Unsafe raw-SQL helpers are banned in this codebase (enforced by a unit test + code review).
export const prisma = new PrismaClient();
