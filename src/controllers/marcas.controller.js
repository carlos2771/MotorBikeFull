import  Marca from "../models/marca.model.js"
export const getMarca = async(req, res) =>{
    const marca = await Marca.find()
    if(!marca) return res.status(404).json({message: "Marcas no encontradas"})
    res.json(marca)

}

export const createMarca = async(req, res) =>{
    const  {nombre_marca} = req.body
    console.log(req.user) // para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
    const newMarca = new Marca({
        nombre_marca
    })
    const saveMarca =  await newMarca.save()
   res.json(saveMarca)
}

export const deleteMarca = async(req, res) =>{
    const marca = await Marca.findByIdAndDelete(req.params.id)
    if(!marca) return res.status(404).json({message: "marca not found"})
    return res.sendStatus(204)
}

export const updateMarca= async(req, res) =>{
    const marca = await Marca.findByIdAndUpdate(req.params.id, req.body,{ // new y true son para que el guarde los datos nuevos que ingrese el usuario
        new: true
    })
    if(!marca) return res.status(404).json({message: "marca not found"})
    res.json(marca)
}
