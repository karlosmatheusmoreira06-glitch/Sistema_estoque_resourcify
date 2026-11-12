/**
 * Erro de regra de negócio: deve virar resposta 400 para o cliente,
 * e não um 500 genérico.
 */
export class ErroRegra extends Error {
    constructor(mensagem: string) {
        super(mensagem)
        this.name = "ErroRegra"
    }
}
