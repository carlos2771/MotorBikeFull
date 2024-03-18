import Repuesto from "../models/repuestos.model.js";
import Marca from "../models/marca.model.js";
import fs from "fs";
import sharp from "sharp"; // Importa el módulo sharp
import multer from "multer";

export const getRepuestos = async (req, res) => {
  try {
    const repuestos = await Repuesto.find()
      .populate({ path: "marca", select: "nombre_marca" })
      .sort({ createdAt: 'desc' });
    if (!repuestos) {
      return res.status(404).json({ message: "repuestos no encontrados" });
    }
    res.json(repuestos);
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: "Error al obtener repuestos", error });
  }
};

export const getRepuesto = async (req, res) => {
  try {
    const repuesto = await Repuesto.findById(req.params.id);
    if (!repuesto) {
      return res.status(404).json({ message: "repuesto not found" });
    }
    res.json(repuesto);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el repuesto", error });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads";
    // Crea el directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const uploadMiddleware = () => upload.single("img");

export default uploadMiddleware;



export const createRepuestos = async (req, res) => {
  try {
    const { name, img, inCart, price, marca: marcaId, estado } = req.body;

    // Normalizar el nombre del repuesto a minúsculas
    const nombreNormalizado = name.toLowerCase();

    // Establecer la cantidad del repuesto en cero
    const amount = 0;

    // Verificar si ya existe un repuesto con el mismo nombre (ignorando mayúsculas/minúsculas)
    const repuestoExistente = await Repuesto.findOne({
      name: { $regex: new RegExp('^' + nombreNormalizado + '$', 'i') }
    });

    if (repuestoExistente) {
      return res.status(400).json({ message: "Ya existe un repuesto con el mismo nombre" });
    }

    // Guarda la imagen en base64 directamente desde req.body.img
    let imgBase64;

    // Verificar si se proporcionó una imagen, si no, utiliza una por defecto
    if (img) {
      imgBase64 = img;
    } else {
      // Si no se proporciona una imagen, utiliza una imagen por defecto aquí
      // Puedes reemplazar 'imagen_por_defecto_base64' con tu propia imagen base64 por defecto
      imgBase64 = 'https://r2.easyimg.io/gvdthk7f0/motorbike_(1).png';
    }

    // Si no existe, crea un nuevo repuesto
    const marcaEncontrada = await Marca.findById(marcaId);
    if (!marcaEncontrada) {
      return res.status(404).json({ message: ["Marca no encontrada"] });
    }

    // Obtener el nombre de la marca
    const nombreMarca = marcaEncontrada.nombre_marca;

    const nuevoRepuesto = new Repuesto({
      name: nombreNormalizado,
      img: imgBase64,
      inCart,
      marca: marcaId,
      nombre_marca: nombreMarca, // Aquí asignamos el nombre de la marca
      price,
      amount, // Establecer la cantidad del repuesto en cero
      estado,
    });

    const repuestoGuardado = await nuevoRepuesto.save();

    res.status(201).json(repuestoGuardado);
  } catch (error) {
    console.error("error a crear repuesto", error);
    return res.status(500).json({ message: ["Error al crear el repuesto"], error });
  }
};





export const updateRepuestos = async (req, res) => {
  try {
    const { name, marca: marcaId, cantidad, price, estado, img } = req.body;

    // Verificar si name está definido antes de normalizar
    const nombreNormalizado = name ? name.toLowerCase() : '';

    // Convertir la cantidad a un número (puedes ajustar esto según tus necesidades)
    const cantidadNumerica = cantidad;

    // Encuentra el repuesto que se va a actualizar
    let repuestoActualizado = await Repuesto.findById(req.params.id);

    if (!repuestoActualizado) {
      return res.status(404).json({ message: "Repuesto no encontrado" });
    }

    // Verificar si se proporcionó una nueva imagen
    if (img) {
      repuestoActualizado.img = img; // Actualiza la imagen del repuesto
    }

    // Actualiza los demás campos del repuesto si se proporcionan
    repuestoActualizado.name = nombreNormalizado || repuestoActualizado.name;
    repuestoActualizado.marca = marcaId || repuestoActualizado.marca;
    repuestoActualizado.cantidad = cantidadNumerica || repuestoActualizado.cantidad;
    repuestoActualizado.price = price || repuestoActualizado.price;
    repuestoActualizado.estado = estado || repuestoActualizado.estado;

    // Guarda los cambios en la base de datos
    repuestoActualizado = await repuestoActualizado.save();

    res.json(repuestoActualizado);
  } catch (error) {
    console.error("Error al actualizar el repuesto:", error);
    return res.status(500).json({ message: "Error al actualizar el repuesto", error });
  }
};







export const deleteRepuesto = async (req, res) => {
  try {
    const deletedRepuesto = await Repuesto.findByIdAndDelete(req.params.id);
    if (!deletedRepuesto)
      return res.status(404).json({ message: "repuesto not found" });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};