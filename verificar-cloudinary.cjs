/**
 * Verificação completa das credenciais do Cloudinary.
 *
 * Testa duas coisas:
 *   1. Credenciais (cloud name + api key + api secret)  -> cloudinary.api.ping()
 *   2. Permissão de upload                              -> upload real de um PNG 1x1
 *
 * Uso:
 *   node verificar-cloudinary.cjs
 *
 * Saída esperada:
 *   OK  -> pode colocar os mesmos valores no Render.
 *   ERRO -> a mensagem diz exatamente o que ajustar.
 */

require("dotenv").config({ path: __dirname + "/.env" });

const { v2: cloudinary } = require("cloudinary");

// Os três valores vêm do .env, limpando espaços/aspas e o "@" acidental
// (o Dashboard às vezes é copiado como "@nome-da-cloud").
function limpar(valor) {
    return String(valor || "")
        .trim()
        .replace(/^["']|["']$/g, "")
        .trim();
}

const cloudName = limpar(process.env.CLOUDINARY_CLOUD_NAME).replace(/^@+/, "");
const apiKey = limpar(process.env.CLOUDINARY_API_KEY);
const apiSecret = limpar(process.env.CLOUDINARY_API_SECRET);

const PNG_1X1 = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==",
    "base64"
);

function mascara(valor) {
    if (!valor) return "(vazio)";
    if (valor.length <= 6) return "*".repeat(valor.length);
    return valor.slice(0, 4) + "*".repeat(valor.length - 8) + valor.slice(-4);
}

function mensagemDoErro(erro) {
    return (
        erro?.error?.message ??
        erro?.message ??
        JSON.stringify(erro)
    );
}

function codigoHttp(erro) {
    return erro?.error?.http_code ?? erro?.http_code;
}

function uploadDeTeste() {
    // Feito direto na API (sem SDK) para conseguir ler a mensagem real do erro.
    return new Promise((resolve) => {
        (async () => {
            const crypto = require("crypto");
            const timestamp = Math.floor(Date.now() / 1000);
            const folder = "testes";

            const assinatura = crypto
                .createHash("sha1")
                .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
                .digest("hex");

            const fd = new FormData();
            fd.append(
                "file",
                new Blob([PNG_1X1], { type: "image/png" }),
                "verificacao.png"
            );
            fd.append("api_key", apiKey);
            fd.append("timestamp", String(timestamp));
            fd.append("folder", folder);
            fd.append("signature", assinatura);

            try {
                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    { method: "POST", body: fd }
                );

                const texto = await res.text();
                let json = null;
                try {
                    json = JSON.parse(texto);
                } catch {
                    /* resposta não JSON */
                }

                if (!res.ok) {
                    resolve({ ok: false, erro: json ?? texto, http: res.status });
                    return;
                }

                resolve({ ok: true, resultado: json });
            } catch (erro) {
                resolve({ ok: false, erro, http: null });
            }
        })();
    });
}

(async () => {
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

    // ---------- 1) credenciais ----------
    console.log("\n[1/2] Testando credenciais (ping)...");

    try {
        const ping = await cloudinary.api.ping();
        console.log("      OK -", JSON.stringify(ping));
    } catch (erro) {
        const mensagem = mensagemDoErro(erro);

        console.log("      ERRO -", mensagem, "| HTTP:", codigoHttp(erro));

        if (mensagem === "cloud_name mismatch") {
            console.log(
                "\nO par API_KEY + API_SECRET é válido, mas pertence a OUTRA conta/cloud.\n" +
                "Ou seja: CLOUD_NAME, API_KEY e API_SECRET não são da mesma conta.\n\n" +
                "Confira se o cloud name está copiado certinho (cuidado com I x l x 1)\n" +
                "e copie os três campos do mesmo Dashboard, usando o ícone de copiar."
            );
        } else if (
            mensagem === "api_secret mismatch" ||
            mensagem === "Invalid Signature"
        ) {
            console.log(
                "\nA API Key existe, mas a API Secret não é a dela.\n" +
                "Copie o segredo (API Secret -> olho -> ícone de copiar) ou gere um novo par."
            );
        } else if (mensagem === "unknown api_key") {
            console.log("\nA API Key não existe no Cloudinary. Copie novamente do Dashboard.");
        }

        return;
    }

    // ---------- 2) permissão de upload ----------
    console.log("\n[2/2] Testando permissão de upload...");

    const teste = await uploadDeTeste();

    if (!teste.ok) {
        const mensagem = mensagemDoErro(teste.erro);
        const http = teste.http ?? codigoHttp(teste.erro);

        console.log("      ERRO -", mensagem, "| HTTP:", http);

        if (String(mensagem).includes("missing permissions")) {
            console.log(
                "\nA API Key é válida, mas NÃO TEM PERMISSÃO DE UPLOAD.\n" +
                "Ela consegue ler, mas não consegue criar/enviar imagens.\n\n" +
                "Como resolver (Console do Cloudinary):\n" +
                "  1. Entre em Settings / Console Settings -> API Keys.\n" +
                "  2. Localize a chave usada aqui e dê a ela o papel 'Master Admin'.\n" +
                "     (ou use a API Key root do ambiente, que já tem acesso total)\n" +
                "  3. Salve e rode este script novamente.\n\n" +
                "Se preferir, gere uma nova API Key escolhendo o papel 'Master Admin'\n" +
                "e copie o par Key + Secret novo para o .env e para o Render."
            );
        }

        return;
    }

    console.log("      OK - upload realizado");
    console.log("      URL:", teste.resultado.secure_url);

    try {
        const limpeza = await cloudinary.uploader.destroy(
            teste.resultado.public_id
        );
        console.log("      arquivo de teste removido:", limpeza.result);
    } catch {
        console.log(
            "      (não foi possível apagar o arquivo de teste, pode ignorar)"
        );
    }

    console.log(
        "\n✅ TUDO OK - credenciais e upload funcionando.\n" +
        "Use estes mesmos 3 valores nas Environment Variables do Render e faça o redeploy."
    );
})();
