import { Itens } from "../modelo/Itens";
import { ItensDao } from "../dao/Itens.dao";

export class ItensServico{

    constructor(
        private readonly itensDao: ItensDao
    )
    {}
    public async salvar(itens:Itens){
        return await this.itensDao.salvar(itens)
    }
    public async buscarPorId(id:number){
        return await this.itensDao.buscarPorId(id)
    }
    public async listar(){
        const  itens = await this.itensDao.listar()
        const itensStatus = itens.map((item) => {
            const dados = item.toJSON()
            const quantidade = Number(dados.quantidade ||0)
            const estoque_minimo = Number(dados.estoque_minimo||0)

            let percentual = 0
            let status = "cheio"

            if(estoque_minimo>0){
                try{
                    percentual = (quantidade/estoque_minimo)*100

                }
                catch(error){
                    alert("Erro: Não é possivel dividir por 0")
                    
                }
                

                if(percentual<40){
                    status = "repor_urgente"
                }
                else if(percentual>=40 && percentual<60){
                    status = "atencao"
                }
                else{
                    status = "cheio"
                }
            }
            else{
                status = "sem_minimo"
            }
            return{
                ...dados,
                status_estoque: status,
                percentual_estoque: Number(percentual.toFixed(2))
            }

        })

        
       return itensStatus
    }
    public async atualizar(itens:Itens){
        return await this.itensDao.atualizar(itens)
    }
    public async deletar(id:number){
        return await this.itensDao.deletar(id)
    }
}