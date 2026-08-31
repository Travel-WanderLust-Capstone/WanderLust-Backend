import express from "express";
import {
  getActivitiesByLocation,
  getPlacesByLocation,
  getLodgingByLocation,
  getPlaceDetails,
} from "#db/queries/places";
import { getLocationById, getLocations } from "#db/queries/locations";

const router = express.Router();
export default router;
router.get("/:id/activities/:id", async (req, res) => {
  const place = await getPlaceDetails(req.params.placeid);
  if (!place) return res.status(404).send("place not found");
  return res.send(place);
});

router.get("/:id/activities", async (req, res) => {
  const activity = await getActivitiesByLocation(req.params.id);
  if (!activity)
    return res.status(404).send("activities not found");
  return res.send(activity);
});

router.get("/:id/lodging/:id", async (req, res) => {
  const place = await getPlaceDetails(req.params.placeid);
  if (!place) return res.status(404).send("place not found");
  return res.send(place);
});

router.get("/:id/lodging", async (req, res) => {
  const lodging = await getLodgingByLocation(req.params.id);
  if (!lodging) return res.status(404).send("lodging not found");
  return res.send(lodging);
});

router.get("/:id/:placeid", async (req, res) => {
  const place = await getPlaceDetails(req.params.placeid);
  if (!place) return res.status(404).send("place not found");
  return res.send(place);
});

router.get("/:id", async (req, res) => {
  const location = await getLocationById(req.params.id);
  if (!location) return res.status(404).send("location Not Found");
  const places = await getPlacesByLocation(req.params.id);
  if (!places) return res.status(404).send("places not found");
  return res.send({ location, places });
});

router.get("/", async (req, res) => {
  const explore = await getLocations();
  if (!explore) return res.status(404).send("Locations not Found");
  return res.send(explore);
});
