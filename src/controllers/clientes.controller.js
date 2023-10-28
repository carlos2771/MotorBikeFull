// Importa el modelo de datos 'Cliente' desde "../models/clientes.model.js"
import  Cliente from "../models/cliente.model.js"

// Obtiene todos los clientes
export const getClientes = async(req, res) =>{
    try {
        const cliente = await Cliente.find();
        if (!cliente) {
          return res.status(404).json({ message: "cliente no encontrados" });
        }
        res.json(cliente);
      } catch (error) {
        return res.status(500).json({ message: "Error al obtener cliente", error });
      }

}

// Obtener un solo cliente
export const getCliente = async (req, res) => {
    try {
      const cliente = await Cliente.findById(req.params.id)
      if (!cliente) {
        return res.status(404).json({ message: "cliente not found" });
      }
      res.json(cliente);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener la cliente", error });
    }
  };

// Crea un nuevo cliente
export const createCliente = async(req, res) =>{
  try {
     const  {nombre_cliente, email_cliente, telefono_cliente, cedula} = req.body

     const clientFound = await Cliente.findOne({email_cliente})
     if(clientFound) return res.status(400).json({message:["el correo del cliente ya existe"]});
     
 
     // para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
     console.log(req.user) 
 
     // Crea una nueva instancia del modelo 'Cliente' con los datos del cliente
     const newCliente = new Cliente({
         nombre_cliente, email_cliente, telefono_cliente, cedula
     })
 
     // Guarda el nuevo cliente en la base de datos
     const saveCliente =  await newCliente.save()
 
     // Devuelve el cliente creado en formato JSON
     res.status(201).json(saveCliente)
   } catch (error) {
    res.status(500).json({ message: error.message });
   }
}

// Actualiza un cliente por su ID
export const updateCliente = async (req, res) => {
    try {
      const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Para que guarde los datos nuevos que ingrese el usuario
      });
      if (!cliente) return res.status(404).json({ message: "Cliente not found" });
      res.json(cliente);
    } catch (error) {
      return res.status(500).json({ message: "Error al actualizar el cliente", error });
    }
  };
  
  
  export const deleteCliente = async(req, res) =>{
    try {
      const deletedcliente = await Cliente.findByIdAndDelete(req.params.id);
      if (!deletedcliente)
        return res.status(404).json({ message: "cliente not found" });
      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }


