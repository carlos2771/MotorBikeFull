import {z} from "zod"

// validacion del schema para que los datos no pasen vacios
export const registerSchema = z.object({
    username: z.string({
        required_error: "username es requerido"
    }),
    email: z.string({
        required_error: "email  es requerido"
    }).email({
        message: "email invalido"
    }),
    password: z.string({
        required_error: "password incorrecta"
    }).min(6,{
        message: "password debe tener minimo 6 caracteres"
    })
})

export const loginSchema = z.object({
    email: z.string({
        required_error: "email es requerido"
    }).email({
        message: "email invalido"
    }),
    password: z.string({
        required_error: "password es requerido"
    }).min(6,{
        message: "password debe tener minimo 6 caracteres"
    })
})