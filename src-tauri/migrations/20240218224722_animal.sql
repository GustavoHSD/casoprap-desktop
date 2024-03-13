DROP TABLE IF EXISTS animal;

CREATE TABLE animal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    race VARCHAR(255) NOT NULL,
    a_type VARCHAR(255) NOT NULL,
    age INTEGER,
    rescue_location VARCHAR(255) NOT NULL,
    is_adopted BOOLEAN NOT NULL DEFAULT 1,
    is_castrado BOOLEAN NOT NULL,
    responsible_volunteer INTEGER NOT NULL,
    FOREIGN KEY (responsible_volunteer) REFERENCES Volunteer(id)
);
