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
  try{

    const { name, permissions, status } = req.body

    const rolFound = await Rol.findOne({name})

    if(rolFound) return res.status(400).json({message:["El rol ya existe"]});
  
  
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
}catch (error) {
  res.status(500).json({ message: error.message });
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

export const updateRol = async (req, res) => {
  try {
    const roleId = req.params.id;
    const { name, permissions, status } = req.body;

    const role = await Rol.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    if (name) {
      // Verificar si el nuevo nombre ya existe en otro rol
      const existingRole = await Rol.findOne({ name });
      if (existingRole && existingRole._id.toString() !== roleId) {
        return res.status(400).json({ message: 'Ya existe un rol con este nombre' });
      }
      role.name = name;
    }

    if (permissions != null) {
      role.permissions = permissions;
    }

    if (status != null) {
      role.status = status;
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
