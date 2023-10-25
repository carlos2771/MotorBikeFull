// Importa el modelo de datos 'Marca' desde "../models/marca.model.js"
import  Marca from "../models/marca.model.js"

// Obtiene todas las marcas
export const getMarca = async(req, res) =>{

    try {
        // Consulta todas las marcas en la base de datos
        const marca = await Marca.find()

        // Si no se encuentran marcas, devuelve un código de estado 404 y un mensaje de error
        if(!marca) return res.status(404).json({message: "Marcas no encontradas"})

        // Devuelve las marcas encontradas en formato JSON
        res.json(marca)
    }catch (error) {
        // En caso de error, maneja la excepción y devuelve un código de estado 500 (Error del servidor) con un mensaje de error
        res.status(500).json({ message: "Error al obtener marcas", error: error.message });
      }
};

// Crea una nueva marca
export const createMarca = async(req, res) =>{
    try {
        // Extrae el nombre de la marca del cuerpo de la solicitud
        const  {nombre_marca} = req.body

        // Para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
        console.log(req.user) 

        // Crea una nueva instancia del modelo 'Marca' con el nombre de la marca
        const newMarca = new Marca({
            nombre_marca
        })

        // Guarda la nueva marca en la base de datos
        const saveMarca =  await newMarca.save()

        // Devuelve la marca creada en formato JSON
        res.json(saveMarca)
    }catch (error) {
        // En caso de error, maneja la excepción y devuelve un código de estado 500 (Error del servidor) con un mensaje de error
        res.status(500).json({ message: "Error al crear marca", error: error.message });
      }
};

// Actualiza una marca por su ID
export const updateMarca= async(req, res) =>{

    try {
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
    // En caso de error, maneja la excepción y devuelve un código de estado 500 (Error del servidor) con un mensaje de error
    res.status(500).json({ message: "Error al actualizar marca", error: error.message });
        }
};

// Elimina una marca por su ID
export const deleteMarca = async(req, res) =>{

    try {

        // Busca la marca por su ID y la elimina
        const marca = await Marca.findByIdAndDelete(req.params.id)

        // Si la marca no se encuentra, devuelve un código de estado 404 y un mensaje de error
        if(!marca) return res.status(404).json({message: "Marca no encontrada"})

        // Devuelve un código de estado 204 (Sin contenido) para indicar que la marca se eliminó con éxito
        return res.sendStatus(204)

    } catch (error) {
        // En caso de error, maneja la excepción y devuelve un código de estado 500 (Error del servidor) con un mensaje de error
        res.status(500).json({ message: "Error al eliminar marca", error: error.message });
      }
};


