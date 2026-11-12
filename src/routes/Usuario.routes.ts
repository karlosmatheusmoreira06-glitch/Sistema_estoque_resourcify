import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { UsuarioControle } from "../controle/Usuario.controle";

const usuarioroute = Router()
const usuarioControle = new UsuarioControle()

usuarioroute
.route("/")
.get(
    authMiddleware,
    async (req,res) => usuarioControle.listar(req,res)
)
.post(
    
    async (req,res) => usuarioControle.salvar(req,res)
)

usuarioroute
.post("/login",
    async (req,res) => usuarioControle.login(req,res)
)

usuarioroute
.route("/:id")
.get(
    authMiddleware,
    async (req,res) => usuarioControle.buscarporId(req,res)
)
.put(
    authMiddleware,
    async(req,res) => usuarioControle.atualizar(req,res)
)
.delete(
    authMiddleware,
    async(req,res) => usuarioControle.deletar(req,res)
)
export default usuarioroute
