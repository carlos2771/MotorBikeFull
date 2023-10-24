import { z } from "zod";

export const marcaSchema = z.object({
    nombre_marca: z.string().refine(value => value.trim() !== "", { 
        message: "El nombre de la marca no puede estar vacío"
    }).refine(value => /^[A-Za-z\s]*$/.test(value), {
        message: "El nombre de la marca debe contener solo letras y espacios"
    })
});