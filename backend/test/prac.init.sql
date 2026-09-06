-- Создаёт таблицы проекта Film! для PostgreSQL

DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS films;

CREATE TABLE films (
  id uuid PRIMARY KEY,
  rating real NOT NULL,
  director text NOT NULL,
  tags text[] NOT NULL,
  image text NOT NULL,
  cover text NOT NULL,
  title text NOT NULL,
  about text NOT NULL,
  description text NOT NULL
);

CREATE TABLE schedules (
  id uuid PRIMARY KEY,
  daytime timestamptz NOT NULL,
  hall integer NOT NULL,
  rows integer NOT NULL,
  seats integer NOT NULL,
  price integer NOT NULL,
  taken text[] NOT NULL DEFAULT ARRAY[]::text[],
  film_id uuid NOT NULL REFERENCES films (id) ON DELETE CASCADE
);

CREATE INDEX idx_schedules_film_id ON schedules (film_id);
