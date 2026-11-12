import { Movimentacoes, Tipo } from "../modelo/Movimentacoes";
import { MovimentacoesDao } from "../dao/Movimetacoes.dao";
import { ItensDao } from "../dao/Itens.dao";
import { ErroRegra } from "../util/ErroRegra";


export class MovimentacoesServico{
    constructor(private readonly movimentacoesDao: MovimentacoesDao,
        private readonly itensDao: ItensDao
    ){

    }

   public async salvar(movimentacao:Movimentacoes){

    const item = await this.itensDao.buscarPorId(movimentacao.item_id)

    if(!item){
        throw new ErroRegra("Item não encontrado")
    }

    console.log("ITEM ANTES:", item.quantidade)
    console.log("MOVIMENTAÇÃO:", movimentacao.toJSON())

    let novaQuantidade = Number(item.quantidade)

    if(movimentacao.tipo === "ENTRADA"){
        novaQuantidade += Number(movimentacao.quantidade)
    }

    if(movimentacao.tipo === "SAIDA"){
        if(Number(movimentacao.quantidade) > Number(item.quantidade)){
            throw new ErroRegra("Estoque insuficiente")
        }

        novaQuantidade -= Number(movimentacao.quantidade)
    }

    console.log("NOVA QUANTIDADE:", novaQuantidade)

    await this.itensDao.atualizarQuantidade(
        movimentacao.item_id,
        novaQuantidade
    )

    console.log("QUANTIDADE ATUALIZADA")

    const resultado = await this.movimentacoesDao.salvar(movimentacao)

    // A última ENTRADA define o preço unitário do item.
    if(movimentacao.tipo === "ENTRADA"){
        await this.itensDao.atualizarPrecoUnitario(
            movimentacao.item_id,
            Number(movimentacao.preco_unitario) || 0
        )
    }

    return resultado
}
    public async buscarporId(id:number){
        return await this.movimentacoesDao.buscarporId(id)
    }
    public async listar(){
        return await this.movimentacoesDao.listar()
    }
    public async atualizar(movimentacao:Movimentacoes){
        const movimentacaoAntiga = await this.movimentacoesDao.buscarporId(movimentacao.id!)

          console.log("ID DA MOVIMENTAÇÃO PARA ATUALIZAR:", movimentacao.id)
        if(!movimentacaoAntiga){
            throw new ErroRegra("Movimentação não encontrada")
        }

        // Trocar o item exigiria ajustar o estoque dos dois itens.
        // Como o front não permite, a API também bloqueia para não corromper o estoque.
        if(Number(movimentacao.item_id) !== Number(movimentacaoAntiga.item_id)){
            throw new ErroRegra(
                "Não é possível trocar o item de uma movimentação já registrada"
            )
        }

        const item = await this.itensDao.buscarPorId(movimentacaoAntiga.item_id)
        if(!item){
            throw new ErroRegra("Item não encontrado")
        }
        let quantidade = Number(item.quantidade)
        if(movimentacaoAntiga.tipo ==="ENTRADA"){
              quantidade -= Number(movimentacaoAntiga.quantidade)
        }

         if(movimentacaoAntiga.tipo === "SAIDA"){
            quantidade += Number(movimentacaoAntiga.quantidade)
        }

        if(movimentacao.tipo === "ENTRADA"){
            quantidade += Number(movimentacao.quantidade)
        }

        if(movimentacao.tipo === "SAIDA"){

            if(Number(movimentacao.quantidade) > quantidade){
                throw new ErroRegra("Estoque insuficiente")
            }

            quantidade -= Number(movimentacao.quantidade)
        }

        await this.itensDao.atualizarQuantidade(movimentacaoAntiga.item_id,quantidade)

        const resultado = await this.movimentacoesDao.atualizar(movimentacao)

        // Se a edição envolve ENTRADA, o preço volta a ser o da entrada mais recente.
        if(movimentacaoAntiga.tipo === "ENTRADA" || movimentacao.tipo === "ENTRADA"){
            const preco = await this.movimentacoesDao.buscarUltimoPrecoEntrada(
                movimentacaoAntiga.item_id
            )
            await this.itensDao.atualizarPrecoUnitario(
                movimentacaoAntiga.item_id,
                preco
            )
        }

        return resultado
    }
    public async deletar(id:number){
        const movimentacao = await this.movimentacoesDao.buscarporId(id)
        if(!movimentacao){
            throw new ErroRegra("Movimentação não encontrada")
        }
        console.log("ID DA MOVIMENTAÇÃO PARA EXCLUIR:", movimentacao.id)
        const item = await this.itensDao.buscarPorId(movimentacao.item_id)
        if(!item){
            throw new ErroRegra("Item não encontrado")
        }
        let quantidade = Number(item.quantidade)
        if(movimentacao.tipo === "ENTRADA"){
            if(Number(movimentacao.quantidade) > quantidade){
                throw new ErroRegra(
                    "Não é possível excluir: o estoque do item ficaria negativo"
                )
            }
            quantidade-=Number(movimentacao.quantidade)
        }
        if(movimentacao.tipo === "SAIDA"){
            quantidade+= Number(movimentacao.quantidade)
        }

        await this.itensDao.atualizarQuantidade(movimentacao.item_id,quantidade)
        const resultado = await this.movimentacoesDao.deletar(id)

        // Excluir uma ENTRADA exige recalcular o preço pela entrada anterior.
        if(movimentacao.tipo === "ENTRADA"){
            const preco = await this.movimentacoesDao.buscarUltimoPrecoEntrada(
                movimentacao.item_id
            )
            await this.itensDao.atualizarPrecoUnitario(
                movimentacao.item_id,
                preco
            )
        }

        return resultado
    }

    
}