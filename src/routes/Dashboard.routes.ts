import { Router } from "express";
import { DashboardControle } from "../controle/Dashboard.controle";
import { authMiddleware } from "../middleware/auth.middleware";

const dashboardRoute = Router()
const dashboardControle = new DashboardControle()

dashboardRoute
.route("/")
.get(
    authMiddleware,
    async(req,res) => dashboardControle.buscarDados(req,res)
)
export default dashboardRoute