import { check } from "express-validator";

export const validarRegistroM = [
    check('name', 'El nombre de la mascota es obligatorio y solo debe contener letras').notEmpty().matches(/^[a-zA-Z]+$/),
    check('fk_id_raza', 'El ID de la raza es obligatorio y debe ser un número entero').notEmpty().isInt(),
    check('fk_id_categoria', 'El ID de categoria es obligatorio y debe ser un número entero').notEmpty().isInt(),
    check('fk_id_genero', 'El ID de la genero es obligatorio y debe ser un número entero').notEmpty().isInt(),
   
];

export const validarActualizarM = [
    check('name', 'El nombre de la mascota es obligatorio y solo debe contener letras').notEmpty().matches(/^[a-zA-Z]+$/),
    check('fk_id_raza', 'El ID de la raza debe ser un número entero').isInt().optional(),
    check('fk_id_categoria', 'El ID de categoria debe ser un número entero').isInt().optional(),
    check('fk_id_genero', 'El ID de la genero debe ser un número entero').isInt().optional(),
];
