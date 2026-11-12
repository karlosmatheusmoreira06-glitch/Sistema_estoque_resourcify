import { Movimentacoes } from "../modelo/Movimentacoes";
import { conexao } from "../util/conexao";

export class MovimentacoesDao {

    public async salvar(movimentacoes: Movimentacoes): Promise<void>{
        try{
            await conexao.query(
                'insert into movimentacoes (item_id, usuario_id, tipo, quantidade, preco_unitario, observacao) values(?,?,?,?,?,?)',
                [
                    movimentacoes.item_id,
                    movimentacoes.usuario_id,
                    movimentacoes.tipo,
                    movimentacoes.quantidade,
                    movimentacoes.preco_unitario ?? 0,
                    movimentacoes.observacao
                ]
            )
        }
        catch(error){
            console.log("Erro", error)
            throw new Error("Erro ao salvar Movimentação")
        }
    }

    public async buscarporId(id:number): Promise<Movimentacoes|null>{
        try{
            const [rows]: any = await conexao.query(
                'select * from movimentacoes where id =?',
                [id]
            )

            if(rows.length === 0){
                return null
            }

            const movimentacao = Movimentacoes.reconstruir(rows[0])

            return movimentacao
        }
        catch(error){
            console.log("Erro",error)
            throw new Error("Erro ao buscar Movimentação")
        }
    }

    public async listar(): Promise<Movimentacoes[]>{
        try{
            const [results]: any = await conexao.query(
                'select * from movimentacoes'
            )

            return results.map((r:any) => Movimentacoes.reconstruir(
                {
                    id: r.id,
                    item_id: r.item_id,
                    usuario_id: r.usuario_id,
                    quantidade: r.quantidade,
                    tipo: r.tipo,
                    preco_unitario: r.preco_unitario,
                    observacao: r.observacao,
                    data_movimentacao: r.data_movimentacao
                }
            ))
        }
        catch(error){
            console.log("Erro",error)
            throw new Error("Erro ao listar movimentações")
        }
    }

    public async atualizar(movimentacao:Movimentacoes): Promise<void>{
        try {

            const [result]:any = await conexao.query(
                'update movimentacoes set item_id = ?, quantidade = ?, tipo = ?, preco_unitario = ?, observacao = ? where id =?',
                [
                    movimentacao.item_id,
                    movimentacao.quantidade,
                    movimentacao.tipo,
                    movimentacao.preco_unitario ?? 0,
                    movimentacao.observacao,
                    movimentacao.id
                ]
            )

            if(result.affectedRows === 0){
                // affectedRows = 0 também ocorre quando nada mudou
                // (ex.: editar só a observação), então confirma a existência.
                const [existe]: any = await conexao.query(
                    'select id from movimentacoes where id = ?',
                    [movimentacao.id]
                )
                if(existe.length === 0){
                    throw new Error("Movimentação não encontrada")
                }
            }

        }
        catch(error){
            console.log("Erro",error)
            throw new Error("Erro ao atualizar movimentação")
        }
    }

    /**
     * Preço definido pela ENTRADA mais recente do item (0 se não houver entrada).
     */
    public async buscarUltimoPrecoEntrada(itemId:number): Promise<number>{
        try{
            const [rows]: any = await conexao.query(
                `select preco_unitario from movimentacoes
                 where item_id = ? and tipo = 'ENTRADA'
                 order by data_movimentacao desc, id desc
                 limit 1`,
                [itemId]
            )

            if(rows.length === 0){
                return 0
            }

            return Number(rows[0].preco_unitario) || 0
        }
        catch(error){
            console.log("Erro",error)
            throw new Error("Erro ao buscar preço da movimentação")
        }
    }

    public async deletar(id:number): Promise<void> {
        try{

            const [result]: any = await conexao.query(
                'delete from movimentacoes where id =?',
                [id]
            )

            if(result.affectedRows === 0){
                throw new Error("Não foi possivel excluir a Movimentação")
            }

        }
        catch(error){
            console.log("Erro",error)
            throw new Error("Erro ao excluir movimentação")
        }
    }
}