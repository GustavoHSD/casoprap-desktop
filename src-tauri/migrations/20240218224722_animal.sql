DROP TABLE IF EXISTS animal;

CREATE TABLE animal (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_picture TEXT,
    name TEXT NOT NULL,
    race TEXT NOT NULL,
    animal_type TEXT NOT NULL,
    age INTEGER,
    rescue_location TEXT NOT NULL,
    is_adopted BOOLEAN NOT NULL DEFAULT 1,
    is_castrado BOOLEAN NOT NULL,
    responsible_volunteer INTEGER NOT NULL,
    FOREIGN KEY (responsible_volunteer) REFERENCES Volunteer(id)
);
