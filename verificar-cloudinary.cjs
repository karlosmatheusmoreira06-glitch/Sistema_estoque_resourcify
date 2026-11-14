/**
 * Script de verificação das credenciais do Cloudinary.
 *
 * Uso:
 *   1. Preencha o arquivo .env com CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY
 *      e CLOUDINARY_API_SECRET, copiando os três do MESMO Dashboard
 *      (use o ícone de copiar de cada campo, não digite à mão).
 *   2. Rode: node verificar-cloudinary.cjs
 *
 * Saída esperada:
 *   OK  -> credenciais válidas, pode colocar os mesmos valores no Render.
 *   ERRO -> a mensagem diz exatamente qual campo está inconsistente.
 */

require("dotenv").config({ path: __dirname + "/.env" });

const { v2: cloudinary } = require("cloudinary");

const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();

function mascara(valor) {
    if (!valor) return "(vazio)";
    if (valor.length <= 6) return "*".repeat(valor.length);
    return valor.slice(0, 4) + "*".repeat(valor.length - 8) + valor.slice(-4);
}

console.log("Conferindo credenciais do Cloudinary...\n");
console.log("CLOUD_NAME :", cloudName || "(vazio)");
console.log("API_KEY    :", apiKey || "(vazio)", `(${apiKey.length} caracteres)`);
console.log("API_SECRET :", mascara(apiSecret), `(${apiSecret.length} caracteres)`);

const problemas = [];

if (!cloudName) problemas.push("CLOUDINARY_CLOUD_NAME vazia.");
if (!apiKey) problemas.push("CLOUDINARY_API_KEY vazia.");
if (!apiSecret) problemas.push("CLOUDINARY_API_SECRET vazia.");

if (apiSecret && apiSecret === apiKey) {
    problemas.push(
        "A API_SECRET está igual à API_KEY. Você colou a chave no lugar do segredo."
    );
}

if (apiKey && !/^\d+$/.test(apiKey)) {
    problemas.push(
        "A API_KEY normalmente é só de números. Confira se não colou o segredo no lugar dela."
    );
}

if (problemas.length > 0) {
    console.log("\nProblemas encontrados antes de testar:");
    problemas.forEach((p) => console.log(" - " + p));
    console.log("");
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
});

cloudinary.api
    .ping()
    .then((resultado) => {
        console.log("\n✅ OK - credenciais válidas!");
        console.log("Resposta do Cloudinary:", JSON.stringify(resultado));
        console.log(
            "\nAgora use exatamente estes 3 valores nas Environment Variables do Render."
        );
    })
    .catch((erro) => {
        // O SDK devolve { error: { message, http_code } } em vez de um Error.
        const mensagem =
            erro?.error?.message ?? erro?.message ?? JSON.stringify(erro);
        const httpCode = erro?.error?.http_code ?? erro?.http_code;

        console.log("\n❌ ERRO - credenciais inválidas.");
        console.log("Mensagem:", mensagem);
        console.log("HTTP:", httpCode);

        if (mensagem === "cloud_name mismatch") {
            console.log(
                "\nO par API_KEY + API_SECRET é válido, mas pertence a OUTRA conta/cloud " +
                "do Cloudinary — não à cloud informada acima.\n" +
                "Ou seja: o CLOUD_NAME, a API_KEY e a API_SECRET não são da mesma conta.\n\n" +
                "Como resolver:\n" +
                "  1. Abra o Dashboard do Cloudinary.\n" +
                "  2. No cartão de credenciais, use o ícone de COPIAR de cada campo:\n" +
                "     Cloud name, API Key e API Secret.\n" +
                "  3. Cole os três no .env e rode este script de novo.\n" +
                "  4. Confira se você não está logado em outra conta do Cloudinary."
            );
        }

        if (mensagem === "api_secret mismatch" || mensagem === "Invalid Signature") {
            console.log(
                "\nA API Key existe, mas a API Secret não é a dela.\n" +
                "Copie o segredo no Cloudinary (API Secret -> ícone do olho -> ícone de copiar) " +
                "ou gere um novo par de chaves."
            );
        }

        if (mensagem === "unknown api_key") {
            console.log(
                "\nA API Key não existe no Cloudinary. Copie novamente do Dashboard."
            );
        }
    });
