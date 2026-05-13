CREATE TYPE "InventoryItemVisibility" AS ENUM ('PRIVATE', 'PUBLIC');
CREATE TYPE "InventoryItemStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'BORROWED', 'ARCHIVED');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "firstname" TEXT NOT NULL,
  "lastname" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Category" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StorageLocation" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "addressLine" TEXT NOT NULL,
  "postalCode" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  CONSTRAINT "StorageLocation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InventoryItem" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "quantity" INTEGER NOT NULL,
  "heightCm" INTEGER,
  "widthCm" INTEGER,
  "lengthCm" INTEGER,
  "depthCm" INTEGER,
  "condition" TEXT NOT NULL,
  "commentaire" TEXT,
  "visibility" "InventoryItemVisibility" NOT NULL DEFAULT 'PRIVATE',
  "status" "InventoryItemStatus" NOT NULL DEFAULT 'AVAILABLE',
  "categoryId" TEXT NOT NULL,
  "storageLocationId" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InventoryItemPhoto" (
  "id" TEXT NOT NULL,
  "inventoryItemId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InventoryItemPhoto_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE INDEX "InventoryItem_categoryId_idx" ON "InventoryItem"("categoryId");
CREATE INDEX "InventoryItem_storageLocationId_idx" ON "InventoryItem"("storageLocationId");
CREATE INDEX "InventoryItem_ownerId_idx" ON "InventoryItem"("ownerId");
CREATE INDEX "InventoryItemPhoto_inventoryItemId_idx" ON "InventoryItemPhoto"("inventoryItemId");

ALTER TABLE "InventoryItem"
  ADD CONSTRAINT "InventoryItem_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "InventoryItem"
  ADD CONSTRAINT "InventoryItem_storageLocationId_fkey"
  FOREIGN KEY ("storageLocationId") REFERENCES "StorageLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "InventoryItem"
  ADD CONSTRAINT "InventoryItem_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "InventoryItemPhoto"
  ADD CONSTRAINT "InventoryItemPhoto_inventoryItemId_fkey"
  FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
