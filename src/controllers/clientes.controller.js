// Importa el modelo de datos 'Cliente' desde "../models/clientes.model.js"
import  Cliente from "../models/cliente.model.js"

// Obtiene todos los clientes
export const getClientes = async(req, res) =>{
    try {
        const cliente = await Cliente.find().sort({createdAt : 'desc'});
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
     const  {nombre_cliente, email_cliente, telefono_cliente, cedula, sexo, estado, tipo} = req.body

     // Verificar si existe un cliente con la misma cédula y tipo de documento
     const existingCliente = await Cliente.findOne({ cedula, tipo });

     if (existingCliente) {
         return res.status(400).json({ message: ["Ya existe un cliente con este número de cédula y tipo de documento." ]});
     }
     const clientFound = await Cliente.findOne({email_cliente})
     if(clientFound) return res.status(400).json({message:["El correo electrónico del cliente ya existe"]});
      
     // para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
     console.log(req.user) 
 
     // Crea una nueva instancia del modelo 'Cliente' con los datos del cliente
     const newCliente = new Cliente({
         nombre_cliente, email_cliente, telefono_cliente, cedula, sexo, estado, tipo
     })
 
     // Guarda el nuevo cliente en la base de datos
     const saveCliente =  await newCliente.save()
 
     // Devuelve el cliente creado en formato JSON
     res.status(201).json(saveCliente)
   } catch (error) {
    res.status(500).json({ message: ["Error al agregar clientes"] , error });
   }
}

// Actualiza un cliente por su ID
export const updateCliente = async (req, res) => {
  try {
      // Extrae los datos a actualizar del cuerpo de la solicitud
      const { nombre_cliente, cedula, telefono_cliente, direccion_cliente, estado, tipo } = req.body;

      // Busca el cliente por su ID
      const cliente = await Cliente.findById(req.params.id);
      // Si el cliente no se encuentra, devuelve un código de estado 404 y un mensaje de error
      if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });

      // Verificar si existe otro cliente con el mismo número de cédula y tipo de documento
      const existingCliente = await Cliente.findOne({ cedula , tipo });

      // Si encontramos otro cliente con la misma cédula y tipo de documento, y su ID no es el mismo que estamos actualizando,
      // entonces no permitimos la actualización y devolvemos un mensaje de error.
      if (existingCliente && existingCliente._id.toString() !== req.params.id) {
          return res.status(400).json({ message: ["Ya existe un cliente con este número de cédula y tipo de documento."] });
      }
      // Verificar si existe otro cliente con el mismo correo electrónico
      const clientFound = await Cliente.findOne({ email_cliente });
      if (clientFound) return res.status(400).json({ message: ["El correo electrónico del cliente ya existe"] });

      // Actualiza el cliente con los datos proporcionados
      const updatedCliente = await Cliente.findByIdAndUpdate(req.params.id, {
          nombre_cliente,
          cedula,
          telefono_cliente,
          direccion_cliente,
          estado,
          tipo
      }, {
          new: true // Devuelve el documento actualizado
      });

      // Devuelve el cliente actualizado en formato JSON
      res.json(updatedCliente);
  } catch (error) {
      return res.status(500).json({ message: ["Error al actualizar el cliente"], error });
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


