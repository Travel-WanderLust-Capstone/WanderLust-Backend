import db from "#db/client";

//returns a created single new trip location
export async function createLocation(name, description) {
  const sql = `
INSERT INTO location
(name, description)
VALUES
($1, $2)
RETURNING *
`;
  const { rows } = await db.query(sql, [name, description]);
  return rows[0];
}

// //Get all locations
//get every column" and FROM location means "from the table named location".
export async function getLocations() {
  const sql = `
SELECT * 
FROM location
`;
  const { rows: location } = await db.query(sql);
  return location;
}

//may not NEED
export async function getLocationById(id) {
  const sql = `
    SELECT *
    FROM location
    WHERE iid = $1;
    `;
  const { rows } = await db.query(sql, [id]);
  return rows[0];
}
