import db from "#db/client";

export async function getPlacesByLocation(location_id) {
  const sql = `SELECT * FROM place WHERE location_id = $1;`;
  const { rows } = await db.query(sql, [location_id]);
  return rows;
}

export async function getActivitiesByLocation(location_id) {
  const sql = `SELECT * FROM place WHERE location_id = $1 AND type = $2;`;
  const { rows } = await db.query(sql, [location_id, "activity"]);
  return rows;
}

export async function getLodgingByLocation(location_id) {
  const sql = `SELECT * FROM place WHERE location_id = $1 AND type = $2;`;
  const { rows } = await db.query(sql, [location_id, "lodging"]);
  return rows;
}

export async function getPlaceDetails(place_id) {
  const sql = `SELECT * FROM place WHERE id = $1;`;
  const { rows } = await db.query(sql, [place_id]);
  return rows;
}
