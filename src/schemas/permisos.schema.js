import { z } from "zod";

export const permisoSchema = z.object({
    nombre_permiso: z.string().refine(value => value.trim() !== "", { 
        message: "El nombre del permiso no puede estar vacío"
    }).refine(value => /^[A-Za-z\s]*$/.test(value), {
        message: "El nombre del permiso debe contener solo letras y espacios"
    })
});
