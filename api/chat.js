import express from "express";
const router = express.Router();
export default router;

import { getMessagesByTrip, createMessage } from "#db/queries/messages";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

router
  .route("/:tripId/chat")
  // GET /trips/:tripId/chat  → load the whole thread
  .get(async (req, res) => {
    const messages = await getMessagesByTrip(req.params.tripId);
    res.send(messages);
  })
     // POST /trips/:tripId/chat  → send a new message
  .post(requireBody(["body"]), async (req, res) => {
    const userId = req.user?.id ?? 1;
    const { body, mediaUrl } = req.body;
    const message = await createMessage(req.params.tripId, userId, body, mediaUrl);
    res.status(201).send(message);
  });