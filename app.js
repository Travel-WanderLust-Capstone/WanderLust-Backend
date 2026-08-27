import express from "express";
const app = express();
export default app;

import usersRouter from "#api/users";
import locationRouter from "#api/locations";
import tripRouter from "#api/trip";
import taskRouter from "#api/tasks";
import getUserFromToken from "#middleware/getUserFromToken";
import handlePostgresErrors from "#middleware/handlePostgresErrors";
import cors from "cors";
import morgan from "morgan";

app.use(cors({ origin: process.env.CORS_ORIGIN ?? /localhost/ }));

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(getUserFromToken);

app.get("/", (req, res) => res.send("Hello, World!"));

//Routes = "path", "file"
//need to use routes and connect to router (characterRouter).
//export default so you can name whatever you want
app.use("/users", usersRouter);
app.use("/location", locationRouter);
app.use("/trips", tripRouter);
app.use("/trips", taskRouter); //:id/tasks follows "/trips"
app.use("/tasks", taskRouter);

app.use(handlePostgresErrors);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
