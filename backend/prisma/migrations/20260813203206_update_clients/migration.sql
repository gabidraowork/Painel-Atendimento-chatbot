/*
  Warnings:

  - A unique constraint covering the columns `[attendantId,phone]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `clients_attendantId_phone_key` ON `clients`(`attendantId`, `phone`);
