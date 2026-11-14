/**
 * Converte a URL pública salva no banco no caminho físico do arquivo no disco.
 * Como agora usamos Cloudinary, não há arquivo local para converter.
 * Retorna null sempre (links externos não precisam de caminho físico).
 */
export function caminhoFisicoDaFoto(url?: string | null): string | null {
    return null;
}

/** Remove a foto do disco (não faz mais nada, pois as fotos estão no Cloudinary). */
export function removerFotoDoDisco(url?: string | null): void {
    // Não há mais arquivo local para remover.
    return;
}
