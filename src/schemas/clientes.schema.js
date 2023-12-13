import { z } from "zod";

export const clienteSchema = z.object({
    nombre_cliente: z.string().refine(value => value.trim() !== "", { 
        message: "El nombre del cliente no puede estar vacío"
    }).refine(value => /^[A-Za-z\s]*$/.test(value), {
        message: "El nombre del cliente debe contener solo letras y espacios"
    }),
    // email_cliente: z.string().refine(value => value.trim() !== "", {
    //     message: "El email del cliente no puede estar vacío"
    // }).refine(value => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value), {
    //     message: "Email inválido"
    // }),
    telefono_cliente: z.string().refine(value => value.trim() !== "", {
        message: "El teléfono del cliente no puede estar vacío"
    }).refine(value => /^[0-9]{7,10}$/.test(value), {
        message: "El teléfono debe contener solo números y tener entre 7 y 10 dígitos"
    }),
    cedula: z.string().refine(value => value.trim() !== "", {
        message: "La cédula del cliente no puede estar vacía"
    }).refine(value => /^[0-9]{10}$/.test(value), {
        message: "La cédula debe contener solo números contener exactamente 10 dígitos"
    })
});
