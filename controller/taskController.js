const Task = require("../model/taskModel");

// --- CREATE CONTROLLER ---
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, completed } =
      req.body;

    if (!title || title.trim() === "") {
      res.status(400).json({ message: "Title is required!" });
    }

    if (!description || description.trim() === "") {
      res.status(400).json({ message: "Description is required!" });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      completed,
      user: req.user._id,
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    console.log("Error in createTask: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

// --- GET ALL TASK CONTROLLER ---
const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      res.status(400).json({ message: "User not found!" });
    }

    if (userId) {
      const tasks = await Task.find({ user: userId });
      res.status(200).json({
        length: tasks.length,
        tasks,
      });
    }
  } catch (error) {
    console.log("Error in getTasks: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

// --- GET SINGLE TASK CONTROLLER ---
const getSingleTask = async (req, res) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Please provide a task id" });
    }

    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({ message: "Task not found!" });
    }

    if (!task.user.equals(userId)) {
      res.status(401).json({ message: "Not authorized!" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.log("Error in getTask: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

// --- UPDATE TASK CONTROLLER ---
const updateTask = async (req, res) => {
  try {
    const userId = req.user._id;

    const { id, title, description, dueDate, priority, status, completed } =
      req.body;

    if (!id) {
      return res.status(400).json({ message: "Please provide a task id" });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }

    if (!task.user.equals(userId)) {
      return res.status(401).json({ message: "Not authorized!" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.completed = completed !== undefined ? completed : task.completed;

    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    console.log("Error in updateTask: ", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// --- DELETE CONTROLLER ---
const deleteTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({ message: "Task not found!" });
    }

    // check if the user is the owner of the task
    if (!task.user.equals(userId)) {
      res.status(401).json({ message: "Not authorized!" });
    }

    await Task.findByIdAndDelete(id);

    return res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    console.log("Error in deleteTask: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

// --- DELETE ALL CONTROLLER ---
const deleteAllTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({ user: userId });

    if (!tasks) {
      res.status(404).json({ message: "No tasks found!" });
    }

    // check if the user is the owner of the task
    if (!tasks.user.equals(userId)) {
      res.status(401).json({ message: "Not authorized!" });
    }

    await Task.deleteMany({ user: userId });

    return res.status(200).json({ message: "All tasks deleted successfully!" });
  } catch (error) {
    console.log("Error in deleteAllTasks: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getSingleTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
};
