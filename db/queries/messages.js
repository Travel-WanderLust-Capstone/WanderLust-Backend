import db from "#db/client";

// Get all messages for one trip, oldest first.
// Joins users so each message includes the sender's name.
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

// Save a new message and return it.
export async function createMessage(tripId, userId, body) {
  const { rows } = await db.query(
    `INSERT INTO messages (trip_id, user_id, body)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [tripId, userId, body],
  );
  return rows[0];
}