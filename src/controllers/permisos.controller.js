import  Permisos from "../models/permisos.model.js"
export const getPermisos = async(req, res) =>{
    const permisos = await Permisos.find()
    if(!permisos) return res.status(404).json({message: "Permisos no encontrados"})
    res.json(permisos)

}

export const createPermisos = async(req, res) =>{
    const  {nombre_permiso, estado} = req.body
    console.log(req.user) // para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
    const newPermiso = new Permisos({
        nombre_permiso, estado
    })
    const savePermiso =  await newPermiso.save()
   res.json(savePermiso)
}
export const deletePermiso = async(req, res) =>{
    const permiso = await Permisos.findByIdAndDelete(req.params.id)
    if(!permiso) return res.status(404).json({message: "Permiso no encontrado"})
    return res.sendStatus(204)
}

export const updatePermiso = async(req, res) =>{
    const permiso = await Permisos.findByIdAndUpdate(req.params.id, req.body,{ // new y true son para que el guarde los datos nuevos que ingrese el usuario
        new: true
    })
    if(!permiso) return res.status(404).json({message: "Permiso no encontrado"})
    res.json(permiso)
}
