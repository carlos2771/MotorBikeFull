// Importa el modelo de datos 'Mecanico' desde "../models/clientes.model.js"
import  Mecanico from "../models/mecanico.model.js"

// Obtiene todos los mecanicos
export const getMecanicos = async(req, res) =>{
    try {
        const mecanico = await Mecanico.find();
        if (!mecanico) {
          return res.status(404).json({ message: "mecanico no encontrados" });
        }
        res.json(mecanico);
      } catch (error) {
        return res.status(500).json({ message: "Error al obtener mecanico", error });
      }

}

// Obtener un solo mecanico
export const getMecanico = async (req, res) => {
    try {
      const mecanico = await Mecanico.findById(req.params.id)
      if (!mecanico) {
        return res.status(404).json({ message: "mecanico not found" });
      }
      res.json(mecanico);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener el mecanico", error });
    }
  };

// Crea un nuevo mecanico
export const createMecanico = async(req, res) =>{
  try {
     const  {nombre_mecanico, cedula_mecanico, telefono_mecanico, direccion_mecanico, estado} = req.body

    
     const cedulaFound = await Cliente.findOne({cedula})
     if(cedulaFound) return res.status(400).json({message:["cedula mecanico ya existe"]});
     
 
     // para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
     console.log(req.user) 
 
     // Crea una nueva instancia del modelo 'Cliente' con los datos del cliente
     const newMecanico = new Mecanico({
         nombre_mecanico, cedula_mecanico, telefono_mecanico, direccion_mecanico, estado
     })
 
     // Guarda el nuevo cliente en la base de datos
     const saveMecanico =  await newMecanico.save()
 
     // Devuelve el cliente creado en formato JSON
     res.status(201).json(saveMecanico)
   } catch (error) {
    res.status(500).json({ message: error.message });
   }
}

// Actualiza un cliente por su ID
export const updateMecanico = async (req, res) => {
    try {
      const mecanico = await Mecanico.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Para que guarde los datos nuevos que ingrese el usuario
      });
      if (!mecanico) return res.status(404).json({ message: "Mecanico not found" });
      res.json(mecanico);
    } catch (error) {
      return res.status(500).json({ message: " Error al actualizar el mecanico", error });
    }
  };
  
  
  export const deleteMecanico = async(req, res) =>{
    try {
      const deletedmecanico = await Mecanico.findByIdAndDelete(req.params.id);
      if (!deletedmecanico)
        return res.status(404).json({ message: "mecanico not found" });
      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }


