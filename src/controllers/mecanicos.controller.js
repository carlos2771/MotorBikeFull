import  Mecanico from "../models/mecanico.model.js"
export const getMecanico = async(req, res) =>{
    const mecanicos = await Mecanico.find()
    if(!mecanicos) return res.status(404).json({message: "Mecanicos no encontrados"})
    res.json(mecanicos)
}

export const createMecanico = async(req, res) =>{
    const  {nombre_mecanico, cedula_mecanico, telefono_mecanico, direccion_mecanico} = req.body
    console.log(req.user) // para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
    const newMecanico = new Mecanico({
        nombre_mecanico, cedula_mecanico, telefono_mecanico, direccion_mecanico
    })
    const saveMecanico =  await newMecanico.save()
   res.json(saveMecanico)
}
export const deleteMecanico = async(req, res) =>{
    const mecanico = await Mecanico.findByIdAndDelete(req.params.id)
    if(!mecanico) return res.status(404).json({message: "Mecanico no encontrado"})
    return res.sendStatus(204)
}

export const updateMecanico= async(req, res) =>{
    const mecanico = await Mecanico.findByIdAndUpdate(req.params.id, req.body,{ // new y true son para que el guarde los datos nuevos que ingrese el usuario
        new: true
    })
    if(!mecanico) return res.status(404).json({message: "Mecanico no encontrado"})
    res.json(mecanico)
}
