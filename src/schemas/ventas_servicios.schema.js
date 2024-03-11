import { z } from 'zod';

export const ventas_serviciosSchema = z.object({
    precio_servicio: z.number().refine(value => value >= 0, {
            message: "El precio no puede ser un número negativo"
        })
        .refine(value => !isNaN(value), {
            message: "El precio debe ser un número válido"
        }).refine(value => value !== null && value !== undefined, {
            message: "El precio no puede estar vacío"
        }),
    mecanico: z.string().refine(value => value.trim() !== "", {
            message: "El nombre del mecánico no puede estar vacío"
        })
        .refine(value => !/^\d+$/.test(value), {
            message: "El nombre del mecánico no puede contener solo números enteros"
        }),

    cliente: z.string().refine(value => value.trim() !== "", {
            message: "El nombre del cliente no puede estar vacío"
        })
        .refine(value => !/^\d+$/.test(value), {
            message: "El nombre del cliente no puede contener solo números enteros"
        }),

    descripcion: z.string()
        .refine(value => !/^\d+$/.test(value), {
            message: "La descripción no puede contener solo números enteros"
        }),
    placa: z.string().refine(value => value.trim() !== "", {
            message: "La placa no puede estar vacío"
        })
});
