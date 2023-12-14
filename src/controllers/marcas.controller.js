// Importa el modelo de datos 'Marca' desde "../models/marca.model.js"
import  Marca from "../models/marca.model.js"

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
export const updateMarca = async (req, res) => {
    try {
        // Busca la marca por su ID
        const existingMarca = await Marca.findById(req.params.id);

        // Si la marca no se encuentra, devuelve un código de estado 404 y un mensaje de error
        if (!existingMarca) {
            return res.status(404).json({ message: "Marca no encontrada" });
        }

        // Extrae el nombre de la marca y el estado del cuerpo de la solicitud
        const { nombre_marca, estado } = req.body;

        // Si el nombre de la marca ha cambiado, verifica si ya existe
        if (nombre_marca && nombre_marca !== existingMarca.nombre_marca) {
            const marcaFound = await Marca.findOne({ nombre_marca });
            if (marcaFound) {
                return res.status(400).json({ message: ["La marca ya existe"] });
            }
        }

        // Actualiza la marca con los datos proporcionados en el cuerpo de la solicitud
        const updatedMarca = await Marca.findByIdAndUpdate(
            req.params.id,
            { nombre_marca, estado },
            {
                // new y true son para que el guarde los datos nuevos que ingrese el usuario
                new: true,
            }
        );

        // Devuelve la marca actualizada en formato JSON
        res.json(updatedMarca);
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar la marca", error });
    }
};


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


