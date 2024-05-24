import { check } from "express-validator";

export const validarGA=[
    check('tipo_generos', 'El Tipo_categoria es obligatorio').notEmpty().isLength({ max: 20 }),
 ];

 export const validarGR=[
    check('tipo_generos', 'El Tipo_categoria es obligatorio').notEmpty().isLength({ max: 20 }).optional(),
 ];