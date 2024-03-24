use serde::{Deserialize, Serialize};
use tauri::State;
use crate::{error::ValidationError, SqlitePoolWrapper};

use super::{request_validation::RequestValidation, volunteer::Volunteer};

#[derive(Serialize, Debug)]
pub struct Animal {
<<<<<<< HEAD
    id: i64,
    name: String,
    race: String,
    animal_type: String,
    age: Option<i64>,
    rescue_location: String,
    is_adopted: bool,
    is_castrado: bool,
    responsible_volunteer: i64,
=======
    animal_id: i64,
    animal_name: String,
    animal_race: String,
    animal_type: String,
    animal_age: Option<i64>,
    animal_rescue_location: String,
    animal_is_adopted: bool,
    animal_is_castrado: bool,
    animal_responsible_volunteer: i64,
>>>>>>> main
}

#[derive(Debug, Clone)]
struct AnimalEager {
    animal_id: i64,
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


#[derive(Serialize, Deserialize)]
pub struct AnimalRequest {
<<<<<<< HEAD
    name: String,
    race: String,
    animal_type: String,
    age: Option<i64>,
    rescue_location: String,
    is_castrado: bool,
    responsible_volunteer: i64
}

impl RequestValidation for AnimalRequest {
    fn validate_fields(&self) -> Result<(), super::request_validation::ValidationError> {
        if self.name.trim().is_empty() || self.race.trim().is_empty() || self.animal_type.trim().is_empty() || self.rescue_location.is_empty() {
            return Err(super::request_validation::ValidationError::FieldValidationError("All fields must not be empty".to_owned()))
=======
    animal_name: String,
    animal_race: String,
    animal_type: String,
    animal_age: Option<i64>,
    animal_rescue_location: String,
    animal_is_adopted: bool,
    animal_is_castrado: bool,
    animal_responsible_volunteer: i64,
}

#[derive(Serialize, Clone)]
pub struct AnimalEager {
    animal_id: i64,
    animal_name: String,
    animal_race: String,
    animal_type: String,
    animal_age: Option<i64>,
    animal_rescue_location: String,
    animal_is_adopted: bool,
    animal_is_castrado: bool,
    animal_responsible_volunteer: i64,
    volunteer_id: i64,
    volunteer_name: String,
    volunteer_cpf: String,
    volunteer_is_active: bool,
}

#[derive(Serialize)]
pub struct AnimalEagerResponse {
    animal: Animal,
    volunteer: Volunteer,
}


impl AnimalEager {
    fn into_response(&self) -> AnimalEagerResponse {
        let response = AnimalEagerResponse {
            animal: Animal {
                animal_id: self.animal_id,
                animal_name: self.animal_name.clone(),
                animal_race: self.animal_race.clone(),
                animal_type: self.animal_type.clone(),
                animal_age: self.animal_age,
                animal_rescue_location: self.animal_rescue_location.clone(),
                animal_is_adopted: self.animal_is_adopted,
                animal_is_castrado: self.animal_is_castrado, 
                animal_responsible_volunteer: self.animal_responsible_volunteer,
            },
            volunteer: Volunteer {
                volunteer_id: self.volunteer_id,
                volunteer_name: self.volunteer_name.clone(),
                volunteer_cpf: self.volunteer_cpf.clone(),
                volunteer_is_active: self.volunteer_is_active,
            }
        };
        for r in response {
            println!("{:?}", r);
        }
        response 
    }
}

impl RequestValidation for AnimalRequest {
    fn validate_fields(&self) -> Result<(), ValidationError> {
        if self.animal_name.trim().is_empty() || self.animal_race.trim().is_empty() || self.animal_type.trim().is_empty() || self.animal_rescue_location.is_empty() {
            return Err(ValidationError::FieldValidationError("All fields must not be empty".to_owned()))
>>>>>>> main
        }
        Ok(())
    }
}

#[tauri::command]
pub async fn create_animal(animal_req: AnimalRequest, state: State<'_, SqlitePoolWrapper>,) -> Result<String, String> {
   match animal_req.validate_fields() {
        Ok(_) => {
<<<<<<< HEAD
            let query_result = sqlx::query!("INSERT INTO animal (name, race, animal_type, age, rescue_location, is_castrado, responsible_volunteer) VALUES (?, ?, ?, ?, ?, ?, ?)",
                animal_req.name,
                animal_req.race,
                animal_req.animal_type,
                animal_req.age,
                animal_req.rescue_location,
                animal_req.is_castrado,
                animal_req.responsible_volunteer,
=======
            let query_result = sqlx::query!("INSERT INTO animal (animal_name, animal_race, animal_type, animal_age, animal_rescue_location, animal_is_castrado, animal_responsible_volunteer) VALUES (?, ?, ?, ?, ?, ?, ?)",
                animal_req.animal_name,
                animal_req.animal_race,
                animal_req.animal_type,
                animal_req.animal_age,
                animal_req.animal_rescue_location,
                animal_req.animal_is_castrado,
                animal_req.animal_responsible_volunteer,
>>>>>>> main
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
        "SELECT * FROM animal, volunteer",
    )
    .fetch_all(&state.pool)
    .await;
 
    match animals {
        Ok(animals) => {
            let response: Vec<AnimalEagerResponse> = animals.clone().iter().map(|animal| animal.into_response()).collect::<Vec<AnimalEagerResponse>>();
            Ok(response)
        },
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
pub async fn get_all_animals_eager(state: State<'_, SqlitePoolWrapper>,) -> Result<Vec<AnimalEagerResponse>, String> {
    let animals = sqlx::query_as!(
        AnimalEager,
        "SELECT animal.id AS animal_id, animal.name AS animal_name, race, animal_type, age, rescue_location, is_adopted, is_castrado, responsible_volunteer, volunteer.id as volunteer_id, volunteer.name AS volunteer_name, cpf, is_active FROM animal, volunteer",
    )
    .fetch_all(&state.pool)
    .await;
    
    match animals {
        Ok(animals) => { 
            let animal_response = animals.clone().iter().map(|animal| AnimalEagerResponse::from(animal)).collect();

            Ok(animal_response)
        },
        Err(error) => Err(error.to_string()),
    }
}
#[tauri::command]
pub async fn get_animal(id: i64, state: State<'_, SqlitePoolWrapper>,) -> Result<Animal, String> {
    let animal = sqlx::query_as!(
        Animal,
        "SELECT * FROM animal WHERE animal_id = ?",
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
<<<<<<< HEAD
                "UPDATE animal SET name = ?, race = ?, animal_type = ?, age = ?, rescue_location = ?, is_castrado = ? WHERE responsible_volunteer = ?",
                animal_req.name,
                animal_req.race,
                animal_req.animal_type,
                animal_req.age,
                animal_req.rescue_location,
                animal_req.is_castrado,
=======
                "UPDATE animal SET animal_name = ?, animal_race = ?, animal_type = ?, animal_age = ?, animal_rescue_location = ?, animal_is_castrado = ? WHERE animal_responsible_volunteer = ?",
                animal_req.animal_name,
                animal_req.animal_race,
                animal_req.animal_type,
                animal_req.animal_age,
                animal_req.animal_rescue_location,
                animal_req.animal_is_castrado,
>>>>>>> main
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
        "DELETE FROM animal WHERE animal_id = ?",
        id
    )
    .execute(&state.pool)
    .await;
    
    match animal {
        Ok(_) => Ok("Success".to_owned()),
        Err(error) => Err(error.to_string()),
    }
}


