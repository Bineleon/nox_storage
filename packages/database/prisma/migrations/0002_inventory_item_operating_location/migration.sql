-- AlterTable
ALTER TABLE "InventoryItem" DROP COLUMN IF EXISTS "depthCm";
ALTER TABLE "InventoryItem" ADD COLUMN "operatingLocation" TEXT;
