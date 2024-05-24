import { Router } from "express";
import { listarC, RegistroC, BuscarC, ActualizarC, eliminarC } from "../controllers/Categorias.controller.js";
import { validarCA,validarCR  } from "../../validate/Categorias.validate.js";
import { validarToken } from "../controllers/autenticacion.js";

const routerCategorias = Router();

routerCategorias.get("/listarCategoria", validarToken, listarC);
routerCategorias.post("/RegistroCategoria", validarToken,  validarCR, RegistroC);
routerCategorias.put("/ActualizarCategoria/:id", validarToken, validarCA, ActualizarC);
routerCategorias.get("/BuscarCategoria/:id",validarToken , BuscarC);
routerCategorias.delete("/EliminarCategoria/:id", validarToken,  eliminarC);

export default routerCategorias;
