// Importa el modelo de datos 'Cliente' desde "../models/clientes.model.js"
import  Repuesto from "../models/repuestos.model.js"

// Obtiene todos los clientes
export const getRepuestos = async(req, res) =>{
    try {
        const repuesto = await Repuesto.find();
        if (!repuesto) {
          return res.status(404).json({ message: "repuesto no encontrados" });
        }
        res.json(repuesto);
      } catch (error) {
        return res.status(500).json({ message: "Error al obtener repuesto", error });
      }

}

// Obtener un solo cliente
export const getRepuesto = async (req, res) => {
    try {
      const repuesto = await Repuesto.findById(req.params.id)
      if (!repuesto) {
        return res.status(404).json({ message: "repuesto not found" });
      }
      res.json(repuesto);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener la repuesto", error });
    }
  };

// Crea un nuevo repuesto
export const createRepuesto = async(req, res) =>{
  try {
     const  {nombre_repuesto, cantidad, precio, estado} = req.body

 
     // para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
     console.log(req.user) 
 
     // Crea una nueva instancia del modelo 'Cliente' con los datos del cliente
     const newRepuesto = new Repuesto({
         nombre_repuesto, cantidad, precio, estado
     })
 
     // Guarda el nuevo cliente en la base de datos
     const saveRepuesto =  await newRepuesto.save()
 
     // Devuelve el cliente creado en formato JSON
     res.status(201).json(saveRepuesto)
   } catch (error) {
    res.status(500).json({ message: error.message });
   }
}

// Actualiza un cliente por su ID
export const updateRepuesto = async (req, res) => {
    try {
      const repuesto = await Repuesto.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Para que guarde los datos nuevos que ingrese el usuario
      });
      if (!repuesto) return res.status(404).json({ message: "Repueso not found" });
      res.json(repuesto);
    } catch (error) {
      return res.status(500).json({ message: " Error al actualizar el repuesto", error });
    }
  };
  
  
  export const deleteRepuesto = async(req, res) =>{
    try {
      const deletedRepuesto = await Repuesto.findByIdAndDelete(req.params.id);
      if (!deletedRepuesto)
        return res.status(404).json({ message: "repuesto not found" });
      return res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
