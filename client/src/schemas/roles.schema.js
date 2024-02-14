import { z } from "zod";

export const rolesSchema = z.object({
    nombre_rol: z.string().refine(value => value.trim() !== "", { 
        message: "El nombre del rol no puede estar vacío"
    }).refine(value => /^[A-Za-z\s]*$/.test(value), {
        message: "El nombre del rol debe contener solo letras y espacios"
    })
});
