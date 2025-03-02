const { Task } = require("./models");
const { v4: uuidv4 } = require("uuid");

const createTask = async (req, res) => {
    try {
        const { title, description } = req.body

        // Check if title was passed
        if (!title) {
            return res.status(500).json({ message: "title parameter is required" })
        }

        // Check if title and description are empty string
        if (title === "") {
            return res.status(500).json({ message: "title parameter must not be an empty string" })
        }

        // Create task
        const taskId = uuidv4()

        const task = await Task.create({
            id: taskId,
            title: title,
            description: description
        })

        return res.status(200).json({ message: "Task created successfully.", task: task })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Failed to create Task" })
    }
}

const getTask = async (req, res) => {
    try {
        const { title, description } = req.body
        const {
            sortBy = 'createdAt',
            order = 'DESC',
            page = 1,
            limit = 10,
        } = req.query
        let where = {}

        if (title) where.title = title
        if (description) where.description = description

        // Calculate pagination
        const pageNum = parseInt(page, 10)
        const pageLimit = parseInt(limit, 10)
        const offset = (pageNum - 1) * pageLimit

        // Query the database
        const { rows: tasks, count: totalTasks } = await Task.findAndCountAll({
            where,
            order: [[sortBy, order]], // Sorting
            limit: pageLimit, // Pagination limit
            offset, // Pagination offset
        })

        // Calculate metadata
        const totalPages = Math.ceil(totalTasks / pageLimit)

        // Respond with the paginated data
        return res.status(200).json({
            tasks,
            pagination: {
                totalTasks,
                totalPages,
                currentPage: pageNum,
                pageSize: pageLimit,
            },
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Failed to get Tasks" })
    }
}

const updateTask = async (req, res) => {
    try {
        const { new_title, new_description } = req.body
        const { title } = req.params

        let updatedTaskData = {}

        if (new_title) updatedTaskData.title = new_title
        if (new_description) updatedTaskData.description = new_description

        // Check if task exists
        const task = await Task.findOne({ where: { title } });
        if (!task) {
            return res.status(500).json({ message: "Task not found" });
        }

        const [updatedTask] = await Task.update(updatedTaskData,
            {
                where: {
                    title: title
                }
            })

        const newTaskData = await Task.findOne({
            where: {
                title: new_title ? new_title : title
            }
        });

        return res.status(200).json({ message: "Table details updated Successfully!", data: newTaskData.dataValues });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Failed to update Task" })
    }
}

const deleteTask = async (req, res) => {
    try {
        const { title } = req.params;

        const task = await Task.destroy({
            where: {
                title: title
            }
        });

        // Check if the Task exists or was deleted
        if (task) {
            return res.status(200).json({ message: 'Task deleted successfully' })
        } else {
            return res.status(404).json({ message: 'Task not found' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Failed to delete Task" })
    }
}


module.exports = { createTask, getTask, updateTask, deleteTask }
