import Repuesto from "../models/repuestos.model.js";
import Marca from "../models/marca.model.js";
import fs from "fs";
import sharp from "sharp"; // Importa el módulo sharp
import multer from "multer";

export const getRepuestos = async (req, res) => {
  try {
    const repuestos = await Repuesto.find()
      .populate({ path: "marca", select: "nombre_marca" })
      .sort({ name: "desc" });
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
    const { name, img, inCart, price, amount, marca: marcaId, estado } = req.body;

    // Convierte la cantidad a un número (puedes ajustar esto según tus necesidades)
    const cantidadNumerica = parseInt(amount, 10);

    // Verificar si ya existe un repuesto con el mismo nombre y marca
    const repuestoExistente = await Repuesto.findOne({ name, marca: marcaId });

    if (repuestoExistente) {
      // Si existe, actualiza la cantidad
      repuestoExistente.amount += cantidadNumerica;
      await repuestoExistente.save();
      return res.status(200).json(repuestoExistente);
    }

    // Guarda la imagen en base64 directamente desde req.body.img
    const imgBase64 = req.body.img;

    // Si no existe, crea un nuevo repuesto
    const marcaEncontrada = await Marca.findById(marcaId);
    if (!marcaEncontrada) {
      return res.status(404).json({ message: ["Marca no encontrada"] });
    }

    const nuevoRepuesto = new Repuesto({
      name,
      img: imgBase64,
      inCart,
      marca: marcaId,
      amount: cantidadNumerica,
      price,
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
    const { nombre_repuesto, marca: marcaId, cantidad } = req.body;

    // Convertir la cantidad a un número (puedes ajustar esto según tus necesidades)
    const cantidadNumerica = parseInt(cantidad, 10);

    // Verificar si ya existe un repuesto con el mismo nombre y marca
    const repuestoExistente = await Repuesto.findOne({
      nombre_repuesto,
      marca: marcaId,
    });

    if (repuestoExistente) {
      // Si existe, actualiza la cantidad
      repuestoExistente.cantidad += cantidadNumerica;
      await repuestoExistente.save();

      // Ahora, puedes actualizar otras propiedades si es necesario
      const repuestoActualizado = await Repuesto.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

      return res.status(200).json(repuestoActualizado);
    }

    // Si no existe, realiza la actualización normal
    const repuestoActualizado = await Repuesto.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!repuestoActualizado) {
      return res.status(404).json({ message: "Repuesto no encontrado" });
    }

    res.json(repuestoActualizado);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al actualizar el repuesto", error });
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
