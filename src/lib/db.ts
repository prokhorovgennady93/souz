import { PrismaClient } from "../generated/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// В режиме разработки Next.js кеширует объект db. 
// Мы принудительно пересоздаем его, если в нем отсутствуют новые модели (например, taskTemplate).
export const db = (globalForPrisma.prisma && (globalForPrisma.prisma as any).taskTemplate) 
  ? globalForPrisma.prisma 
  : new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
