import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UsuarioDao } from "../dao/Usuario.dao";
import { Usuario } from "../modelo/Usuario";

export class UsuarioServico{
    constructor(
        private readonly usuario:UsuarioDao
    ){}
    public async salvar(usuario:Usuario){
        return await this.usuario.salvar(usuario)
    }
    public async buscarPorId(id:number){
        return await this.usuario.buscarPorId(id)
    }
    public async listar(){
        return await this.usuario.listar()
    }
    public async atualizar(usuario:Usuario){
        return await this.usuario.atualizar(usuario)
    }
    public async deletar(id:number){
        return await this.usuario.deletar(id)
    }
   public async login(email: string, senha: string) {
    const usuario = await this.usuario.login(email)

    console.log("EMAIL:", email)
    console.log("SENHA RECEBIDA:", senha)
    console.log("HASH DO BANCO:", usuario?.senhaHash)

    if (!usuario || !usuario.senhaHash) {
        throw new Error("Login ou senha inválida")
    }

    const senhaValida = await bcrypt.compare(
        senha,
        usuario.senhaHash
    )

    console.log("SENHA VÁLIDA:", senhaValida)

    if (!senhaValida) {
        throw new Error("senha inválida")
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            nome: usuario.nome
        },
        "SEGREDO_DO_TOKEN",
        {
            expiresIn: "1d"
        }
    )

    return token
}
}