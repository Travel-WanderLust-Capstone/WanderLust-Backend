import db from "#db/client";

//GET trip by ID - TRIP DETAILS PAGE ON FRONTEND
//Find this single exact trip by its ID, and also give me the name of the location associated with that trip.
//Find the one trip whose ID matches the ID I give
export async function getTripById(id) {
  //function required ID

  //asks PostgreSQL to give you these columns from the trips table
  //then this asks for two pieces of information from the locations table:

  //locations.id AS location_id,
  //locations.name AS location_name =
  // Get name from the locations table, but call it location_name in result.

  //FROM trips: The main table I'm searching is trips

  //JOIN locations
  // ON trips.location_id = locations.id means:
  //Take the location_id stored on this trip and find the corresponding location in the locations table

  //WHERE trips.id = $1 means: Only give me the trip whose ID matches the ID I passed into the function

  const sql = `
SELECT
trips.id,
trips.name,
trips.start_date,
trips.end_date,
trips.description,
location.id AS location_id,
location.name AS location
FROM trips  
JOIN location
ON trips.location_id = location.id
WHERE trips.id = $1;
`;

  const { rows } = await db.query(sql, [id]);
  // { rows } grab only the rows property

  return rows[0];
}

//GET /fetches users that belong to trip - TRIP DETAILS PAGE ON FRONT END
//joins the trip table with a junction table named trips_users.
//Does this specific user belong to this specific trip? If yes, give me that trip.
export async function getTripByIdForUser(userId, tripId) {
  const sql =
    //retrieve all columns from the trip table
    //DISTINCT prevents duplicate trip rows from being returned if a trip matches the query conditions more than once.
    //FROM trip: trip is primary table to query
    `
SELECT DISTINCT trips.*
FROM trips 
    JOIN trips_users
    ON trips.id = trips_users.trip_id
WHERE trips_users.user_id = $1
AND trips.id = $2
`;
  //JOIN & ON: joins the trip table with the trips_users link table
  //main trip's id matches the trip_id column inside trips_users.
  //This lets us check membership

  //WHERE & AND:
  //trips_users.user_id = $1: user is matching $1 (the userId) is linked to this trip.
  //trip.id = $2: Ensures the trip's ID matches $2

  //{ rows: [trip] } gets rows and grabs first element from array
  const {
    rows: [trip],
  } = await db.query(sql, [userId, tripId]);
  return trip;
}

//WHO are all the users going on this trip?
export async function getUsersByTripId(tripId) {
  const sql = `
  SELECT 
  users.id,
  users.name
  FROM trips_users
  JOIN users
    ON trips_users.user_id = users.id
  WHERE trips_users.trip_id = $1
   `;
  const { rows } = await db.query(sql, [tripId]);

  return rows;
}

export async function addUserToTrip(tripId, userId, message) {
  const sql = `
    INSERT INTO trips_users (
    trip_id,
    user_id,
    message
    )
    VALUES ($1, $2, $3)
    RETURNING *;
    `;
  const {
    rows: [tripUser],
  } = await db.query(sql, [tripId, userId, message]);
  return tripUser;
}
