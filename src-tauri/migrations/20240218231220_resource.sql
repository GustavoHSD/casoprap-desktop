DROP TABLE IF EXISTS resource;

CREATE TABLE resource (
    resource_id INTEGER PRIMARY KEY AUTOINCREMENT,
    resource_description VARCHAR(255) NOT NULL,
    resource_price REAL NOT NULL,
    resource_volunteer_id INTEGER NOT NULL,
    FOREIGN KEY (resource_volunteer_id) REFERENCES Volunteer(volunteer_id)
);

