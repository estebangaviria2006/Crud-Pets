import { check } from "express-validator"


export const validarM=[

        check('fk_id_raza', 'El ID de la raza es obligatorio y debe ser un número entero').notEmpty().isInt(),
        check('fk_id_categoria', 'El ID de categoria es obligatorio y debe ser un número entero').notEmpty().isInt(),
        check('fk_id_genero', 'El ID de la genero es obligatorio y debe ser un número entero').notEmpty().isInt()
    ];


export const validarMactualizar=[    
        check('fk_id_raza', 'El ID de la raza es obligatorio y debe ser un número entero').isInt() .optional(),
        check('fk_id_categoria', 'El ID de categoria es obligatorio y debe ser un número entero').isInt() .optional(),
        check('fk_id_genero', 'El ID de la genero es obligatorio y debe ser un número entero').isInt() .optional(),
    ]
    
