// Importa el modelo de datos 'Marca' desde "../models/marca.model.js"
import  Marca from "../models/marca.model.js"
import Repuesto from "../models/repuestos.model.js"

// Obtiene todas las marcas
export const getMarcas = async(req, res) =>{
    try {
        // Consulta todas las marcas en la base de datos
        const marca = await Marca.find().sort({createdAt : 'desc'})

        // Si no se encuentran marcas, devuelve un código de estado 404 y un mensaje de error
        if(!marca) {
        return res.status(404).json({message: "Marcas no encontradas"})
        }

        // Devuelve las marcas encontradas en formato JSON
        res.json(marca)
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener cliente", error });
    }

}

export const getMarca = async (req, res) => {
    try {
      const marca = await Marca.findById(req.params.id)
      if (!marca) {
        return res.status(404).json({ message: "marca not found" });
      }
      res.json(marca);
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener la marca", error });
    }
  };


// Crea una nueva marca
export const createMarca = async(req, res) =>{
    try {
        // Extrae el nombre de la marca del cuerpo de la solicitud
        const  {nombre_marca, estado} = req.body

        const marcaFound = await Marca.findOne({nombre_marca})
        if(marcaFound) return res.status(400).json({message:["La marca ya existe"]});
        // Para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
        console.log(req.user) 

        // Crea una nueva instancia del modelo 'Marca' con el nombre de la marca
        const newMarca = new Marca({
            nombre_marca, estado
        })

        // Guarda la nueva marca en la base de datos
        const saveMarca =  await newMarca.save()

        // Devuelve la marca creada en formato JSON
        res.status(201).json(saveMarca)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Actualiza una marca por su ID
export const updateMarca= async(req, res) =>{
    try {
        // Extrae el nombre de la marca del cuerpo de la solicitud
        const  {nombre_marca, estado} = req.body

        // Verificar si la marca está asociada a algún repuesto
        const repuestosAsociados = await Repuesto.find({ marca: req.params.id });
        if (repuestosAsociados.length > 0 && estado === "Inactivo") {
            console.log("la marca esta asociada")
            return res.status(400).json({ message: "No se puede inhabilitar la marca porque está asociada a un repuesto" });
        }

        console.log("no esta asociada")

        const marcaFound = await Marca.findOne({nombre_marca})
        if(marcaFound) return res.status(400).json({message:["La marca ya existe, no se puede actualizar"]});
        // Para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
        console.log(req.user) 

        // Busca la marca por su ID y actualíza con los datos proporcionados en el cuerpo de la solicitud
        const marca = await Marca.findByIdAndUpdate(req.params.id, req.body,{ 

            // New y true son para que el guarde los datos nuevos que ingrese el usuario
            new: true
        })
        // Si la marca no se encuentra, devuelve un código de estado 404 y un mensaje de error
        if(!marca) return res.status(404).json({message: "Marca no encontrada"})

        // Devuelve la marca actualizada en formato JSON
        res.json(marca)
    } catch (error) {
        return res.status(500).json({ message: " Error al actualizar la marca", error });
    }
}

// Elimina una marca por su ID
export const deleteMarca = async(req, res) =>{

    try {
        // Busca la marca por su ID y la elimina
        const deletedmarca = await Marca.findByIdAndDelete(req.params.id)

        // Si la marca no se encuentra, devuelve un código de estado 404 y un mensaje de error
        if(!deletedmarca) return res.status(404).json({message: "Marca no encontrada"})

        // Devuelve un código de estado 204 (Sin contenido) para indicar que la marca se eliminó con éxito
        return res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}