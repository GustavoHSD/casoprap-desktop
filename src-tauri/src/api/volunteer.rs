use serde::{Serialize, Deserialize};
use tauri::State;

use crate::SqlitePoolWrapper;

#[derive(Serialize)]
pub struct Volunteer {
    id: i32,
    name: String,
    cpf: String,
    is_active: i8,
}

#[derive(Serialize, Deserialize)]
struct VolunteerReq {
    name: String,
    cpf: String,
}

pub async fn create( 
    state: State<'_, SqlitePoolWrapper>,
    req: VolunteerReq,
    ) -> serde_json::Value {
    
    let query_result = sqlx::query!(
        "INSERT INTO Volunteer (name, cpf, is_active) values (?,?,?)",
        req.name,
        req.cpf,
        true
    )
    .execute(&state.pool)
    .await;
     
    match query_result {
        Ok(query_result) => {
            serde_json::json!({
                "id": query_result.last_insert_id(),
                "name": req.name,
            })
        },
        Err(_) => { 
            serde_json::json!({"error": "Volunteer could not be inserted"})
        }, 
    };
}

pub async fn find_all(state: State<'_, SqlitePoolWrapper>,) -> serde_json::Value {
    let volunteers = sqlx::query_as!(
        Volunteer,
        "SELECT * FROM Volunteer"
    )
    .fetch_all(&state.pool)
    .await;  

    match volunteers {   
        Ok(volunteers) => serde_json::to_string(&volunteers)?,
        Err(error) => {
            serde_json::json!({"error": error.to_string()}); 
        },
    }; 
}

pub async fn find_by_id(id: i64, state: State<'_, SqlitePoolWrapper>,) -> serde_json::Value {
    let volunteer = sqlx::query_as!(
        Volunteer,
        "SELECT * FROM Volunteer WHERE id = ?",
        id
    )
    .fetch_one(&state.pool)
    .await;

    match volunteer {
        Ok(volunteer) => serde_json::to_string(&volunteer).unwrap(),
        Err(_) => { 
            serde_json::json!({"message": "Volunteer not found"});
        }
    };
}


