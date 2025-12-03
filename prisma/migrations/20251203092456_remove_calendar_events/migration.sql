/*
  Warnings:

  - You are about to drop the `calendar_events` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "calendar_events" DROP CONSTRAINT "calendar_events_user_id_fkey";

-- DropTable
DROP TABLE "calendar_events";
