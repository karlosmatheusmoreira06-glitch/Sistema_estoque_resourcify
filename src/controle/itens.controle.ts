import { Request, Response } from "express";
import { Itens } from "../modelo/Itens";
import { ItensDao } from "../dao/Itens.dao";
import { ItensCreateDto,ItensUpdateDto } from "../dto/Itens.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ItensServico } from "../servico/Itens.servico";
import { removerFotoDoDisco } from "../util/arquivos";


export class ItensControle{
    private itensServico: ItensServico
    constructor(){
        const itensDao = new ItensDao()
        this.itensServico = new ItensServico(itensDao)
    }

    /** Monta a URL pública da foto a partir do arquivo recebido pelo multer (Cloudinary). */
    private urlDaFoto(req: Request): string | undefined {
        if (!req.file) {
            return undefined
        }

        // O multer-storage-cloudinary preenche "path" com a secure_url.
        const arquivo = req.file as Express.Multer.File & {
            secure_url?: string
            path?: string
            url?: string
        }

        return arquivo.secure_url ?? arquivo.path ?? arquivo.url ?? undefined
    }

    /** Apaga do disco o arquivo recém-enviado quando a requisição falha. */
    private descartarUpload(req: Request){
        if (req.file) {
            removerFotoDoDisco(`/uploads/itens/${req.file.filename}`)
        }
    }

    public async salvar(req:Request,res:Response){
        try{
            const itensDto = plainToInstance(ItensCreateDto,req.body)
            const erros = await validate(itensDto)
            if(erros.length>0){
                this.descartarUpload(req)
                return res.status(400).json(erros)
            }

            const itens = Itens.construir(
                itensDto.id ?? undefined,
                itensDto.nome,
                itensDto.unidade_medida,
                itensDto.descricao,
                itensDto.link_referencia,
                this.urlDaFoto(req),
                itensDto.estoque_minimo,
            )
            await this.itensServico.salvar(itens)
            return res.status(201).json({
                mesage:"Item salvo com sucesso"
            })
        }
        catch(error){
            console.log("Erro: ", error)
            this.descartarUpload(req)
            return res.status(500).json({
                mesage:"Erro ao salvar Item"
            })
        }

    }
    public async buscarporId(req:Request, res:Response){
        try{
            const id= req.params.id
            const idNumber = Number(id)
            const item = await this.itensServico.buscarPorId(idNumber)
            return res.status(201).json(item)
        }
        catch(error){
            console.log("Erro: ", error)
            return res.status(500).json({
                mesage:"Erro ao buscar Item"
            })
        }
    }
    public async listar(req:Request, res:Response){
        try{
            const itens = await this.itensServico.listar()
            return res.status(201).json(itens)
        }
        catch(error){
            console.log("Erro: ", error)
            return res.status(500).json({
                mesage:"Erro ao lisat Itens"
            })
        }
    }
    public async atualizar(req:Request, res:Response){
        try{
            const itensDto = plainToInstance(ItensUpdateDto, req.body)
            const id = req.params.id
            const idNumber = Number(id)
            const erros = await validate(itensDto)

            if(erros.length>0){
                this.descartarUpload(req)
                return res.status(400).json(erros)
            }

            const itemAtual = await this.itensServico.buscarPorId(idNumber)

            if(!itemAtual){
                this.descartarUpload(req)
                return res.status(404).json({
                    mensagem:"Item não encontrado"
                })
            }

            const imagemAntiga = itemAtual.imagem
            const removerImagem = String(req.body.remover_imagem) === "true"

            // Nova foto substitui a antiga; "remover_imagem" limpa;
            // sem nenhum dos dois, a foto atual é mantida.
            let imagem: string | null = imagemAntiga ?? null

            if(req.file){
                imagem = this.urlDaFoto(req) ?? null
            }
            else if(removerImagem){
                imagem = null
            }

            const item = Itens.reconstruir({
                id:idNumber,
                nome: itensDto.nome,
                // Ignorado pelo DAO: a quantidade só muda via movimentação.
                quantidade: 0,
                unidade_medida:itensDto.unidade_medida,
                descricao:itensDto.descricao,
                link_referencia:itensDto.link_referencia,
                imagem,
                // Estoque mínimo definido no cadastro.
                estoque_minimo: itensDto.estoque_minimo,
                // Ignorado pelo DAO: o preço vem das movimentações.
                preco_unitario: 0,
                data_criacao:""


            })
            await this.itensServico.atualizar(item)

            if(imagem !== imagemAntiga){
                removerFotoDoDisco(imagemAntiga)
            }

            return res.status(201).json(
                {
                    mesage:"Item atualizado com sucesso"
                }
            )
        }
        catch(error){
            console.log("Erro: ", error)
            this.descartarUpload(req)
            return res.status(500).json({
                mesage:"Erro ao atualizar Itens"
            })
        }

    }
    public async deletar(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            const item = await this.itensServico.buscarPorId(idNumber)

            await this.itensServico.deletar(idNumber)

            if(item?.imagem){
                removerFotoDoDisco(item.imagem)
            }

            return res.status(201).json({
                mesage:"Item excluido com sucesso"
            })

        }
        catch(error){
            console.log("Erro: ", error)
            return res.status(500).json({
                mesage:"Erro ao excluir item"
            })
        }
    }
}
