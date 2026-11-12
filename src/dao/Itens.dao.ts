import { Itens } from "../modelo/Itens";
import { conexao } from "../util/conexao";

export class ItensDao{
    public async salvar(itens:Itens):Promise<void>{
        try{
              const [rows]: any = await conexao.query(
            'insert into itens (nome,quantidade,unidade_medida,descricao,link_referencia,imagem,estoque_minimo,preco_unitario) values(?,?,?,?,?,?,?,?)',
            [itens.nome,itens.quantidade,itens.unidade_medida,itens.descricao,itens.link_referencia,itens.imagem ?? null,itens.estoque_minimo ?? 0,itens.preco_unitario]
        )

        }
        catch(error){
            console.log("Erro",error)
            throw new Error("Erro ao salvar item")
        }
      
    }
    public async buscarPorId(id:number):Promise<Itens|null>{
        try{
            const [rows]: any = await conexao.query(
                'select * from itens where id =? ',
                [id]
            )
            if(rows.length===0){
                return null
            }
            const item = Itens.reconstruir(rows[0])
            return item
        }
        catch(error){
             console.log("Erro",error)
            throw new Error("Erro ao buscar item")
        }
    }
    public async listar():Promise<Itens[]>{
        try{
            const [rows]: any = await conexao.query(
            'select * from itens'
        )
        return rows.map((r:any) => Itens.reconstruir({
            id:r.id,
            nome:r.nome,
            quantidade:r.quantidade,
            unidade_medida: r.unidade_medida,
            descricao: r.descricao,
            link_referencia:r.link_referencia,
            imagem:r.imagem,
            estoque_minimo:r.estoque_minimo,
            preco_unitario:r.preco_unitario,
            data_criacao: r.data_criacao,

        }
        ))
          }
        catch(error){
            console.log("Erro",error)
            throw new Error("Erro ao listar Itens")
        }

        }
    public async atualizar(itens:Itens): Promise <void>{
        try{
            const [results]: any = await conexao.query(
                'update itens set nome =?, unidade_medida = ?, descricao = ?, link_referencia =?, imagem =?, estoque_minimo =? where id = ?',
                [itens.nome, itens.unidade_medida,itens.descricao,itens.link_referencia,itens.imagem ?? null,itens.estoque_minimo ?? 0,itens.id]
            )
            if(results.affectedRows===0){
                // affectedRows também é 0 quando o UPDATE não muda nenhum valor,
                // então confirma se o item existe antes de tratar como erro.
                const [existe]: any = await conexao.query(
                    'select id from itens where id = ?',
                    [itens.id]
                )
                if(existe.length===0){
                    throw new Error("Item não encontrado")
                }
            }
            
        }
        catch(error){
            console.log("Erro: ", error)
            throw new Error("Erro ao atualizar item")
        }
    }
    public async deletar(id:number): Promise<void>{
        try{
            const [result]:any = await conexao.query(
                'delete from itens where id = ?',
                [id]
            )
            if(result.affectedRows===0){
                throw new Error("Erro ao excluir item")
            }
        }
        catch(error){
             console.log("Erro: ", error)
            throw new Error("Erro ao excluir item")
        }
    }

    public async atualizarPrecoUnitario(id:number, precoUnitario:number): Promise<void>{
        try{
            await conexao.query(
                'update itens set preco_unitario = ? where id = ?',
                [precoUnitario, id]
            )
        }
        catch(error){
            console.log("Erro: ", error)
            throw new Error("Erro ao atualizar preço unitário")
        }
    }

    public async atualizarQuantidade(id:number, quantidade:number): Promise<void>{
    try{

        console.log("ATUALIZANDO ESTOQUE")
        console.log("ID:", id)
        console.log("QUANTIDADE:", quantidade)

        const [result]: any = await conexao.query(
            'update itens set quantidade = ? where id = ?',
            [quantidade, id]
        )

        console.log("RESULTADO UPDATE:", result)

        // affectedRows = 0 também acontece quando a quantidade não muda
        // (ex.: editar só a observação de uma movimentação), então não é erro.

    }
    catch(error){
        console.log("Erro: ", error)
        throw new Error("Erro ao atualizar quantidade")
    }
}
        
        
}