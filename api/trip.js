import express from "express";
const router = express.Router();
export default router;

import {
  createTrip,
  getTrips,
  getTripById,
  getTripByUserId,
  deleteTrip,
} from "#db/queries/trip";

import requireUser from "#middleware/requireUser";

// router.use(requireUser); ***add in later

//GET array of trips
router.get("/", async (request, response) => {
  try {
    const trips = await getTrips();
    return response.send(trips);
  } catch (error) {
    console.error("Error inside getTrips():", error);
    return response.status(500).send("Server error ");
  }
});

//GET /trip:id
//get single trip by id
router.get("/:id", async (request, response) => {
  //Captures whatever is typed in the URL after "/" as the "id" as a string
  const { id } = request.params;

  //checks if trip exists. searches database for that trip
  //(Number(id)) Converts the string "42" to the number 42.
  const trip = await getTripById(Number(id)); //get id from param

  if (!trip) {
    return response.status(404).send(`Trip with id ${id} not found.`);
  } //if no trip, send 404 not found
});

//GET get trip by userId
//try/catch: JavaScripts's safety net for handling code execution errors
router.get("/:id/users/:userId", async (request, response) => {
  try {
    const { id, userId } = request.params;
    const tripId = Number(id);
    const selectedUserId = Number(userId);

    //if ID is NOT A NUMBER
    if (isNaN(tripId) || isNaN(userId)) {
      return response.status(400).send("Invalid trip id or user");
    }

    //check if Trip exists
    const trip = await getTripById(tripId);
    if (!trip) {
      return response.status(404).send("Trip not found.");
    }

    //fetch the users data
    //parameters passes both logged-in user ID (from requireUser) and the trip ID
    const users = await getTripByUserId(selectedUserId, tripId); //***insert "request.user.id," when you get login stuff */
    //if user doesn't exist
    if (!users) {
      return response.status(404).send("User not assigned to this trip.");
    }

    return response.send(users);
  } catch (error) {
    //Catch: Block If an error occurs anywhere inside try
    console.error("Error getting trip user", error);
    return response.status(500).send("Error" + error.message);
  } //return an HTTP response back: 500 Internal Server Error
});

//DELETE /trip/id
//user has to be authenticated
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    //Make sure ID is valid number
    if (isNaN(Number(id))) {
      return response.status(400).send("Invalid trip ID");
    }

    const trip = await deleteTrip(request.params.id); //passing the target ID extracted from the URL (request.params.id)
    //await pauses execution until deleteTrip finishes deleting the record from the database.

    //checks if trip exists, if not return NOT FOUND
    if (!trip) {
      return response.sendStatus(404);
    }

    //return deleted item or success
    response.status(200).send(trip); //If trip was found and deleted, this sends a status of 204 No Content
    //request succeeded and the resource was deleted
  } catch (error) {
    console.error("Error deleting trip", error);
    return response.status(500).send("Server error");
  }
});

//POST "/" create a new trip
//request holds the incoming data sent by the client
//response is used to send a answer back
//requireUser needs logged in user
router.post("/", async (request, response) => {
  //checks if request.body is missing or empty
  try {
    if (!request.body)
      return response.status(400).send("Request body required.");

    const { name, location_id, start_date, end_date, description } =
      request.body; //request.body contains the data sent in the body of the POST request

    //makes sure all fields are filled
    //if missing sends error message
    if (!name || !location_id || !start_date || !end_date || !description) {
      return response.status(400).send("All fields required.");
    }

    //check a valid start date and end date
    //"if this is true. If end date is before start date return and error."
    if (end_date < start_date) {
      return response.status(400).send("End date cannot be before start date");
    }

    //Calls the database function to insert the new trip into PostgreSQL.
    //pass variables inside {} object
    const trip = await createTrip({
      name,
      location_id,
      start_date,
      end_date,
      description,
    });

    response.status(201).send(trip); //201 = created
  } catch (error) {
    console.error("Error creating trip", error);
    return response.status(500).send("Error" + error.message);
  }
});
