const express = require("express")
const { createTask, getTask, updateTask, deleteTask } = require("./controllers.js")

const router = express.Router()

router.post('/', createTask)
router.get('/', getTask)
router.put('/:title', updateTask)
router.delete('/:title', deleteTask)


module.exports = router;
