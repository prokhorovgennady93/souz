import { PrismaClient } from "@prisma/client";
import { PrismaNodeSQLite } from "prisma-adapter-node-sqlite";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const url = `file:${dbPath}`;
const adapter = new PrismaNodeSQLite({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "grevelien@yandex.ru";
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    console.log("User found:");
    console.log("Email:", user.email);
    console.log("isAdmin:", user.isAdmin);
    console.log("hasFullAccess:", user.hasFullAccess);
    console.log("Password hash starts with:", user.password?.substring(0, 10));
  } else {
    console.log("User not found in", dbPath);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
