-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "subtasks" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'OPEN';
