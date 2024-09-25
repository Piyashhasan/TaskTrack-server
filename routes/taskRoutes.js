const express = require("express");
const {
  createTask,
  getTasks,
  getSingleTask,
  updateTask,
  deleteTask,
} = require("../controller/taskController");
const protectRoute = require("../middleware/jwtValidation");

const taskRouter = express.Router();

// --- route endPoint ---
taskRouter
  .post("/create", protectRoute, createTask)
  .get("/", protectRoute, getTasks)
  .get("/:id", protectRoute, getSingleTask)
  .patch("/update", protectRoute, updateTask)
  .delete("/:id", protectRoute, deleteTask);

module.exports = taskRouter;
