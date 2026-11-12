import { Router } from "express";
import {MovimentacoesControle } from "../controle/Movimentacoes.controle";
import { authMiddleware } from "../middleware/auth.middleware";

const movimentacaoRoutes = Router()
const movimentacoesControle = new MovimentacoesControle()

movimentacaoRoutes
.route("/")
.get(
    authMiddleware,
    async(req, res) => movimentacoesControle.listar(req,res)
)
.post(
    authMiddleware,
    async(req,res) => movimentacoesControle.salvar(req,res)
)

movimentacaoRoutes
.route("/:id")
.get(
    authMiddleware,
    async (req,res) => movimentacoesControle.buscarPorid(req,res)
)
.put(
    authMiddleware,
    async(req,res) => movimentacoesControle.atualizar(req,res)
)
.delete(
    authMiddleware,
    async(req,res) => movimentacoesControle.excluir(req,res)
)
export default movimentacaoRoutes