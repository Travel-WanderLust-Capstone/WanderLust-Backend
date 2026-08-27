import express from "express";
const router = express.Router();
export default router;

import {
  getTasksByTripId,
  assignTaskToUser,
  createTask,
  deleteTask,
} from "#db/queries/tasks";

//router receives information from the frontend
//pulls what it needs from request.params and/or request.body
// calls your database query function, and sends the result back with response

//GET REQUEST api/trips/:id/tasks
//Get all tasks belonging to a specific trip.
//I want to retrieve/read information
router.get("/:id/tasks", async (request, response) => {
  //async: take time
  //request: information coming into your server.
  //repsponse: what you use to send information back to the frontend

  try {
    //run code, if something wrong go to catch
    const tasks = await getTasksByTripId(request.params.id); //req.par.id gets tripId from URL
    //await: wait until POSTGREsql gets tasks

    response.send(tasks); //sends tasks back
  } catch (error) {
    console.error("Error getting tasks for trip", error);
    return response.status(500).send("Server error ");
  }
});

//PATCH = update
//change who is assigned to existing task
router.patch("/:taskId/assign", async (request, response) => {
  try {
    //getting info from request body
    const { taskId } = request.params;
    const { userId } = request.body; //getting info from request body
    //request body: the data sent by client (web browser or app) to server inside an HTTP request message

    //calls function
    const updatedTask = await assignTaskToUser(taskId, userId);

    return response.send(updatedTask); // Sends the updated task back to the frontend
  } catch (error) {
    console.error("Error assigning task", error);
    return response.status(500).send("Error assigning task");
  }
});

//DELETE EXISTING TASK
//http delete request
router.delete("/tasks/:taskId", async (request, response) => {
  try {
    const { taskId } = request.params; //get task

    const deletedTask = await deleteTask(taskId); //call database function

    //if there is not a deleted task return message
    if (!deletedTask) {
      return response.status(400).send("Task not found.");
    }

    return response.send(deletedTask);
  } catch (error) {
    console.error("Error deleting task", error);

    return response.status(500).send("Error deleting task."); //send http status code
  }
});

//POST CREATE TASK
//CREATE
router.post("/:id/tasks", async (request, response) => {
  try {
    const tripId = request.params.id;

    //pull info from request body
    const { title, dueDate, userId, completed, assigned_to } = request.body;

    //calls database query function
    //creates task and sends it back
    const newTask = await createTask(title, dueDate, tripId, userId);

    return response.status(201).send(newTask); //successfully created
    //sends the newly created task back to React
  } catch (error) {
    console.error("Error creating task", error);

    return response.status(500).send("Error creating task");
  }
});
