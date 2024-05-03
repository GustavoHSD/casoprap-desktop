DROP TABLE IF EXISTS volunteer;

CREATE TABLE volunteer (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL
);
