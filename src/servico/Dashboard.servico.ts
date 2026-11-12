import { DashboardDao } from "../dao/Dashboard.dao";

export class DashboardServico {

    constructor(readonly dashboardDao: DashboardDao) {}

    public async buscarDados() {
        const [
            totalitens,
            quantidadeEstoque,
            somaPrecoUnitario,
            usuariosCadastrados,
            totalEntradas,
            totalSaidas,
            valorTotalEstoque
        ] = await Promise.all([
            this.dashboardDao.TotalItens(),
            this.dashboardDao.quantidadeEstoque(),
            this.dashboardDao.somaPrecoUnitario(),
            this.dashboardDao.usuariosCadastrados(),
            this.dashboardDao.totalEntradas(),
            this.dashboardDao.totalSaidas(),
            this.dashboardDao.valorTotalEstoque()
        ]);

        return {
            totalitens,
            quantidadeEstoque,
            somaPrecoUnitario,
            usuariosCadastrados,
            totalEntradas,
            totalSaidas,
            valorTotalEstoque
        };
    }
}

