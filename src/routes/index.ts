import { Router } from "express";
import usuarioroute from "./Usuario.routes";
import itensRouter from "./Itens.routes";
import movimentacaoRoutes from "./Movimentacao.routes";
import dashboardRoute from "./Dashboard.routes";
const routes = Router()
routes.use("/usuarios",usuarioroute)
routes.use("/itens",itensRouter)
routes.use("/movimentacoes", movimentacaoRoutes)
routes.use("/dashboard",dashboardRoute)

export default routes