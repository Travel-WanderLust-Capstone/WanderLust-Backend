import db from "#db/client";

export async function getMessagesByTrip(tripId) {
  const { rows } = await db.query(
    `SELECT m.*, u.name AS sender_name
       FROM messages m
       JOIN users u ON u.id = m.user_id
      WHERE m.trip_id = $1
      ORDER BY m.created_at ASC`,
    [tripId],
  );
  return rows;
}

export async function createMessage(tripId, userId, body, mediaUrl) {
  const { rows } = await db.query(
    `INSERT INTO messages (trip_id, user_id, body, media_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [tripId, userId, body, mediaUrl || null],
  );
  return rows[0];
}