/*
  Warnings:

  - Added the required column `answered` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `clients` ADD COLUMN `answered` BOOLEAN NOT NULL;
