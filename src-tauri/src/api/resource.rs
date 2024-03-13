use serde::{Serialize, Deserialize};

#[derive(Serialize)]
struct Resource {
    id: i32,
    description: String,
    price: f32,
    volunteer_id: i32
}

#[derive(Serialize, Deserialize)]
struct ResourceReq {
    description: String,
    price: f32,
    volunteer_id: i32
}


