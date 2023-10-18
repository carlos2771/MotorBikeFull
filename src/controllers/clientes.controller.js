import  Cliente from "../models/cliente.model.js"
export const getClientes = async(req, res) =>{
    const clientes = await Cliente.find()
    if(!clientes) return res.status(404).json({message: "Clientes no encontrados"})
    res.json(clientes)

}

export const createCliente = async(req, res) =>{
    const  {nombre_cliente, email_cliente, telefono_cliente, cedula} = req.body
    console.log(req.user) // para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
    const newCliente = new Cliente({
        nombre_cliente, email_cliente, telefono_cliente, cedula
    })
    const saveCliente =  await newCliente.save()
   res.json(saveCliente)
}
export const deleteCliente = async(req, res) =>{
    const cliente = await Cliente.findByIdAndDelete(req.params.id)
    if(!cliente) return res.status(404).json({message: "cliente not found"})
    return res.sendStatus(204)
}

export const updateCliente= async(req, res) =>{
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body,{ // new y true son para que el guarde los datos nuevos que ingrese el usuario
        new: true
    })
    if(!cliente) return res.status(404).json({message: "cliente not found"})
    res.json(cliente)
}
