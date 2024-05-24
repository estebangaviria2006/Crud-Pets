import { check } from "express-validator";

export const validarRR=[
    check('nombre_raza', 'El Tipo_categoria es obligatorio').notEmpty().isLength({ max: 20 }),
 ];

 export const validarRA=[
    check('nombre_raza', 'El Tipo_categoria es obligatorio').notEmpty().isLength({ max: 20 }).optional(),
 ];