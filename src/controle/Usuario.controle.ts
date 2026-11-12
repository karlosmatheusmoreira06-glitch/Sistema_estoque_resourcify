import { plainToInstance } from "class-transformer";
import bcrypt from "bcrypt";
import { Request,Response } from "express";
import { validate} from "class-validator";
import { Usuario } from "../modelo/Usuario";
import { UsuarioCreateDto,UsuarioUpdateDto } from "../dto/Usuario.dto";
import { UsuarioServico } from "../servico/Usuario.servico";
import { UsuarioDao } from "../dao/Usuario.dao";

export class UsuarioControle{
    private usuarioServico: UsuarioServico
    constructor(){
        const usuarioDao = new UsuarioDao()
        this.usuarioServico = new UsuarioServico(usuarioDao)
    }
    public async salvar(req:Request, res:Response){
        try{
            const usuarioDto = plainToInstance(UsuarioCreateDto,req.body)
            const erros = await validate(usuarioDto)
            if(erros.length>0){
                return res.status(400).json(erros)
            }
            const senha = usuarioDto.senhaHash

            const senhaHash = await bcrypt.hash(
                senha,
                10
            )
            const usuario = Usuario.construir(
                usuarioDto.id?? undefined,
                usuarioDto.nome,
                usuarioDto.email,
                senhaHash
            )
            await this.usuarioServico.salvar(usuario)
            return res.status(201).json({
                mesage:"Usuário salvo com sucesso"
            })
            
        }
        catch(error){
            console.error(error);
            const mensagem = error instanceof Error ? error.message : "Erro ao cadastrar Admin";
            return res.status(500).json({
                message: mensagem
            });
        }
    }
    public async buscarporId(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const usuario = await this.usuarioServico.buscarPorId(idNumber)
            return res.status(201).json(usuario)

        }
        catch(error){
            return res.status(500).json({
                mesage:"Erro ao buscar Usuario"
            })
        }
    }
    public async listar(req:Request, res:Response){
        try{
            const usuarios = await this.usuarioServico.listar()
            return res.status(201).json(usuarios)
        }
         catch{
            return res.status(500).json({
                mesage:"Erro ao listar Usuarios"
            })
        }

    }
    public async atualizar(req:Request, res: Response){
        try{
            const usuarioDto = plainToInstance(UsuarioUpdateDto,
                req.body
            )
            const id = req.params.id
            const idNumber = Number(id)
            const erros =  await validate(usuarioDto)
            if(erros.length>0){
                return res.status(400).json(erros)
            }
            const usuario = Usuario.reconstruir({
                id:idNumber,
                nome:usuarioDto.nome,
                email: usuarioDto.email,
                senhaHash: ""
            })
            await this.usuarioServico.atualizar(usuario)
            return res.status(201).json({
                mesage:"Usuário Atualizado com sucesso"
            })
        }
        catch(error){
            return res.status(500).json({
                mesage: "Erro ao atualizar Admin"
            })
        }
    }
    public async deletar(req:Request,res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            await this.usuarioServico.deletar(idNumber)
            return res.status(201).json({
                mesage:"Usuario deletado com sucesso"
            })
        }
         catch(error){
            return res.status(500).json({
                mesage: "Erro ao excluir admin"
            })
        }
    }
   public async login(req: Request, res: Response) {
    try {
        const { email, senhaHash } = req.body;

        const token = await this.usuarioServico.login(email, senhaHash);

        return res.status(200).json({
            token
        });
    }
    catch (error) {
        console.error(error);

        return res.status(401).json({
            message: "E-mail ou senha inválidos"
        });
    }
}
}