-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hashedRT" TEXT,
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3),
ALTER COLUMN "password_hash" DROP NOT NULL;
