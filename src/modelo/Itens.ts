export type propsItem = {
    id?: number,
    nome:string,
    quantidade: number,
    unidade_medida: string,
    descricao: string,
    link_referencia?: string,
    imagem?: string | null,
    estoque_minimo?: number,
    preco_unitario: number,
    data_criacao?: string
    

}

export class Itens{
    constructor(
        private props:propsItem
    )
    {
        
    }
    public static construir(
        id:number|undefined,
        nome:string,
        unidade_medida:string,
        descricao: string,
        link_referencia: string|undefined,
        imagem?: string|null,
        estoque_minimo?: number,
       
    ){        if(!nome || !unidade_medida || !descricao){
            throw new Error("Campos Obrigatórios")
        }
        const props:propsItem = {
            id,
            nome,
            // A quantidade inicial é sempre 0: ela só muda por movimentações.
            quantidade: 0,
            unidade_medida,
            descricao,
            link_referencia,
            // Foto de capa enviada pelo formulário (opcional).
            imagem: imagem ?? null,
            // Estoque mínimo definido no cadastro (referência para alerta).
            estoque_minimo: Number(estoque_minimo) || 0,
            // O preço também vem das movimentações (última ENTRADA).
            preco_unitario: 0,
           

        }

        return new Itens(props)

    }
    public static reconstruir(props:propsItem){
        return new Itens(props)
    }

    public get id(){
        return this.props.id
    }
    public get nome(){
        return this.props.nome
    }
    public get quantidade(){
        return this.props.quantidade
    }
    public get unidade_medida(){
        return this.props.unidade_medida
    }
    public get descricao(){
        return this.props.descricao
    }
    public get link_referencia(){
        return this.props.link_referencia
    }
    public get imagem(){
        return this.props.imagem
    }
    public get estoque_minimo(){
        return this.props.estoque_minimo
    }
    public get preco_unitario(){
        return this.props.preco_unitario

    }
 

   public toJSON() {
        return {
            id: this.props.id,
            nome: this.props.nome,
            quantidade: this.props.quantidade,
            unidade_medida: this.props.unidade_medida,
            descricao: this.props.descricao,
            link_referencia: this.props.link_referencia,
            imagem: this.props.imagem,
            estoque_minimo: this.props.estoque_minimo,
            preco_unitario: this.props.preco_unitario,
            data_criacao: this.props.data_criacao
        }
    }
  
}