-- CreateTable
CREATE TABLE "Confirmation" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumber" TEXT NOT NULL,

    PRIMARY KEY ("id")
);
