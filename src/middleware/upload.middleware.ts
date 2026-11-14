import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configuração do Cloudinary usando variáveis de ambiente
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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
