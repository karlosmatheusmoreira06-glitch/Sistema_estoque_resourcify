import "reflect-metadata";
import "dotenv/config";
import express, { ErrorRequestHandler } from "express";
import routes from "./routes";
import cors from "cors";
import multer from "multer";


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
    if (err instanceof multer.MulterError) {
        const mensagem =
            err.code === "LIMIT_FILE_SIZE"
                ? "A imagem deve ter no máximo 5 MB."
                : `Erro no upload: ${err.message}`;

        return res.status(400).json({ mensagem });
    }

    if (err instanceof Error && err.message) {
        return res.status(400).json({ mensagem: err.message });
    }

    console.log("Erro inesperado:", err);
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
};

app.use(tratadorDeErros);

app.listen(3000, ()=>{
    console.log("Servidor iniciado na porta 3000")
})
