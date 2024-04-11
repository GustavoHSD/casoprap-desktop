use serde::{Deserialize, Serialize};
use tauri::State;

use crate::{error::ValidationError, SqlitePoolWrapper};
use super::{request_validation::RequestValidation, volunteer::Volunteer};


#[derive(Serialize, Debug)]
pub struct Animal {
    id: i64,
    profile_picture: Option<Vec<u8>>,
    name: String,
    race: String,
    animal_type: String,
    age: Option<i64>,
    rescue_location: String,
    is_adopted: bool,
    is_castrado: bool,
    responsible_volunteer: i64,
}

#[derive(Serialize, Deserialize)]
pub struct AnimalRequest {
    name: String,
    race: String,
    animal_type: String,
    age: Option<i64>,
    rescue_location: String,
    is_adopted: bool,
    is_castrado: bool,
    responsible_volunteer: i64
}

#[derive(Clone)]
struct AnimalEager {
    animal_id: i64,
    animal_profile_picture: Option<Vec<u8>>,
    animal_name: String,
    race: String,
    animal_type: String,
    age: Option<i64>,
    rescue_location: String,
    is_adopted: bool,
    is_castrado: bool,
    responsible_volunteer: i64,
    volunteer_id: i64,
    volunteer_name: String,
    cpf: String,
    is_active: bool,
}

#[derive(Serialize)]
pub struct AnimalEagerResponse {
    animal: Animal,
    volunteer: Volunteer,
}

impl From<&AnimalEager> for AnimalEagerResponse {
    fn from(animal: &AnimalEager) -> Self {
        AnimalEagerResponse {
            animal: Animal {
                id: animal.animal_id,
                profile_picture: Some(animal.animal_profile_picture.clone()).expect("No profile picture"),
                name: animal.animal_name.clone(),
                race: animal.race.clone(),
                animal_type: animal.animal_type.clone(),
                age: animal.age,
                rescue_location: animal.rescue_location.clone(),
                is_adopted: animal.is_adopted,
                is_castrado: animal.is_castrado,
                responsible_volunteer: animal.responsible_volunteer, 
            },
            volunteer: Volunteer {
                id: animal.volunteer_id,
                name: animal.volunteer_name.clone(),
                cpf: animal.cpf.clone(),
                is_active: animal.is_active,
            }
        }
    }
}


impl RequestValidation for AnimalRequest {
    fn validate_fields(&self) -> Result<(), ValidationError> {
        if self.name.trim().is_empty() || self.race.trim().is_empty() || self.animal_type.trim().is_empty() || self.rescue_location.is_empty() {
            return Err(ValidationError::FieldValidationError("All fields must not be empty".to_owned()))
        }
        Ok(())
    }
    async fn validate_database_constraint(&self, state: State<'_, SqlitePoolWrapper>) -> Result<(), ValidationError> {
        let query_result = sqlx::query!("SELECT * FROM volunteer WHERE id = ?", self.responsible_volunteer)
            .fetch_one(&state.pool)
            .await;
        match query_result {
            Ok(_) => Ok(()),
            Err(_) => return Err(ValidationError::DatabaseValidationError(format!("Volunteer of id = {} does not exist", self.responsible_volunteer)))
        }
    }
}



#[tauri::command]
pub async fn create_animal(animal_req: AnimalRequest, state: State<'_, SqlitePoolWrapper>,) -> Result<String, String> {
   match animal_req.validate_fields() {
        Ok(_) => {
            let query_result = sqlx::query!("INSERT INTO animal (name, race, animal_type, age, rescue_location, is_castrado, responsible_volunteer) VALUES (?, ?, ?, ?, ?, ?, ?)",
                animal_req.name,
                animal_req.race,
                animal_req.animal_type,
                animal_req.age,
                animal_req.rescue_location,
                animal_req.is_castrado,
                animal_req.responsible_volunteer,
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
        Ok(animal) => Ok(animal),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
pub async fn get_all_animals_eager(state: State<'_, SqlitePoolWrapper>,) -> Result<Vec<AnimalEagerResponse>, String> {
    let animals = sqlx::query_as!(
        AnimalEager,
        "SELECT 
            animal.id AS animal_id, 
            animal.profile_picture AS animal_profile_picture,
            animal.name AS animal_name, 
            race, 
            animal_type, 
            age, 
            rescue_location, 
            is_adopted, 
            is_castrado, 
            responsible_volunteer, 
            volunteer.id as volunteer_id, 
            volunteer.name AS volunteer_name, 
            cpf, 
            is_active 
        FROM animal LEFT JOIN volunteer ON responsible_volunteer = volunteer.id",
    )
    .fetch_all(&state.pool)
    .await;
    
    match animals {
        Ok(animals) => { 
            let animal_response: Vec<AnimalEagerResponse> = animals.clone().iter().map(|animal| AnimalEagerResponse::from(animal)).collect();
            Ok(animal_response)
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
                "UPDATE animal SET name = ?, race = ?, animal_type = ?, age = ?, rescue_location = ?, is_adopted = ?,  is_castrado = ? WHERE id = ?",
                animal_req.name,
                animal_req.race,
                animal_req.animal_type,
                animal_req.age,
                animal_req.rescue_location,
                animal_req.is_adopted,
                animal_req.is_castrado,
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
    let animal = sqlx::query!(
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


