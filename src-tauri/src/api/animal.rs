use serde::{Deserialize, Serialize};
use tauri::State;
use crate::SqlitePoolWrapper;

use super::request_validation::RequestValidation;

#[derive(Serialize, Debug)]
pub struct Animal {
    animal_id: i64,
    animal_name: String,
    animal_race: String,
    animal_a_type: String,
    animal_age: Option<i64>,
    animal_rescue_location: String,
    animal_is_adopted: bool,
    animal_is_castrado: bool,
    animal_responsible_volunteer: i64,
}

#[derive(Serialize, Deserialize)]
pub struct AnimalRequest {
    animal_name: String,
    animal_race: String,
    animal_a_type: String,
    animal_age: Option<i64>,
    animal_rescue_location: String,
    animal_is_adopted: bool,
    animal_is_castrado: bool,
    animal_responsible_volunteer: i64,
}

impl RequestValidation for AnimalRequest {
    fn validate_fields(&self) -> Result<(), super::request_validation::ValidationError> {
        if self.name.trim().is_empty() || self.race.trim().is_empty() || self.a_type.trim().is_empty() || self.rescue_location.is_empty() {
            return Err(super::request_validation::ValidationError::FieldValidationError("All fields must not be empty".to_owned()))
        }
        Ok(())
    }
}

#[tauri::command]
pub async fn create_animal(animal_req: AnimalRequest, state: State<'_, SqlitePoolWrapper>,) -> Result<String, String> {
   match animal_req.animal_validate_fields() {
        Ok(_) => {
            let query_result = sqlx::query!("INSERT INTO animal (name, race, a_type, age, rescue_location, is_castrado, responsible_volunteer) VALUES (?, ?, ?, ?, ?, ?, ?)",
                animal_req.animal_name,
                animal_req.animal_race,
                animal_req.animal_a_type,
                animal_req.animal_age,
                animal_req.animal_rescue_location,
                animal_req.animal_is_castrado,
                animal_req.animal_responsible_volunteer,
            )
            .execute(&state.pool)
            .await;

            match query_result {
                Ok(_) => Ok("Success".to_owned()),
                Err(error) => Err(error.to_string()),
            }

        },
        Err(error) => return Err(error.to_string())
    }

}

#[tauri::command]
pub async fn get_all_animals(state: State<'_, SqlitePoolWrapper>,) -> Result<Vec<Animal>, String> {
    let animal = sqlx::query_as!(
        Animal,
        "SELECT * FROM animal",
    )
    .fetch_all(&state.pool)
    .await;
    
    match animal {
        Ok(animal) => { 
            for v in &animal {
                println!("{:?}", v);
            }

            Ok(animal)  
        },
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
pub async fn get_animal(id: i64, state: State<'_, SqlitePoolWrapper>,) -> Result<Animal, String> {
    let animal = sqlx::query_as!(
        Animal,
        "SELECT * FROM animal WHERE id = ?",
        id
    )
    .fetch_one(&state.pool)
    .await;
    
    match animal {
        Ok(animal) => Ok(animal),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
pub async fn update_animal(id: i64, animal_req: AnimalRequest, state: State<'_, SqlitePoolWrapper>,) -> Result<String, String> { 
    match animal_req.validate_fields() {
        Ok(_) => {
            let query_result = sqlx::query!(
                "UPDATE animal SET name = ?, race = ?, a_type = ?, age = ?, rescue_location = ?, is_castrado = ? WHERE responsible_volunteer = ?",
                animal_req.animal_name,
                animal_req.animal_race,
                animal_req.animal_a_type,
                animal_req.animal_age,
                animal_req.animal_rescue_location,
                animal_req.animal_is_castrado,
                id
            )
            .execute(&state.pool)
            .await;

            match query_result {
                Ok(_) => Ok("Success".to_owned()),
                Err(error) => Err(error.to_string()),
            }
        },
        Err(error) => Err(error.to_string()),
    }

}

#[tauri::command]
pub async fn delete_animal(id: i64, state: State<'_, SqlitePoolWrapper>,) -> Result<String, String> {
    let animal = sqlx::query_as!(
        Animal,
        "DELETE FROM animal WHERE id = ?",
        id
    )
    .execute(&state.pool)
    .await;
    
    match animal {
        Ok(_) => Ok("Success".to_owned()),
        Err(error) => Err(error.to_string()),
    }
}


