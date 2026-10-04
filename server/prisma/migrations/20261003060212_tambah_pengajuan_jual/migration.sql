-- CreateTable
CREATE TABLE "PengajuanJual" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "noWa" TEXT NOT NULL,
    "kota" TEXT,
    "merek" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "tahun" INTEGER NOT NULL,
    "kilometer" INTEGER NOT NULL DEFAULT 0,
    "transmisi" TEXT NOT NULL DEFAULT 'Manual',
    "hargaDiinginkan" DOUBLE PRECISION,
    "images" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'baru',
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PengajuanJual_pkey" PRIMARY KEY ("id")
);
