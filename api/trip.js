import express from "express";
const router = express.Router();
export default router;

import { createTrip, getTrips, deleteTrip } from "#db/queries/trip";
import {
  getTripById,
  getTripByIdForUser,
  getUsersByTripId,
  addUserToTrip,
} from "#db/queries/trip_details";

import requireUser from "#middleware/requireUser"; //****HOLD on this

// router.use(requireUser); ***HOLD. add in later

//GET array of trips
//CREATE NEW TRIP PAGE
router.get("/", async (request, response) => {
  try {
    const trips = await getTrips();
    return response.send(trips);
  } catch (error) {
    console.error("Error getting trip", error);
    return response.status(500).send("Server error ");
  }
});

//GET /trip:id
//TRIP DETAILS PAGE
//get single trip by id
//When someone sends a GET request to this URL, run this function
//URL contains a variable called id
router.get("/:id", async (request, response) => {
  //async =function can wait for asynchronous operations
  //request: contains information about what the frontend/client sent to your backend.
  //response: is what you use to send something back to the frontend/client.

  try {
    //checks if trip exists. searches database for that trip
    //req.params.id = gets the ID from the URL
    const trip = await getTripById(request.params.id); //Express stores URL parameters
    //Give me the ID that was placed in the URL^^
    console.log("Trip result:", trip);

    //if no trip, send 404 not found
    if (!trip) {
      return response.status(404).send("Trip not found.");
    }

    //GET all users connected to this trip
    const users = await getUsersByTripId(request.params.id);
    console.log("Users result:", users);

    return response.send({ ...trip, users }); //Send this trip back to whoever requested it
  } catch (error) {
    //print error in backend
    console.error("Error getting trip.", error);

    //tell frontend that something went wrong
    return response.status(500).send("Error getting trip.");
  }
});

//GET get trip by userId
//TRIP DETAILS PAGE
//try/catch: JavaScripts's safety net for handling code execution errors
router.get("/:id/users/:userId", async (request, response) => {
  try {
    const { id, userId } = request.params;
    const tripId = Number(id);
    const selectedUserId = Number(userId);

    //if ID is NOT A NUMBER
    if (isNaN(tripId) || isNaN(selectedUserId)) {
      return response.status(400).send("Invalid trip id or user");
    }

    //check if Trip exists
    const trip = await getTripById(tripId);
    if (!trip) {
      return response.status(404).send("Trip not found.");
    }

    //fetch the users data
    //parameters passes both logged-in user ID (from requireUser) and the trip ID
    const users = await getTripByIdForUser(selectedUserId, tripId); //***insert "request.user.id," when you get login stuff */
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
//TRIP DETAILS PAGE
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

//POST ADD USER To Trip
router.post("/:id/users", async (request, response) => {
  try {
    const tripId = request.params.id;

    const { userId, message } = request.body;

    const newTraveler = await addUserToTrip(tripId, userId, message);

    return response.status(201).send(newTraveler);
  } catch (error) {
    console.error("Error adding traveler", error);

    return response.status(500).send("Error adding traveler");
  }
});
