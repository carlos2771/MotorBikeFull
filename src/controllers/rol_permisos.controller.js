import Rol_Permisos from "../models/rol_permiso.model.js"
import Rol from "../models/roles.model.js";
import Permiso from "../models/cliente.model.js";

// Todos los roles X Permiso
export const getRol_Permisos = async (req, res) => {
  try {
    const rol_permisos = await Rol_Permisos.find().populate({ path: 'roles', select: 'nombre_rol' }) .populate({ path: 'permisos', select: 'nombre_permiso' });
    if (!rol_permisos) {
      return res.status(404).json({ message: "Rol permiso no encontrados" });
    }
    res.json(rol_permisos);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener permisos de rol", error });
  }
};

// 1 Rol x permiso
export const getRol_Permiso = async (req, res) => {
  try {
    const rol_permiso = await Rol_Permisos.findById(req.params.id)
    if (!rol_permiso) {
      return res.status(404).json({ message: "rol permiso no encontrado" });
    }
    res.json(rol_permiso);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener permisos de rol", error });
  }
};

export const createRol_Permiso = async (req, res) => {
  try {
    const {
      rol: rolId,
      permiso: permisoId,
    } = req.body;

    // Verifica si el cliente existe
    const permisoEncontrado = await Permiso.findById(permisoId);
    if (!permisoEncontrado) {
      return res.status(404).json({ message: "Permiso no encontrado" });
    }
    const rolEncontrado = await Rol.findById(rolId);
    if (!rolEncontrado) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }


    // // Obtiene la cantidad actual del repuesto
    // const cantidadActualRepuesto = permisoEncontrado.permiso;
  
    // Crea un nuevo permiso asociada rol
    const nuevoRolPermiso = new Rol_Permiso({
      rol: rolId,
      permiso: permisoId,
    });

    // Guarda el rol permiso en la base de datos
    const rolPermisoGuardada = await nuevoRolPermiso.save();

    res.status(201).json(rolPermisoGuardada);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el permiso del rol", error });
  }
};


export const updateRol_Permisos= async(req, res) =>{
  try {
    const rol_permiso = await Rol_Permisos.findByIdAndUpdate(req.params.id, req.body, {
      // new y true son para que el guarde los datos nuevos que ingrese el usuario
      new: true,
    });
    if (!rol_permiso) return res.status(404).json({ message: "Rol permiso no encontrada" });
    res.json(rol_permiso);
  } catch (error) {
    return res.status(500).json({ message: "Rol permiso no encontrada" });
  }
}

export const deleteRol_Permisos = async(req, res) =>{
  try {
    const deletedRol_permiso = await Rol_Permisos.findByIdAndDelete(req.params.id);
    if (!deletedRol_permiso)
      return res.status(404).json({ message: "Rol permiso no encontrado" });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}