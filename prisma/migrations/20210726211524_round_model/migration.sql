-- AlterTable
ALTER TABLE "User" ADD COLUMN     "handicap" DOUBLE PRECISION NOT NULL DEFAULT 36;

-- CreateTable
CREATE TABLE "Round" (
    "id" TEXT NOT NULL,
    "bunker" INTEGER NOT NULL,
    "pitch" INTEGER NOT NULL,
    "chip" INTEGER NOT NULL,
    "shortPuts" INTEGER NOT NULL,
    "longPuts" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);
