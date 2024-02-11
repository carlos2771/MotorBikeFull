// Importa el modelo de datos 'Roles' desde "../models/roles.model.js"
import  Roles from "../models/roles.model.js"

// Obtiene todos los Roles
export const getRoles = async(req, res) =>{
    try{
        const roles = await Roles.find()
        if(!roles){
            return res.status(404).json({message: "Roles no encontrados"})
        } 
        res.json(roles)
    }catch (error){
        return res.status(500).json({ message: "Error al obtener el rol", error });
    }
}

export const getRol = async (req, res) => {
    try {
      const rol = await Roles.findById(req.params.id)
      if (!rol) {
        return res.status(404).json({ message: "Rol no encontrado" });
      }
      res.json(rol);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener el rol", error });
    }
  };



// Crea un nuevo Rol
 export const createRol = async (req, res) => {
    try {
      const { nombre_rol, estado, permisos } = req.body;
  
      const rolFound = await Roles.findOne({ name: nombre_rol });
      if (rolFound) return res.status(400).json({ message: ["El nombre del rol ya existe"] });
  
      const newRol = new Roles({
        name: nombre_rol,
        status: estado,
        permissions: permisos, // Guardar permisos seleccionados
      });
  
      const saveRol = await newRol.save();
      res.json(saveRol);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Actualiza un cliente por su ID
export const updateRol = async(req, res) =>{
    try {
        const rol = await Roles.findByIdAndUpdate(req.params.id, req.body,{ // new y true son para que el guarde los datos nuevos que ingrese el usuario
            new: true // Para que guarde los datos nuevos que ingrese el usuario
        })
        if(!rol) return res.status(404).json({message: "Rol no encontrado"})
        res.json(rol)
    }catch (error){
        return res.status(500).json({ message: "Error al actualizar el rol", error });
    }
}

export const deleteRol = async(req, res) =>{
    try {
        const rol = await Roles.findByIdAndDelete(req.params.id)
        if(!rol) return res.status(404).json({message: "Rol no encontrado"})
        return res.sendStatus(204)
    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}