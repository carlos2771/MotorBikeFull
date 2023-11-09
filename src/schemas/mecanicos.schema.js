import { z } from "zod";

export const mecanicoSchema = z.object({
    nombre_mecanico: z.string().refine(value => value.trim() !== "", {
        message: "El nombre del mecanico no puede estar vacío"
    }).refine(value => /^[A-Za-z\s]*$/.test(value), {
        message: "El nombre del mecanico debe contener solo letras y espacios"
    }),
    telefono_mecanico: z.string().refine(value => value.trim() !== "", {
        message: "El teléfono del mecanico no puede estar vacío"
    }).refine(value => /^[0-9]{7,10}$/.test(value), {
        message: "El teléfono debe contener solo números y tener entre 7 y 10 dígitos"
    }),
    cedula_mecanico: z.string().refine(value => value.trim() !== "", {
        message: "La cédula del mecanico no puede estar vacía"
    }).refine(value => /^[0-9]{10}$/.test(value), {
        message: "La cédula debe contener solo números contener exactamente 10 dígitos"
    })
});
