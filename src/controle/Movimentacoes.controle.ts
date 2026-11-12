import { Request, Response } from "express";
import { Movimentacoes } from "../modelo/Movimentacoes";
import { MovimentacoesDao } from "../dao/Movimetacoes.dao";
import { validate } from "class-validator";
import { MovimentacoesServico } from "../servico/Movimentacoes.servico";
import { MovimentacoesCreateDto,MovimentacoesUpdateDto } from "../dto/Movimentacoes.dto";
import { plainToInstance } from "class-transformer";
import { ItensDao } from "../dao/Itens.dao";
import { ErroRegra } from "../util/ErroRegra";

export class MovimentacoesControle{
    private movimentacoesServico: MovimentacoesServico
    
    constructor(){
        const movimentacaoDao = new MovimentacoesDao()
        const itensDao = new ItensDao()
        
        this.movimentacoesServico = new MovimentacoesServico(movimentacaoDao,itensDao)
        
    }
    public async salvar(req:Request, res: Response){
        try{
          const movimentacaoDto = plainToInstance(MovimentacoesCreateDto,req.body)
          const erros = await validate(movimentacaoDto)

          if( erros.length>0){
            return res.status(400).json(
                erros
            )
          }

          const movimentacao = Movimentacoes.construir(
            movimentacaoDto.id?? undefined,
            movimentacaoDto.item_id,
            movimentacaoDto.usuario_id?? undefined,
            movimentacaoDto.quantidade,
            movimentacaoDto.tipo,
            movimentacaoDto.observacao,
            movimentacaoDto.preco_unitario
          )
          await this.movimentacoesServico.salvar(movimentacao)
          return res.status(201).json({
            mesage:"Movimentaçao salva com sucesso"
          })
        

        }
        catch(error){
            if(error instanceof ErroRegra){
                return res.status(400).json({
                    mensagem: error.message
                })
            }
            console.log("Erro: ", error)
            return res.status(500).json({
                mesage:"Erro ao salvar Movimentação"
            })
        }
    
    }
    public async buscarPorid(req:Request, res:Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)

            const movimentacao = await this.movimentacoesServico.buscarporId(idNumber)
            return res.status(201).json(movimentacao)
        }
         catch(error){
            console.log("Erro: ", error)
            return res.status(500).json({
                mesage:"Erro ao buscar Movimentação"
            })
        }

    }
    public async listar(req:Request, res:Response){
    try{

        const movimentacoes = await this.movimentacoesServico.listar()

        console.log("MOVIMENTAÇÕES:", movimentacoes)
        console.log("JSON:", JSON.stringify(movimentacoes))

        return res.status(200).json(movimentacoes)

    }
    catch(error){
        console.log("Erro:", error)

        return res.status(500).json({
            mensagem: "Erro ao listar movimentações"
        })
    }
}
    public async atualizar(req:Request, res:Response){
    try{
        const id = req.params.id
        const idNumber = Number(id)

        console.log("ID DA URL:", id)
        console.log("ID CONVERTIDO:", idNumber)
        console.log("BODY:", req.body)

        const movimentacaoDto = plainToInstance(
            MovimentacoesUpdateDto,
            req.body
        )

        const erros = await validate(movimentacaoDto)

        if(erros.length > 0){
            return res.status(400).json(erros)
        }

        const movimentacao = Movimentacoes.reconstruir({
            id: idNumber,
            item_id: movimentacaoDto.item_id,
            usuario_id: undefined,
            quantidade: movimentacaoDto.quantidade,
            tipo: movimentacaoDto.tipo,
            preco_unitario: movimentacaoDto.preco_unitario,
            observacao: movimentacaoDto.observacao
        })

        console.log("MOVIMENTAÇÃO MONTADA:", movimentacao.toJSON())

        await this.movimentacoesServico.atualizar(movimentacao)

        return res.status(200).json({
            mesage:"Movimentacao Atualizada com Sucesso"
        })

    } catch(error){
        if(error instanceof ErroRegra){
            return res.status(400).json({
                mensagem: error.message
            })
        }
        console.log("Erro: ", error)

        return res.status(500).json({
            mesage:"Erro ao Atualizar Movimentação"
        })
    }
}
    public async excluir(req: Request, res: Response){
        try{
            const id = req.params.id
            const idNumber = Number(id)
            await this.movimentacoesServico.deletar(idNumber)
            return res.status(201).json({
                mesage:"Movimentacao Excluida com Sucesso"
            })
        }
        catch(error){
            if(error instanceof ErroRegra){
                return res.status(400).json({
                    mensagem: error.message
                })
            }
            console.log("Erro: ", error)
            return res.status(500).json({
                mesage:"Erro ao deletar Movimentações"
            })
        }
    }
    
}