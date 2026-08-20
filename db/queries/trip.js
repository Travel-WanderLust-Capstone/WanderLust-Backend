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

//GET trip by ID
//fetches a single trip from the database using its ID
export async function getTripById(id) {
  const sql = `
SELECT *
FROM trips
WHERE id = $1
`;
  //Filters the results to only include rows where the id column matches the first parameter ($1).
  //Using $1 prevents SQL injection.

  //Send the query and wait for the database response
  //Pause here, send the query, and wait until the database gives us back a response."
  //Passing [id] safely replaces $1
  const {
    rows: [trip],
  } = await db.query(sql, [id]);
  // { rows } grab only the rows property
  //[trip] (Array Destructuring):
  //Even when searching for a single ID, database queries always return an array (a list) of results.
  //[trip] grabs first element of that array (rows[0]) and saves it to variable => trip

  return trip;
}

//GET /fetches trips that belong to users
//joins the trip table with a junction table named trips_users.
export async function getTripByUserId(userId, tripId) {
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
