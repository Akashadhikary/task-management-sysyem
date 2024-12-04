import Task from "../models/Task.js";

//Create new task
export const newTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

//Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//Search task
export const searchTask = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required." });
    }

    const tasks = await Task.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in search route:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

//Get task by id
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send("Task not found");
    res.status(200).send(task);
  } catch (err) {
    console.error("Error fetching task by ID:", err.message);
    res.status(500).send(err.message);
  }
};

//Update task by id
export const updateTaskById = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).send("Task not found");
    res.status(200).send(task);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

//Delete task by id
export const deleteTaskById = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).send("Task not found");
    res.status(200).send("Task deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//Mark task as complete by id
export const markTaskAsCompleted = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: "Completed" },
      { new: true }
    );
    if (!task) return res.status(404).send("Task not found");
    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
