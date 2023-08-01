import { PrismaClient, Role } from '@prisma/client';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
config();

const prisma = new PrismaClient();

const saltRounds = +process.env.BCRYPT_SALT_ROUNDS;

async function createRootAdministrator() {
  const password = await bcrypt.hash('admin', saltRounds);
  const administrator = await prisma.user.create({
    data: { username: 'admin', password, role: Role.ADMINISTRATOR },
  });
  console.log(administrator);
}

async function main() {
  await createRootAdministrator();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
