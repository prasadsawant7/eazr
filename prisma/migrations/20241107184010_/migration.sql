/*
  Warnings:

  - You are about to drop the column `hashedRT` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "hashedRT",
ADD COLUMN     "hashed_rt" TEXT;
