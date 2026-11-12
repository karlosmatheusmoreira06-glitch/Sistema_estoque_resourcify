    import { Router } from "express";
import { ItensControle } from "../controle/itens.controle";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadFotoItem } from "../middleware/upload.middleware";

const itensControle = new ItensControle()
const itensRouter = Router()

itensRouter
.route("/")
.get(
    authMiddleware,
    async (req,res) => itensControle.listar(req,res)
)
.post(
    authMiddleware,
    uploadFotoItem.single("foto"),
    async (req,res) => itensControle.salvar(req,res)
)

itensRouter
.route("/:id")
.get(
    authMiddleware,
    async (req,res) => itensControle.buscarporId(req,res)
)
.put(
    authMiddleware,
    uploadFotoItem.single("foto"),
    async (req,res) => itensControle.atualizar(req,res)
)
.delete(
    authMiddleware,
    async (req,res) => itensControle.deletar(req,res)
)

export default itensRouter
