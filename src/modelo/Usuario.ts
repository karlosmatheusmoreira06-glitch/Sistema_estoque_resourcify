export type PropsUsuario = {
    id?: number,
    nome:string,
    email:string
    senhaHash:string
}
export class Usuario{
    constructor(private props:PropsUsuario)
    {}
    public static construir(
        id:number|undefined,
        nome: string,
        email:string,
        senhaHash:string
    ){
        if(!nome||!email||!senhaHash){
            throw new Error("Campos Obrigatórios")
        }
        const props:PropsUsuario = {
            id,
            nome,
            email,
            senhaHash
        }
        return new Usuario(props)
    }
    public static reconstruir(props:PropsUsuario){
        return new Usuario(props)
    }
    public get id(){
        return this.props.id
    }
    public get nome(){
        return this.props.nome
    }
    public get email(){
        return this.props.email
    }
    public get senhaHash(){
        return this.props.senhaHash
    }

    public toJSON(){
        return {
            id: this.props.id,
            nome: this.props.nome,
            email: this.props.email
        }
    }
}