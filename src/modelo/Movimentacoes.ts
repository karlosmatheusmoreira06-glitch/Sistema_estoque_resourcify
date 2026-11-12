export type Tipo = "ENTRADA" | "SAIDA"
export type PropsMovimentacao = {
    id?:number,
    item_id: number,
    usuario_id?: number,
    quantidade: number,
    tipo: Tipo,
    preco_unitario?: number,
    observacao: string,
    data_movimentacao?:string


}



export class Movimentacoes{
    private constructor(
        private props: PropsMovimentacao)
    {}
    public static construir(
        id:number|undefined,
        item_id: number,
        usuario_id: number|undefined,
        quantidade: number,
        tipo: Tipo,
        observacao:string,
        preco_unitario?: number
    ){
        if(!item_id || !tipo || !quantidade || quantidade<=0 || !observacao ){
            throw new Error("Campos Obrigatórios")
        }
        const props: PropsMovimentacao = {
            id,
            item_id,
            usuario_id,
            quantidade,
            tipo,
            // O preço só faz sentido em entradas; saídas gravam 0.
            preco_unitario: tipo === "ENTRADA" ? Number(preco_unitario ?? 0) : 0,
            observacao
        }
        return new Movimentacoes(props)

    }
    public static reconstruir(props:PropsMovimentacao){
        return new Movimentacoes(props)
    }

    public get id(){
        return this.props.id
    }

    public get item_id(){
        return this.props.item_id
    }

    public get usuario_id(){
        return this.props.usuario_id
    }
    public get tipo(){
        return this.props.tipo
    }
    public get quantidade(){
        return this.props.quantidade
    }
    public get preco_unitario(){
        return this.props.preco_unitario
    }
    public get observacao(){
        return this.props.observacao

    }
        public get data_movimentacao(){
        return this.props.data_movimentacao
    }

    public toJSON(){
        return{
            id:this.props.id,
            item_id: this.props.item_id,
            usuario_id: this.props.usuario_id,
            tipo: this.props.tipo,
            quantidade: this.props.quantidade,
            preco_unitario: this.props.preco_unitario,
            observacao: this.props.observacao,
            data_movimentacao: this.props.data_movimentacao


        }
    }
}