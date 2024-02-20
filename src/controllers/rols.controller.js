// Importa el modelo de datos 'Marca' desde "../models/marca.model.js"
import  Rol from "../models/rols.model.js"


// Listar todos los roles
export const getRoles  = async(req, res) =>{
  try {
    const roles = await Rol.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo rol
export const createRol  = async(req, res) =>{
  const role = new Rol({
    name: req.body.name,
    permissions: req.body.permissions,
    status: req.body.status
  });

  try {
    const newRole = await role.save();
    res.status(201).json(newRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener un rol por ID
export const getRol = async (req, res) => {
  try {
    const role = await Rol.findById(req.params.id);
    if (role == null) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un rol
export const updateRol= async(req, res) =>{
  try {
    const role = await Rol.findById(req.params.id);
    if (role == null) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    if (req.body.name != null) {
      role.name = req.body.name;
    }
    if (req.body.permissions != null) {
      role.permissions = req.body.permissions;
    }
    if (req.body.status != null) {
      role.status = req.body.status;
    }
    const updatedRole = await role.save();
    res.json(updatedRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un rol
export const deleteRol = async(req, res) =>{
  try {
    const role = await Rol.findById(req.params.id);
    if (role == null) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    await role.remove();
    res.json({ message: 'Rol eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
