import db from "#db/client";
import bcrypt from "bcrypt";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  //await createUser("foo", "bar");
  const hashedPassword1 = await bcrypt.hash("hellodarknessmyoldfriend", 10);
  const hashedPassword2 = await bcrypt.hash("ivecometotalktoyouagain", 10);
  const hashedPassword3 = await bcrypt.hash(
    "aboutthevisionssoftlycreeping",
    10,
  );
  const user1 = await db.query(
    `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`,
    ["Kylan Gentry", "k.gentry@email.com", hashedPassword1],
  );
  const user2 = await db.query(
    `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`,
    ["Amelie Griffith", "a.griffith@email.com", hashedPassword2],
  );
  const user3 = await db.query(
    `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`,
    ["Lucian Lee", "l.lee@email.com", hashedPassword3],
  );
  //trips
  const trip1 = await db.query(
    `
  INSERT INTO trips (name, destination, start_date, end_date, description)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`,
    [
      "Vacation",
      "Rome, Italy",
      "2026-08-13",
      "2026-08-21",
      "Family trip to Rome!! gonna go sight-seeing, and find some local cuisine!",
    ],
  );

  const trip2 = await db.query(
    `
  INSERT INTO trips (name, destination, start_date, end_date, description)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`,
    [
      "Business Trip",
      "New York, New York",
      "2026-10-03",
      "2026-10-10",
      "Business trip to New York. we have some extra time for activities outside of meetings",
    ],
  );

  const trip3 = await db.query(
    `
  INSERT INTO trips (name, destination, start_date, end_date, description)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`,
    [
      "Bachelorette Trip!!",
      "Las Vegas, Nevada",
      "2027-02-15",
      "2027-02-23",
      "Hey girls!! We're going to Vegas for my bachelorette party!! Make sure you bring a swimsuit and plenty of money for the slots!",
    ],
  );

  //tasks
  const task1_1 = await db.query(
    `
  INSERT INTO tasks (title, due_date, completed, trip_id, assigned_to)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING *;`,
    ["book hotel", "2026-08-01", true, 1, 1],
  );

  const task1_2 = await db.query(
    `
  INSERT INTO tasks (title, due_date, completed, trip_id, assigned_to)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING *;`,
    ["plan activity", "2026-08-14", false, 1, 2],
  );

  const task1_3 = await db.query(
    `
  INSERT INTO tasks (title, due_date, completed, trip_id, assigned_to)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING *;`,
    ["plan activity", "2026-08-14", true, 1, 3],
  );

  const task2_1 = await db.query(
    `INSERT INTO tasks (title, due_date, completed, trip_id, assigned_to)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING *;`,
    ["Book Hotel", "2026-10-01", false, 2, 3],
  );
  const task2_2 = await db.query(
    `INSERT INTO tasks (title, due_date, completed, trip_id, assigned_to)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING *;`,
    ["Book activity", "2026-10-03", true, 2, 1],
  );
  const task2_3 = await db.query(
    `INSERT INTO tasks (title, due_date, completed, trip_id, assigned_to)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING *;`,
    ["Book group activity", "2026-10-03", false, 2, 2],
  );

  const task3_1 = await db.query(
    `INSERT INTO tasks (title, due_date, completed, trip_id, assigned_to)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING *;`,
    ["Book Hotel", "2027-01-20", false, 3, 2],
  );
  const task3_2 = await db.query(
    `INSERT INTO tasks (title, due_date, completed, trip_id, assigned_to)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING *;`,
    ["Book Spa visit", "2027-02-01", false, 3, 3],
  );
  const task3_3 = await db.query(
    `INSERT INTO tasks (title, due_date, completed, trip_id, assigned_to)
  VALUES ($1,$2,$3,$4,$5)
  RETURNING *;`,
    ["Reserve table", "2027-02-10", false, 3, 1],
  );

  //selections
  const selection1 = await db.query(
    `
  INSERT INTO selections (trip_id, name, type, description, destination)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`,
    [
      1,
      "the Sleep Inn",
      "Lodging",
      "hotel stay from 08/13 to 8/21",
      "Rome, Italy",
    ],
  );
  const selection2 = await db.query(
    `
  INSERT INTO selections (trip_id, name, type, description, destination)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`,
    [
      1,
      "Sight seeing",
      "Activity",
      "We are scheduled to go out on the 3rd day to see the colosseum",
      "Rome, Italy",
    ],
  );
  const selection3 = await db.query(
    `
  INSERT INTO selections (trip_id, name, type, description, destination)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`,
    [
      2,
      "Team Dinner",
      "Activity",
      "We are booked to celebrate hard work completed on the last day of the trip. Reservation is at 5pm",
      "New York, NY",
    ],
  );

  //trips_users
  await db.query(
    `
  INSERT INTO trips_users (trip_id, user_id, message)
  VALUES ($1, $2, $3)
  RETURNING *;`,
    [1, 1, "Family Trip"],
  );
  await db.query(
    `
  INSERT INTO trips_users (trip_id, user_id, message)
  VALUES ($1, $2, $3)
  RETURNING *;`,
    [1, 2, "Family Trip"],
  );
  await db.query(
    `
  INSERT INTO trips_users (trip_id, user_id, message)
  VALUES ($1, $2, $3)
  RETURNING *;`,
    [1, 3, "Family Trip"],
  );
  await db.query(
    `
  INSERT INTO trips_users (trip_id, user_id, message)
  VALUES ($1, $2, $3)
  RETURNING *;`,
    [2, 1, "Business Trip"],
  );
  await db.query(
    `
  INSERT INTO trips_users (trip_id, user_id, message)
  VALUES ($1, $2, $3)
  RETURNING *;`,
    [2, 3, "Business Trip"],
  );
  await db.query(
    `
  INSERT INTO trips_users (trip_id, user_id, message)
  VALUES ($1, $2, $3)
  RETURNING *;`,
    [3, 2, "Bachelorette Trip"],
  );
}
