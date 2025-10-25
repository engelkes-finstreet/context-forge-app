/*
  Warnings:

  - You are about to drop the column `featureName` on the `subtasks` table. All the data in the column will be lost.
  - You are about to drop the column `product` on the `subtasks` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `subtasks` table. All the data in the column will be lost.
  - Added the required column `name` to the `subtasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `featureName` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subtasks" DROP COLUMN "featureName",
DROP COLUMN "product",
DROP COLUMN "role",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "featureName" TEXT NOT NULL,
ADD COLUMN     "product" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL;
