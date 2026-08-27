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
