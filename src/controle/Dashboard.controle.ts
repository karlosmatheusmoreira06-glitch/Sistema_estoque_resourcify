import { Request, Response } from "express";
import { DashboardDao } from "../dao/Dashboard.dao";
import { DashboardServico } from "../servico/Dashboard.servico";

export class DashboardControle{
    private dashboardServico: DashboardServico

    constructor(){
        const dashboardDao = new DashboardDao()
        this.dashboardServico= new DashboardServico(dashboardDao)
    }
    public async buscarDados(req:Request, res:Response){
        try{
            const dados = await this.dashboardServico.buscarDados()
            return res.status(200).json(dados)

        }
        catch(error){
            console.log("Erro: ",error)
            return res.status(500).json({
                message: "Erro ao buscar Dados"
            })
        }
    }
}