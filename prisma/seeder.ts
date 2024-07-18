// prisma
import { PrismaClient } from "@prisma/client";
// internal lib
import fs from "fs";
import { join } from "path";
// helpers
import { HashText } from "../src/lib/helpers/helpers";

const prisma = new PrismaClient();

async function main() {
  await prisma.userRole.deleteMany();
  await prisma.synonym.deleteMany();
  await prisma.user.deleteMany();

  // -- User Role --
  const arr_user_role = [
    {
      id_user_role: 1,
      role_name: "admin",
    },
    {
      id_user_role: 2,
      role_name: "teacher",
    },
    {
      id_user_role: 3,
      role_name: "student",
    },
  ];

  for (let iteration = 0; iteration < arr_user_role.length; iteration++) {
    await prisma.userRole.create({
      data: arr_user_role[iteration],
    });
  }

  // -- Synonym --
  const filePathSynonym = join(__dirname, "/seeders/synonym.sql");
  const sqlsSynonym = fs
    .readFileSync(filePathSynonym)
    .toString()
    .split("\n")
    .filter((line) => line.indexOf("--") !== 0)
    .join("\n")
    .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
    .replace(/\s+/g, " ") // excess white space
    .split(";");
  for (const sql of sqlsSynonym) {
    if (sql.length > 1) {
      await prisma.$executeRawUnsafe(sql);
    }
  }

  // -- Admin --
  await prisma.user.create({
    data: {
      username: "admin1",
      password: HashText.encrypt("admin1"),
      full_name: "Admin 1",
      id_user_role: 1,
      created_by: 0,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
