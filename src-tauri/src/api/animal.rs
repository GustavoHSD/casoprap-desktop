use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct Animal {
    id: i32,
    name: String,
    race: String,
    a_type: String,
    age: Option<i32>,
    rescue_location: String,
    is_adopted: i8,
    responsible_volunteer: i32,
}

#[derive(Serialize, Deserialize)]
struct AnimalReq {
    name: String,
    race: String,
    a_type: String,
    age: i16,
    rescue_location: String,
    responsible_volunteer: i32
}
