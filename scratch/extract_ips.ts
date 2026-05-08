import fs from 'fs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const branches = await prisma.branch.findMany({
    select: {
      name: true,
      expectedIp: true,
      rtspUrl: true
    }
  })

  let output = "| Филиал | IP-адрес | RTSP URL |\n"
  output += "|---|---|---|\n"
  branches.forEach((b: any) => {
    output += `| ${b.name} | ${b.expectedIp || "N/A"} | ${b.rtspUrl || "N/A"} |\n`
  })

  fs.writeFileSync('branch_ips.md', output)
  console.log("Done")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
