import express from "express";
const router = express.Router();
export default router;

import {
  getTasksByTripId,
  assignTaskToUser,
  createTask,
} from "#db/queries/tasks";

//GET api/trips/:id/tasks
router.get("/:id/tasks", async (request, response) => {
  try {
    const tasks = await getTasksByTripId(request.params.id);
    response.send(tasks);
  } catch (error) {
    console.error("Error getting tasks for trip", error);
    return response.status(500).send("Server error ");
  }
});

//PATCH = update
router.patch("/:taskId/assign", async (request, response) => {
  try {
    const { taskId } = request.params;
    const { userId } = request.body;

    const updatedTask = await assignTaskToUser(taskId, userId);

    return response.send(updatedTask);
  } catch (error) {
    console.error("Error assigning task", error);
    return response.status(500).send("Error assigning task");
  }
});

//POST CREATE TASK
router.post("/:id/tasks", async (request, response) => {
  try {
    const tripId = request.params.id;

    const { title, dueDate, userId, completed, assigned_to } = request.body;

    const newTask = await createTask(title, dueDate, tripId, userId);

    return response.status(201).send(newTask);
  } catch (error) {
    console.error("Error creating task", error);

    return response.status(500).send("Error creating task");
  }
});
