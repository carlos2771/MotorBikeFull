import Task from "../models/task.model.js"
export const getTasks = async(req, res) =>{
    const tasks = await Task.find({
        user: req.user.id // para que se le muestre las tareas a la persona que le pertenezca
    }).populate("user") // para que me traiga todos los datos de la otra coleccion, email username, password, etc...
    res.json(tasks)
}

export const createTasks = async(req, res) =>{
    const  {title, description, date} = req.body
    console.log(req.user) // para saber cual es el usuario que viene de la otra coleccion pero debe estar logueado
    const newTask = new Task({
        title,
        description,
        date,
        user: req.user.id // para que el ref pueda funcionar adecuadamente
    })
    const saveTask =  await newTask.save()
   res.json(saveTask)
}

export const getTask = async(req, res) =>{
    const task = await Task.findById(req.params.id).populate("user")
    if(!task) return res.status(404).json({message: "task not found"})
    res.json(task)

}
export const deleteTasks = async(req, res) =>{
    const task = await Task.findByIdAndDelete(req.params.id)
    if(!task) return res.status(404).json({message: "task not found"})
    return res.sendStatus(204)
}

export const updateTasks = async(req, res) =>{
    const task = await Task.findByIdAndUpdate(req.params.id, req.body,{ // new y true son para que el guarde los datos nuevos que ingrese el usuario
        new: true
    })
    if(!task) return res.status(404).json({message: "task not found"})
    res.json(task)
}
