import { Router } from "express";
import { listarG, RegistroG, BuscarG, ActualizarG, eliminarG } from "../controllers/Generos.controller.js";
 import { validarGA,validarGR  } from "../../validate/Generos_validate.js";
import { validarToken } from "../controllers/autenticacion.js";

const routerGeneros = Router();

routerGeneros.get("/listarGenero", validarToken, listarG);
routerGeneros.post("/RegistroGenero", validarToken,  validarGR, RegistroG);
routerGeneros.put("/ActualizarGenero/:id", validarToken, validarGA, ActualizarG);
routerGeneros.get("/BuscarGenero/:id",validarToken , BuscarG);
routerGeneros.delete("/EliminarGenero/:id", validarToken,  eliminarG);

export default routerGeneros;
