import db from "#db/client";
import bcrypt from "bcrypt";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  //see Block6.04 Schemas/Seeding
  //ran seed. Recieved an error that there were duplicate emails.
  //emails has a unique constraint.
  //Truncate clears old data before you write new data
  await db.query(`
    TRUNCATE TABLE trips_users, selections, tasks, place, trips, location, users 
    RESTART IDENTITY CASCADE;
  `);


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

  //locations
  const location1 = await db.query(
    `
  INSERT INTO location (name, description)
  VALUES ($1, $2)
  RETURNING *;`,
    [
      "Rome, Italy",
      "Rome is the capital city of Italy. Known as the Eternal City, it blends nearly 3,000 years of history with busy modern life. It sits on the Tiber River in the central part of the country and surrounds Vatican City.",
    ],
  );

  const location2 = await db.query(
    `
    INSERT INTO location (name, description)
    VALUES ($1, $2)
    RETURNING *;`,
    [
      "New York, NY",
      "New York City is the most populous city in the United States. Located in southeastern New York State, it sits at the mouth of the Hudson River on a major natural harbor. The city includes five boroughs: Manhattan, Brooklyn, Queens, the Bronx, and Staten Island. It serves as a global hub for finance, culture, and media.",
    ],
  );
  const location3 = await db.query(
    `
    INSERT INTO location (name, description)
    VALUES ($1, $2)
    RETURNING *;`,
    [
      "Las Vegas, NV",
      "Las Vegas is a major resort city in the Mojave Desert of Nevada. Known as the Entertainment Capital of the World, it is famous for its vibrant nightlife, luxury casino-hotels, fine dining, and 24-hour excitement",
    ],
  );

  //trips
  const trip1 = await db.query(
    `
  INSERT INTO trips (name, location_id, start_date, end_date, description)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`,
    [
      "Vacation",
      1,
      "2026-08-13",
      "2026-08-21",
      "Family trip to Rome!! gonna go sight-seeing, and find some local cuisine!",
    ],
  );

  const trip2 = await db.query(
    `
  INSERT INTO trips (name, location_id, start_date, end_date, description)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`,
    [
      "Business Trip",
      2,
      "2026-10-03",
      "2026-10-10",
      "Business trip to New York. we have some extra time for activities outside of meetings",
    ],
  );

  const trip3 = await db.query(
    `
  INSERT INTO trips (name, location_id, start_date, end_date, description)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`,
    [
      "Bachelorette Trip!!",
      3,
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

  //activities
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["activity1", "activity", "its an activity", 1],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["activity2", "activity", "its an activity", 1],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["activity3", "activity", "its an activity", 1],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["activity1", "activity", "its an activity", 2],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["activity2", "activity", "its an activity", 2],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["activity3", "activity", "its an activity", 2],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["activity1", "activity", "its an activity", 3],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["activity2", "activity", "its an activity", 3],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["activity3", "activity", "its an activity", 3],
  );

  //lodging
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["lodging1", "lodging", "its a place to sleep", 1],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["lodging2", "lodging", "its a place to sleep", 1],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["lodging3", "lodging", "its a place to sleep", 1],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["lodging1", "lodging", "its a place to sleep", 2],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["lodging2", "lodging", "its a place to sleep", 2],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["lodging3", "lodging", "its a place to sleep", 2],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["lodging1", "lodging", "its a place to sleep", 3],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["lodging2", "lodging", "its a place to sleep", 3],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["lodging3", "lodging", "its a place to sleep", 3],
  );

  //selections
  const selection1 = await db.query(
    `
  INSERT INTO selections (trip_id, place_id)
  VALUES ($1, $2)
  RETURNING *;`,
    [1, 2],
  );
  const selection2 = await db.query(
    `
  INSERT INTO selections (trip_id, place_id)
  VALUES ($1, $2)
  RETURNING *;`,
    [1, 3],
  );
  const selection3 = await db.query(
    `
  INSERT INTO selections (trip_id, place_id)
  VALUES ($1, $2)
  RETURNING *;`,
    [2, 2],
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


      //give the demo chatters my team's names
  await db.query(`UPDATE users SET name = 'Casey'  WHERE id = 1;`);
  await db.query(`UPDATE users SET name = 'Peyton' WHERE id = 2;`);
  await db.query(`UPDATE users SET name = 'Asher'  WHERE id = 3;`);

  //messages (trip chat)
  await db.query(
    `INSERT INTO messages (trip_id, user_id, body) VALUES ($1, $2, $3) RETURNING *;`,
    [1, 1, "Booked the hotel! ⭐⭐⭐"],
  );
  await db.query(
    `INSERT INTO messages (trip_id, user_id, body) VALUES ($1, $2, $3) RETURNING *;`,
    [1, 2, "what time is our flight?"],
  );
  await db.query(
    `INSERT INTO messages (trip_id, user_id, body) VALUES ($1, $2, $3) RETURNING *;`,
    [1, 3, "landing at 3pm, i'll add it to tasks"],
  );
}