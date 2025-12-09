/*
  Warnings:

  - The values [OVERVIEW] on the enum `SubtaskType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubtaskType_new" AS ENUM ('GENERIC', 'INQUIRY_PROCESS', 'FORM', 'MODAL', 'REQUEST', 'INTERACTIVE_LIST', 'LIST_ACTIONS_AND_PAGINATION', 'SIMPLE_FORM', 'PAGE', 'TASK_GROUP');
ALTER TABLE "public"."subtasks" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "subtasks" ALTER COLUMN "type" TYPE "SubtaskType_new" USING ("type"::text::"SubtaskType_new");
ALTER TYPE "SubtaskType" RENAME TO "SubtaskType_old";
ALTER TYPE "SubtaskType_new" RENAME TO "SubtaskType";
DROP TYPE "public"."SubtaskType_old";
ALTER TABLE "subtasks" ALTER COLUMN "type" SET DEFAULT 'GENERIC';
COMMIT;
