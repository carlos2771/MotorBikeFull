// Importa el modelo de datos 'Permisos' desde "../models/permisos.model.js"
import  Permisos from "../models/permisos.model.js"

// Obtiene todos los permisos
export const getPermisos = async(req, res) =>{
    try{
        const permisos = await Permisos.find()
        if(!permisos){
            return res.status(404).json({message: "Permisos no encontrados"})
        } 
        res.json(permisos)
    }catch (error){
        return res.status(500).json({ message: "Error al obtener el permiso", error });
    }
}

export const getPermiso = async (req, res) => {
    try {
      const permiso = await Permisos.findById(req.params.id)
      if (!permiso) {
        return res.status(404).json({ message: "Permiso no encontrado" });
      }
      res.json(permiso);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener el permiso", error });
    }
  };



// Crea un nuevo permiso
export const createPermiso = async(req, res) =>{
    try {
        const  {nombre_permiso, estado} = req.body

        const permisoFound = await Permisos.findOne({nombre_permiso})
        if(permisoFound) return res.status(400).json({message:["El nombre del permiso ya existe"]});
        
        // para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
        console.log(req.user) // para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
        
         // Crea una nueva instancia del modelo 'Permiso' con los datos del permiso
        const newPermiso = new Permisos({
            nombre_permiso, estado
        })

        // Guarda el nuevo permiso en la base de datos
        const savePermiso =  await newPermiso.save()

        // Devuelve el permiso creado en formato JSON
       res.json(savePermiso)
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

// Actualiza un cliente por su ID
export const updatePermiso = async(req, res) =>{
    try {
        const permiso = await Permisos.findByIdAndUpdate(req.params.id, req.body,{ // new y true son para que el guarde los datos nuevos que ingrese el usuario
            new: true // Para que guarde los datos nuevos que ingrese el usuario
        })
        if(!permiso) return res.status(404).json({message: "Permiso no encontrado"})
        res.json(permiso)
    }catch (error){
        return res.status(500).json({ message: "Error al actualizar el permiso", error });
    }
}

export const deletePermiso = async(req, res) =>{
    try {
        const permiso = await Permisos.findByIdAndDelete(req.params.id)
        if(!permiso) return res.status(404).json({message: "Permiso no encontrado"})
        return res.sendStatus(204)
    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}