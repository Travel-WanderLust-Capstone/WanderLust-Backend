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

//DELETE TASK
//function to delete task
//async: function may take time
export async function deleteTask(taskId) {
  //taskId=iD of task want to delete

  //Delete from tasks table
  //Whereid: tells postgreSQL which task to be deleted. $1 is placeholder.
  //Return task that has been deleted
  //PostgreSQL deletes row and sends it back to Jacascript code
  const sql = `
    DELETE FROM tasks 
    WHERE id = $1
    RETURNING *;
    `;
  //db.query= send SQL command to PostgreSQL
  //await=wait for postgresSQL to delete task then continue
  const { rows } = await db.query(sql, [taskId]);
  //{rows} returns object with information about query

  return rows[0]; //give first task in array
}

//UPDATES task = PATCH
//two pieces: task and user
//change an existing row in tasks table
export async function assignTaskToUser(taskId, userId) {
  const sql = `
    UPDATE tasks
    SET assigned_to = $1
    WHERE id = $2
    RETURNING *; 
    `;
  //changing assigned_to column: $1 is placeholder
  //first value = userId
  //where Id = $2: only update task whose ID matched $2

  //ex: assigned_to = $1: userId #
  //WHERE id = $2: task id

  //RETURNING *: send updated task back to javascript

  const {
    rows: [task],
    //Go into rows, grab the first item, and store it in a variable called task
  } = await db.query(sql, [userId, taskId]);

  return task;
}
