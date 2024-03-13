DROP TABLE IF EXISTS resource;

CREATE TABLE resource (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description VARCHAR(255) NOT NULL,
    price REAL NOT NULL,
    volunteer_id INTEGER NOT NULL,
    FOREIGN KEY (volunteer_id) REFERENCES Volunteer(id)
);

