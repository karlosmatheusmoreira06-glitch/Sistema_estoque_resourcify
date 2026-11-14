import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Variáveis de ambiente limpas (sem espaços, aspas ou "@" acidental).
function limpar(valor: string | undefined): string {
    return (valor || "")
        .trim()
        .replace(/^["']|["']$/g, "")
        .trim();
}

const CLOUD_NAME = limpar(process.env.CLOUDINARY_CLOUD_NAME).replace(/^@+/, "");
const API_KEY = limpar(process.env.CLOUDINARY_API_KEY);
const API_SECRET = limpar(process.env.CLOUDINARY_API_SECRET);

// Configuração do Cloudinary usando variáveis de ambiente
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
});

// Armazenamento no Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "itens", // pasta no Cloudinary
        allowed_formats: ["jpg", "png", "webp", "gif"],
        transformation: [{ quality: "auto", fetch_format: "auto" }],
    } as any,
});

export const uploadFotoItem = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});

/**
 * Confere no start do servidor se as credenciais do Cloudinary são válidas.
 * Não derruba a aplicação: apenas deixa o problema explícito no log,
 * em vez de aparecer como "Erro interno do servidor" só no upload.
 */
export async function verificarCredenciaisCloudinary(): Promise<void> {
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
        console.log(
            "[Cloudinary] ATENÇÃO: variáveis ausentes. " +
                `cloud_name=${CLOUD_NAME ? "ok" : "VAZIO"}, ` +
                `api_key=${API_KEY ? "ok" : "VAZIO"}, ` +
                `api_secret=${API_SECRET ? "ok" : "VAZIO"}`
        );
        return;
    }

    if (API_SECRET === API_KEY) {
        console.log(
            "[Cloudinary] ATENÇÃO: CLOUDINARY_API_SECRET está igual à API_KEY " +
                "(você colou a chave no lugar do segredo)."
        );
        return;
    }

    try {
        await cloudinary.api.ping();
        console.log("[Cloudinary] Credenciais válidas. Upload de fotos habilitado.");
    } catch (erro: any) {
        const detalhe =
            typeof erro?.message === "string"
                ? erro.message
                : JSON.stringify(erro);
        console.log(
            "[Cloudinary] ATENÇÃO: credenciais inválidas -> " +
                `${detalhe}. O upload de fotos vai falhar.`
        );
    }
}
