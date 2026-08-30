import express from "express";
const router = express.Router();
export default router;
import { createUser, getUserByEmailAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(requireBody(["name", "email", "password"]), async (req, res) => {
    const { name, email, password } = req.body;
    const user = await createUser(name, email, password);
    const token = createToken({
      id: user.id,
    });
    res.status(201).send(token);
  });
router
  .route("/login")
  .post(requireBody(["email", "password"]), async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmailAndPassword(email, password);
    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }
    const token = createToken({
      id: user.id,
    });
    res.send(token);
  });
