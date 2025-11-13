/*
  Warnings:

  - You are about to drop the column `githubRepo` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "githubRepo",
ADD COLUMN     "beGithubRepo" TEXT,
ADD COLUMN     "feGithubRepo" TEXT,
ADD COLUMN     "routesPath" TEXT;
