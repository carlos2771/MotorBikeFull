import {z} from "zod"

export const createTaskSchema = z.object({
    title: z.string({
        required_error: "title es requerido"
    }),
    description: z.string({
        required_error: "descripcion debe ser string"
    }),
    data: z.string().datetime().optional() // opcional ya que en el model no tiene el requerido
})