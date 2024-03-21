DROP TABLE IF EXISTS volunteer;

CREATE TABLE volunteer (
    volunteer_id INTEGER PRIMARY KEY AUTOINCREMENT,
    volunteer_name VARCHAR(255) NOT NULL,
    volunteer_cpf VARCHAR(255) NOT NULL UNIQUE,
    volunteer_is_active BOOLEAN NOT NULL
);
