// Importa el modelo de datos 'Cliente' desde "../models/clientes.model.js"
import  Cliente from "../models/cliente.model.js"

// Obtiene todos los clientes
export const getClientes = async(req, res) =>{

    try {
        // Consulta todos los clientes en la base de datos
        const clientes = await Cliente.find()

        // Si no se encuentran los clientes, devuelve un código de estado 404 y un mensaje de error
        if(!clientes) return res.status(404).json({message: "Clientes no encontrados"})

        // Devuelve los clientes encontrados en formato JSON
        res.json(clientes)
    }catch (error) {
        // En caso de error, maneja la excepción y devuelve un código de estado 500 (Error del servidor) con un mensaje de error
        res.status(500).json({ message: "Error al obtener los clientes", error: error.message });
      }

}

// Crea un nuevo cliente
export const createCliente = async(req, res) =>{

    try {
        // Extrae los datos del cliente, del cuerpo de la solicitud
        const  {nombre_cliente, email_cliente, telefono_cliente, cedula} = req.body

        // para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
        console.log(req.user) 

        // Crea una nueva instancia del modelo 'Cliente' con los datos del cliente
        const newCliente = new Cliente({
            nombre_cliente, email_cliente, telefono_cliente, cedula
        })

        // Guarda el nuevo cliente en la base de datos
        const saveCliente =  await newCliente.save()

        // Devuelve el cliente creado en formato JSON
        res.json(saveCliente)

    }catch (error) {
        // En caso de error, maneja la excepción y devuelve un código de estado 500 (Error del servidor) con un mensaje de error
        res.status(500).json({ message: "Error al crear cliente", error: error.message });
      }
}

// Actualiza un cliente por su ID
export const updateCliente= async(req, res) =>{

    try {
        // Busca el cliente por su ID y actualíza con los datos proporcionados en el cuerpo de la solicitud
        const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body,{

            // New y true son para que el guarde los datos nuevos que ingrese el usuario
            new: true
        })
        // Si el cliente no se encuentra, devuelve un código de estado 404 y un mensaje de error
        if(!cliente) return res.status(404).json({message: "Cliente no encontrado"})

        // Devuelve el cliente actualizado en formato JSON
        res.json(cliente)
    } catch (error) {
        // En caso de error, maneja la excepción y devuelve un código de estado 500 (Error del servidor) con un mensaje de error
        res.status(500).json({ message: "Error al actualizar cliente", error: error.message });
            }
}

// Elimina un cliente por su ID
export const deleteCliente = async(req, res) =>{

    try {
        // Busca el cliente por su ID y lo elimina
        const cliente = await Cliente.findByIdAndDelete(req.params.id)

        // Si el cliente no se encuentra, devuelve un código de estado 404 y un mensaje de error
        if(!cliente) return res.status(404).json({message: "cliente no encontrado"})

        // Devuelve un código de estado 204 (Sin contenido) para indicar que el cliente se eliminó con éxito
        return res.sendStatus(204)

    } catch (error) {
        // En caso de error, maneja la excepción y devuelve un código de estado 500 (Error del servidor) con un mensaje de error
        res.status(500).json({ message: "Error al eliminar cliente", error: error.message });
      }
}


