import { z } from 'zod';

export const repuestosSchema = z.object({
    nombre_repuesto: z.string().refine(value => value.trim() !== "", {
            message: "El nombre del mecánico no puede estar vacío"
        })
        .refine(value => !/^\d+$/.test(value), {
            message: "El nombre del mecánico no puede contener solo números enteros"
        }),

    cantidad: z.number().refine(value => value >= 0, {
            message: "El precio no puede ser un número negativo"
        })
        .refine(value => !isNaN(value), {
            message: "El precio debe ser un número válido"
        }).refine(value => value !== null && value !== undefined, {
            message: "El precio no puede estar vacío"
        }),
        
    precio: z.number().refine(value => value >= 0, {
            message: "El precio no puede ser un número negativo"
        })
        .refine(value => !isNaN(value), {
            message: "El precio debe ser un número válido"
        }).refine(value => value !== null && value !== undefined, {
            message: "El precio no puede estar vacío"
        }),

});
