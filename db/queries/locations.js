import db from "#db/client";

export async function getLocations() {
  const sql = `SELECT name, id FROM location;`;
  const { rows } = await db.query(sql);
  return rows;
}

export async function getLocationById(id) {
  const sql = `SELECT * FROM location WHERE id = $1;`;
  const { rows } = await db.query(sql, [id]);
  return rows;
}
