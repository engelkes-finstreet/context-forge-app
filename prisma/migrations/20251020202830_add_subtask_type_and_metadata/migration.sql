-- CreateEnum
CREATE TYPE "SubtaskType" AS ENUM ('GENERIC', 'INQUIRY_PROCESS', 'FORM', 'MODAL');

-- AlterTable
ALTER TABLE "subtasks" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "type" "SubtaskType" NOT NULL DEFAULT 'GENERIC';
