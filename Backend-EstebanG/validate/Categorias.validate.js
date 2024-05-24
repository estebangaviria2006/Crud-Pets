import { check } from "express-validator";


export const validarCA=[
    check('tipo_categoria', 'El Tipo_categoria es obligatorio').notEmpty().isLength({ max: 20 }),
 ];

 export const validarCR=[
    check('tipo_categoria', 'El Tipo_categoria es obligatorio').notEmpty().isLength({ max: 20 }).optional(),
 ];