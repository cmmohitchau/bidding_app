/*
  Warnings:

  - Added the required column `targetTime` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Item" ADD COLUMN     "targetTime" TIMESTAMP(3) NOT NULL;
