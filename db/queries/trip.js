import db from "#db/client";

//GET /trips returns single new trip created
export async function createTrip({
  name,
  location_id,
  start_date,
  end_date,
  description,
}) {
  const sql = `
INSERT INTO trips
(name, location_id, start_date, end_date, description)
VALUES
($1, $2, $3, $4, $5)
RETURNING *
`;
  //destructuring [trip] picks only the first element from the array of inserted rows returned by the query.
  const {
    rows: [trip],
  } = await db.query(sql, [
    name,
    location_id,
    start_date,
    end_date,
    description,
  ]);
  return trip;
}

//GET /trip
export async function getTrips() {
  const sql = `
    SELECT *
    FROM trips
    `;
  const { rows } = await db.query(sql);
  return rows; //returns all not just first one
}

//delete trip with given id
//return undefined if trip with id doesn't exist
export async function deleteTrip(id) {
  const sql = `
  DELETE from trips
  WHERE id = $1
  RETURNING *;
  `;
  const {
    rows: [trip],
  } = await db.query(sql, [id]);
  return trip;
}

export async function getTripByIdForUser(userId) {
  const sql = `
    SELECT trips.*
    FROM trips
    JOIN trips_users
      ON trips.id = trips_users.trip_id
    WHERE trips.id = $1
      AND trips_users.user_id = $2;
  `;

  const {
    rows: [trip],
  } = await db.query(sql, [userId]);

  return trip;
}

//Add trip user
export async function addTripUser(tripId, userId) {
  const sql = `
    INSERT INTO trips_users
      (trip_id, user_id, message)
    VALUES
      ($1, $2, $3)
    RETURNING *;
  `;

  const {
    rows: [tripUser],
  } = await db.query(sql, [tripId, userId, "Trip creator"]);

  return tripUser;
}

// GET all trips assigned to one user
export async function getTripsByUserId(userId) {
  const sql = `
    SELECT trips.*
    FROM trips
    JOIN trips_users
      ON trips.id = trips_users.trip_id
    WHERE trips_users.user_id = $1
    ORDER BY trips.start_date;
  `;

  const { rows } = await db.query(sql, [userId]);

  return rows;
}
