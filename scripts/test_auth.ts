import { PrismaClient } from "@prisma/client";
import { PrismaNodeSQLite } from "prisma-adapter-node-sqlite";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const url = `file:${dbPath}`;
const adapter = new PrismaNodeSQLite({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "grevelien@yandex.ru";
  const passwordToTest = "3ghZ3Z32";
  
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log("User not found");
    return;
  }
  
  const match = await bcrypt.compare(passwordToTest, user.password || "");
  console.log("Password match result:", match);
  
  // Also test case sensitivity
  const userUpper = await prisma.user.findFirst({ 
    where: { 
      OR: [
        { email: email.toUpperCase() },
        { email: email.toLowerCase() }
      ]
    } 
  });
  console.log("Found user with uppercase search?", !!userUpper);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
