/*
  Warnings:

  - You are about to drop the column `name` on the `subtasks` table. All the data in the column will be lost.
  - Added the required column `featureName` to the `subtasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product` to the `subtasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `subtasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subtasks" DROP COLUMN "name",
ADD COLUMN     "featureName" TEXT NOT NULL,
ADD COLUMN     "product" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL;
