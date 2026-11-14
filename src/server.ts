import "reflect-metadata";
import "dotenv/config";
import express, { ErrorRequestHandler } from "express";
import routes from "./routes";
import cors from "cors";
import multer from "multer";

import { verificarCredenciaisCloudinary } from "./middleware/upload.middleware";


const app = express()
app.use(cors());

app.use(express.json())

app.use((req, res, next) => {
    console.log("========== REQUISIÇÃO ==========");
    console.log("Método:", req.method);
    console.log("URL:", req.url);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Body:", req.body);
    console.log("================================");

    next();
});

app.use(routes)

// Erros de upload (arquivo grande, formato inválido etc.) viram 400.
const tratadorDeErros: ErrorRequestHandler = (err, _req, res, _next) => {
    // O Cloudinary devolve um objeto simples ({ message, http_code, ... }),
    // não uma instância de Error. Por isso lemos "message" de forma genérica,
    // senão o erro real é escondido atrás de um 500 genérico.
    const mensagem =
        err && typeof err === "object" && typeof err.message === "string"
            ? err.message
            : null;

    if (err instanceof multer.MulterError) {
        const texto =
            err.code === "LIMIT_FILE_SIZE"
                ? "A imagem deve ter no máximo 5 MB."
                : `Erro no upload: ${err.message}`;

        console.log("Erro de upload:", err);
        return res.status(400).json({ mensagem: texto });
    }

    console.log("Erro inesperado:", err);

    if (mensagem) {
        return res.status(400).json({ mensagem });
    }

    return res.status(500).json({ mensagem: "Erro interno do servidor" });
};

app.use(tratadorDeErros);

app.listen(3000, ()=>{
    console.log("Servidor iniciado na porta 3000")
    void verificarCredenciaisCloudinary()
})
