const tasksDatabase = {}
let taskIdCounter = 0

const bootstrapTasks = (userId) => {
  tasksDatabase[userId] = []
}

const getAllTasks = (userId) => new Promise((resolve) => {
  const tasksForUser = tasksDatabase[userId]
  resolve(tasksForUser)
})

const getTask = (userId, taskId) => tasksDatabase[userId]
  .find((task) => task.id === Number(taskId))

const addTask = (userId, taskName) => new Promise((resolve) => {
  const newTaskId = taskIdCounter
  taskIdCounter += 1
  const newTask = {
    id: newTaskId,
    name: taskName
  }
  tasksDatabase[userId].push(newTask)
  resolve(newTask)
})

const setTasks = (userId, tasksFromRequest) => {
  tasksDatabase[userId] = []

  tasksFromRequest.forEach((task) => {
    tasksDatabase[userId].push({
      id: taskIdCounter += 1,
      name: task.name
    })
  })

  return tasksDatabase[userId]
}

const deleteTask = (userId, taskId) => {
  tasksDatabase[userId] = tasksDatabase[userId].filter((task) => task.id !== Number(taskId))
}

const editTask = (userId, taskId, taskName) => {
  const foundTask = tasksDatabase[userId]
    .find((task) => task.id === Number(taskId))

  foundTask.name = taskName

  return foundTask
}

export {
  bootstrapTasks, getAllTasks, getTask, addTask, setTasks, deleteTask, editTask
}
