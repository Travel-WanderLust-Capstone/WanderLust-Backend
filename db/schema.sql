-- children
-- no FK on trips_users and selections, they go first
DROP TABLE IF EXISTS trips_users;
DROP TABLE IF EXISTS selections;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS place;
DROP TABLE IF EXISTS trips;

-- Parents
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE location (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE trips (
id serial PRIMARY KEY,
name text NOT NULL,
location_id INTEGER NOT NULL REFERENCES location(id),
start_date date NOT NULL,
end_date date NOT NULL,
description text NOT NULL
);

CREATE TABLE tasks (
  id serial PRIMARY KEY,
  title text NOT NULL,
  due_date date NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  trip_id integer NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  assigned_to integer NOT NULL REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE place (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  location_id INTEGER NOT NULL REFERENCES location(id) ON DELETE CASCADE
);

CREATE TABLE selections (
id serial PRIMARY KEY,
trip_id integer NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
place_id integer NOT NULL REFERENCES place(id) ON DELETE CASCADE
);

CREATE TABLE trips_users (
id serial PRIMARY KEY,
trip_id integer NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
message text NOT NULL,
UNIQUE (trip_id, user_id)
);

