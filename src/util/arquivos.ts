import fs from "fs";
import path from "path";

import { PASTA_FOTOS_ITENS } from "../middleware/upload.middleware";

/**
 * Converte a URL pública salva no banco (/uploads/itens/arquivo.jpg)
 * no caminho físico do arquivo no disco.
 */
export function caminhoFisicoDaFoto(url?: string | null): string | null {
    if (!url) {
        return null;
    }

    // Nunca apaga arquivos de links externos.
    if (/^https?:\/\//i.test(url)) {
        return null;
    }

    const nome = path.basename(url);

    if (!nome) {
        return null;
    }

    return path.join(PASTA_FOTOS_ITENS, nome);
}

/** Remove a foto do disco sem derrubar a requisição se o arquivo não existir. */
export function removerFotoDoDisco(url?: string | null): void {
    const caminho = caminhoFisicoDaFoto(url);

    if (!caminho) {
        return;
    }

    fs.promises.unlink(caminho).catch(() => {
        // Arquivo já removido ou inexistente: não é um erro de negócio.
    });
}
