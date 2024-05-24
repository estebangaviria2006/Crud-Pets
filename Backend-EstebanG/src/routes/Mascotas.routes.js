import { Router } from "express";
import { listarM, listarMdos, RegistrarM,  ActualizarM, BuscarM, EliminarM } from "../controllers/Mascotas.controller.js";
import { validarM, validarMactualizar,  } from "../../validate/Mascotas.validate.js";
import { validarToken } from "../controllers/autenticacion.js";
//nn
const rutaMascotas = Router();

rutaMascotas.get("/listarMascota", validarToken,listarM);
rutaMascotas.get("/listarMascota2", validarToken,listarMdos);
rutaMascotas.post("/RegistrarMascota",validarToken, RegistrarM);
rutaMascotas.put("/ActualizarMascota/:id_mascota",validarToken, ActualizarM);
rutaMascotas.get("/BuscarMascota/:id_mascota", validarToken,BuscarM);
rutaMascotas.delete("/desactivarMascota/:id_mascota", validarToken,EliminarM);


export default rutaMascotas ;