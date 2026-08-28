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

  //locations
  const location1 = await db.query(
    `
  INSERT INTO location (name, description, image_url)
  VALUES ($1, $2, $3)
  RETURNING *;`,
    [
      "Rome, Italy",
      "Rome is the capital city of Italy. Known as the Eternal City, it blends nearly 3,000 years of history with busy modern life. It sits on the Tiber River in the central part of the country and surrounds Vatican City.",
      "https://images.pexels.com/photos/33562162/pexels-photo-33562162.jpeg",
    ],
  );

  const location2 = await db.query(
    `
    INSERT INTO location (name, description, image_url)
    VALUES ($1, $2, $3)
    RETURNING *;`,
    [
      "New York, NY",
      "New York City is the most populous city in the United States. Located in southeastern New York State, it sits at the mouth of the Hudson River on a major natural harbor. The city includes five boroughs: Manhattan, Brooklyn, Queens, the Bronx, and Staten Island. It serves as a global hub for finance, culture, and media.",
      "https://images.pexels.com/photos/28279107/pexels-photo-28279107.jpeg",
    ],
  );
  const location3 = await db.query(
    `
    INSERT INTO location (name, description, image_url)
    VALUES ($1, $2, $3)
    RETURNING *;`,
    [
      "Las Vegas, NV",
      "Las Vegas is a major resort city in the Mojave Desert of Nevada. Known as the Entertainment Capital of the World, it is famous for its vibrant nightlife, luxury casino-hotels, fine dining, and 24-hour excitement",
      "https://images.pexels.com/photos/18041018/pexels-photo-18041018.jpeg",
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
    [
      "Sight-Seeing",
      "activity",
      "explore all Rome has to offer, enjoy the beautiful architecture.",
      1,
    ],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "Fine Dining Restaurant",
      "activity",
      "Enjoy meals prepared by our professional chefs. 5-star service",
      1,
    ],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    ["Wine-Tasting", "activity", "Try our delicious wines!", 1],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "Tony's Hot Dog Stand",
      "activity",
      "Best 'dogs this side of the Hudson River!",
      2,
    ],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "Central Park to Lady Liberty Tour",
      "activity",
      "You're Walkin' Here! Enjoy the sights!",
      2,
    ],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "Central Perk",
      "activity",
      "Find your own group of F·R·I·E·N·D·S at this state-of-the-art coffee shop!",
      2,
    ],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "Spa Day of The Desert",
      "activity",
      "Time to relax! Enjoy our adult refreshments as we massage the daylight outta you.",
      3,
    ],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "Casino!",
      "activity",
      "Come have fun! Don't mind the bright lights, we got you covered! Who needs sunglasses with THIS good of a time, right?",
      3,
    ],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "Mob Museum",
      "activity",
      "This visit to the ol' courthouse won't affect your record",
      3,
    ],
  );
  //lodging
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "Hotel Albergo Abruzzi",
      "lodging",
      "The family run Hotel Albergo Abruzzi Rome is a 3-star hotel accommodation. Our address is Piazza della Rotonda n.69- 00186 Rome, Italy",
      1,
    ],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "Sophie Terrace Hotel",
      "lodging",
      "The Sophie Terrace Hotel is a newly built 3-star structure. Located at Via Principe Amedeo 6 - 00185 Roma",
      1,
    ],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "Daplace Locanda Piazza del Popolo",
      "lodging",
      "Located close to Piazza del Popolo and the Flaminio Metro Station, Locanda Piazza del Popolo offers modern rooms. Explore Rome's historic center with ease.",
      1,
    ],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "Hyatt Grand Central",
      "lodging",
      "Hyatt Grand Central New York is connected to Grand Central Station, which is convenient for travel. Located on 42nd Street of Midtown Manhattan",
      2,
    ],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "The Manhattan at Times Square Hotel",
      "lodging",
      "Located at 790 7th Avenue, this location is a 5-10 minute walk from Times Square, Broadway theaters, and Central Park.",
      2,
    ],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "OYO Times Square",
      "lodging",
      "Modern rooms in the city that never sleeps",
      2,
    ],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "Caesars Palace",
      "lodging",
      "Luxury hotel located on the Las Vegas Strip. Known for it's casino, entertainment, and dining options",
      3,
    ],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "MGM Grand",
      "lodging",
      "The MGM Grand Garden Arena is connected to the hotel, where you can find entertainment",
      3,
    ],
  );
  await db.query(
    `
  INSERT INTO place (name, type, description, location_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`,
    [
      "Mandalay Bay",
      "lodging",
      "Located at 3950 S Las Vegas Blvd, this hotel has a real sand and wave pool, along with the Shark Reef Aquarium",
      3,
    ],
  );

  //selections
  const selection1 = await db.query(
    `
  INSERT INTO selections (trip_id, places_id)
  VALUES ($1, $2)
  RETURNING *;`,
    [1, 2],
  );
  const selection2 = await db.query(
    `
  INSERT INTO selections (trip_id, places_id)
  VALUES ($1, $2)
  RETURNING *;`,
    [1, 3],
  );
  const selection3 = await db.query(
    `
  INSERT INTO selections (trip_id, places_id)
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
}
