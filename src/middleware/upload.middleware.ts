import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";

/** Pasta raiz dos arquivos enviados (back_end/uploads). */
export const PASTA_UPLOADS = path.resolve(__dirname, "..", "..", "uploads");

/** Pasta das fotos dos itens (back_end/uploads/itens). */
export const PASTA_FOTOS_ITENS = path.join(PASTA_UPLOADS, "itens");

// Garante que as pastas existam antes de receber uploads.
fs.mkdirSync(PASTA_FOTOS_ITENS, { recursive: true });

const EXTENSOES: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif"
};

const armazenamento = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, PASTA_FOTOS_ITENS);
    },
    filename: (_req, file, cb) => {
        const extensao =
            EXTENSOES[file.mimetype] ||
            path.extname(file.originalname).toLowerCase() ||
            ".jpg";

        const nome = `${Date.now()}-${crypto
            .randomBytes(6)
            .toString("hex")}${extensao}`;

        cb(null, nome);
    }
});

/**
 * Middleware de upload de uma foto de item.
 * Campo do formulário: "foto".
 * Aceita apenas imagens (JPG, PNG, WEBP, GIF) de até 5 MB.
 */
export const uploadFotoItem = multer({
    storage: armazenamento,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (_req, file, cb) => {
        if (!EXTENSOES[file.mimetype]) {
            cb(
                new Error(
                    "Formato de imagem inválido. Use JPG, PNG, WEBP ou GIF."
                )
            );
            return;
        }

        cb(null, true);
    }
});
