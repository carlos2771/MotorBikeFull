import { z } from "zod";

export const mecanicoSchema = z.object({
    nombre_mecanico : z.string().refine((value) => {
        return /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(value);},{
        message: "El nombre no es válido. Debe contener solo letras y no estar vacío.",
    }),
    telefono_mecanico: z.string().refine((value) => {
        return /^[0-9]{7,10}$/.test(value);},{
        message: "El número de teléfono no es válido. Debe contener solo números y tener entre 7 y 10 dígitos.",
    }),
    cedula_mecanico: z.string().refine((value) => {
        return /^[0-9]{8,10}$/.test(value);},{
        message: "La cédula no es válida. Debe contener solo números y tener exactamente 10 dígitos.",
    }),
});
