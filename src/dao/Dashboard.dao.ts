import { conexao } from "../util/conexao";

export class DashboardDao {

    // TOTAL DE ITENS CADASTRADOS
    public async TotalItens(): Promise<number> {
        try {
            const [resultado]: any = await conexao.query(
                "SELECT COUNT(*) AS total FROM itens"
            );

            return Number(resultado[0].total);
        } catch (error) {
            console.log(error);
            throw new Error("Erro ao contar os itens");
        }
    }

    // QUANTIDADE TOTAL EM ESTOQUE
    public async quantidadeEstoque(): Promise<number> {
        try {
            const [resultado]: any = await conexao.query(
                "SELECT COALESCE(SUM(quantidade), 0) AS total FROM itens"
            );

            return Number(resultado[0].total);
        } catch (error) {
            console.log(error);
            throw new Error("Erro ao calcular a quantidade em estoque");
        }
    }

    // SOMA DOS PREÇOS UNITÁRIOS CADASTRADOS
    public async somaPrecoUnitario(): Promise<number> {
        try {
            const [resultado]: any = await conexao.query(
                "SELECT COALESCE(SUM(preco_unitario), 0) AS total FROM itens"
            );

            return Number(resultado[0].total);
        } catch (error) {
            console.log(error);
            throw new Error("Erro ao somar os preços unitários");
        }
    }

    // TOTAL DE USUÁRIOS CADASTRADOS
    public async usuariosCadastrados(): Promise<number> {
        try {
            const [resultado]: any = await conexao.query(
                "SELECT COUNT(*) AS total FROM usuarios"
            );

            return Number(resultado[0].total);
        } catch (error) {
            console.log(error);
            throw new Error("Erro ao contar os usuários");
        }
    }

    // TOTAL DE ENTRADAS REGISTRADAS
    public async totalEntradas(): Promise<number> {
        try {
            const [resultado]: any = await conexao.query(
                "SELECT COUNT(*) AS total FROM movimentacoes WHERE tipo = 'ENTRADA'"
            );

            return Number(resultado[0].total);
        } catch (error) {
            console.log(error);
            throw new Error("Erro ao contar as entradas");
        }
    }

    // TOTAL DE SAÍDAS REGISTRADAS
    public async totalSaidas(): Promise<number> {
        try {
            const [resultado]: any = await conexao.query(
                "SELECT COUNT(*) AS total FROM movimentacoes WHERE tipo = 'SAIDA'"
            );

            return Number(resultado[0].total);
        } catch (error) {
            console.log(error);
            throw new Error("Erro ao contar as saídas");
        }
    }

    // VALOR TOTAL DO ESTOQUE
    public async valorTotalEstoque(): Promise<number> {
        try {
            const [resultado]: any = await conexao.query(
                "SELECT COALESCE(SUM(quantidade * preco_unitario), 0) AS total FROM itens"
            );

            return Number(resultado[0].total);
        } catch (error) {
            console.log(error);
            throw new Error("Erro ao calcular o valor total do estoque");
        }
    }
}

