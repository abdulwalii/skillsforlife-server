import { PrismaClient } from "@prisma/client";
import {JOBS} from "./prisma/jobs.js";
import { USERS } from "./prisma/users.js";

const db = new PrismaClient();

async function main() {
    // await db.job.createMany({data: JOBS})
    // await db.user.createMany({data: USERS})
    
}
main()
  .then(async () => {
    console.log("Database Seeded Successfully.")
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })