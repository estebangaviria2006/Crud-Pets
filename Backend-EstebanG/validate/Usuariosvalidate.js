import { check } from "express-validator";

export const validarUsuario = [
    check('identificacion', 'Identificacion es obligatorio y debe contener solo números')
        .not()
        .isEmpty()
        .isNumeric(),

    check('nombre', 'El nombre es obligatorio y debe contener solo letras, máximo 20 caracteres')
        .not()
        .isEmpty()
        .isLength({ max: 20 })
        .matches(/^[A-Za-z\s]+$/),

    check('email', 'El correo electrónico es obligatorio y debe ser válido')
        .not()
        .isEmpty()
        .isEmail(),

    check('password', 'La contraseña es obligatoria y debe tener al menos 5 caracteres')
        .not()
        .isEmpty()
        .isLength({ min: 5 })
];

    

   
export const validarUsu = [
    check('identificacion', 'Identificacion debe contener solo números')
        .optional()
        .not()
        .isEmpty()
        .isNumeric(),

    check('nombre', 'El nombre debe contener solo letras, máximo 50 caracteres')
        .optional()
        .not()
        .isEmpty()
        .isLength({ max: 50 })
        .matches(/^[A-Za-z\s]+$/),

    check('correo', 'El correo electrónico debe ser válido')
        .optional()
        .isEmail(),

    check('password', 'La contraseña debe tener al menos 5 caracteres')
        .optional()
        .isLength({ min: 5 })
];

