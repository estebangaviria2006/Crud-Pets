import { Router } from "express"
import  {listarR, RegistrarR, ActualizarR, BuscarR, EliminarR} from '../controllers/Razas.controller.js';
import {validarRA, validarRR} from '../../validate/Razas.validate.js'
import { validarToken } from '../controllers/autenticacion.js'

const routerRazas = Router();

routerRazas.get("/listaraza", validarToken,listarR);
routerRazas.post("/Registraraza",validarToken,validarRR, RegistrarR);
routerRazas.put("/Actualizaraza/:id",validarToken,validarRA, ActualizarR);
routerRazas.get("/Buscaraza/:id", validarToken,BuscarR);
routerRazas.delete("/Eliminaraza/:id", validarToken,EliminarR);


export default routerRazas ;
