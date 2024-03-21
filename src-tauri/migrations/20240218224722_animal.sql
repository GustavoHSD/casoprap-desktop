DROP TABLE IF EXISTS animal;

CREATE TABLE animal (
    animal_id INTEGER PRIMARY KEY AUTOINCREMENT,
    animal_name VARCHAR(255) NOT NULL,
    animal_race VARCHAR(255) NOT NULL,
    animal_type VARCHAR(255) NOT NULL,
    animal_age INTEGER,
    animal_rescue_location VARCHAR(255) NOT NULL,
    animal_is_adopted BOOLEAN NOT NULL DEFAULT 1,
    animal_is_castrado BOOLEAN NOT NULL,
    animal_responsible_volunteer INTEGER NOT NULL,
    FOREIGN KEY (animal_responsible_volunteer) REFERENCES Volunteer(volunteer_id)
);
