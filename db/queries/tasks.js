import db from "#db/client";

//CREATE TASK
export async function createTask(title, dueDate, tripId, userId) {
  const sql = `
    INSERT INTO tasks (
      title,
      due_date,
      completed,
      trip_id,
      assigned_to
    )
    VALUES ($1, $2, false, $3, $4)
    RETURNING *;
  `;

  const {
    rows: [task],
  } = await db.query(sql, [title, dueDate, tripId, userId]);

  return task;
}

//GET tasks assigned to user
//JOIN tasks to users table to return the user's name instead of id
export async function getTasksByTripId(tripId) {
  //all of the "tasks..." get info from tasks table
  //"users.name" gets persons name from users table
  //AS assigned to: when you return this info, call property "assigned_to"
  //instead of id number, it will return the actual name
  const sql = `
SELECT
tasks.id,
tasks.title,
tasks.due_date,
tasks.completed,
tasks.trip_id,
users.name AS assigned_to
FROM tasks
LEFT JOIN users
    ON tasks.assigned_to = users.id
WHERE tasks.trip_id = $1
ORDER BY tasks.due_date;
`;
  //LEFT JOIN = show tasks first then assign travelers
  //How does SQL know which user to get?
  //JOIN users ON tasks.assigned_to = useres.id
  //this connects the 2 tables
  //if assigned_to = userID #2, then instead of #2 the actual name for userID 2 will show up

  //JOIN users
  //→ only shows tasks that already have a valid assigned user

  //LEFT JOIN users
  //→ shows ALL tasks, even if assigned_to is NULL

  const { rows } = await db.query(sql, [tripId]);

  return rows;
}

export async function assignTaskToUser(taskId, userId) {
  const sql = `
    UPDATE tasks
    SET assigned_to = $1
    WHERE id = $2
    RETURNING *; 
    `;

  const {
    rows: [task],
  } = await db.query(sql, [userId, taskId]);

  return task;
}
