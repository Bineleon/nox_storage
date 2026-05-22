import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ownerId =
  process.env.HARD_CODED_OWNER_ID?.trim() || "00000000-0000-0000-0000-000000000001";

async function main(): Promise<void> {
  const owner = await prisma.user.upsert({
    where: { id: ownerId },
    update: {
      firstname: "Owner",
      lastname: "Local",
      email: "owner@deco-storage.local",
      username: "owner"
    },
    create: {
      id: ownerId,
      firstname: "Owner",
      lastname: "Local",
      email: "owner@deco-storage.local",
      username: "owner"
    }
  });

  await prisma.category.createMany({
    data: [{ name: "Lumière" }, { name: "Mobilier" }],
    skipDuplicates: true
  });

  await prisma.storageLocation.createMany({
    data: [
      {
        name: "Entrepôt principal",
        description: "Stockage principal pour le MVP",
        addressLine: "12 rue des Ateliers",
        postalCode: "75011",
        city: "Paris"
      }
    ],
    skipDuplicates: true
  });

  console.log(`Seed complete for ${owner.email}`);
}

main()
  .catch(async error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
