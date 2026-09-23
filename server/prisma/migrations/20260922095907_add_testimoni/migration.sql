-- CreateTable
CREATE TABLE "Testimoni" (
    "id" TEXT NOT NULL,
    "namaPelanggan" TEXT NOT NULL,
    "komentar" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "fotoUrl" TEXT,
    "mobilDibeli" TEXT,
    "lokasi" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimoni_pkey" PRIMARY KEY ("id")
);
