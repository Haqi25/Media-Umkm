-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpires" TIMESTAMP(3);
