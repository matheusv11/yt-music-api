-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "senha" VARCHAR(40) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musica_playlist" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "musica_id" VARCHAR(100) NOT NULL,
    "playlist_id" INTEGER NOT NULL,

    CONSTRAINT "musica_playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(20) NOT NULL,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "playlist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "musica_playlist" ADD CONSTRAINT "musica_playlist_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist" ADD CONSTRAINT "playlist_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
