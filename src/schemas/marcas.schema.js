import { z } from "zod";

export const marcaSchema = z.object({
    nombre_marca : z.string().refine((value) => {
        return /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(value);},{
        message: "El nombre de la marca no es válido. Debe contener solo letras y no estar vacío.",
    }),
});