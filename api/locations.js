import express from "express";
const router = express.Router();

import { getLocations, getLocationById } from "#db/queries/locations";
import { getTripByIdForUser } from "#db/queries/trip_details";

//TEST in POSTMAN

//GET /location sends array of new trip locations
router.get("/", async (request, response) => {
  const location = await getLocations();

  return response.send(location);
});

//GET location/:id sends locations specified by id
router.get("/:id", async (request, response) => {
  const { id } = request.params;

  //get location and check if exists
  const location = await getLocationById(Number(id));
  if (!location) {
    return response.status(404).send(`Location with id ${id} was not found`);
  } //if no location, send 404 NOT FOUND

  //then retrieve users trips that are in that location
  const trips = await getTripByUserId(Number(id));
  location.trips = trips;

  return response.send(location);
});

export default router;
