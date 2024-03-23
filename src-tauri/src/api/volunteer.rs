use serde::{Serialize, Deserialize};
use tauri::State;

use crate::{error::ValidationError, SqlitePoolWrapper};

use super::request_validation::RequestValidation;

#[derive(Serialize, Debug)]
pub struct Volunteer {
    pub volunteer_id: i64,
    pub volunteer_name: String,
    pub volunteer_cpf: String,
    pub volunteer_is_active: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct VolunteerRequest {
    volunteer_name: String,
    volunteer_cpf: String,
    volunteer_is_active: bool,
}

impl RequestValidation for VolunteerRequest {
    fn validate_fields(&self) -> Result<(), ValidationError> {
        if self.volunteer_name.trim().is_empty() || self.volunteer_cpf.trim().is_empty() {
            return Err(crate::error::ValidationError::FieldValidationError("Name and cpf must not be empty".to_owned()))
        }
        Ok(())
    }
}

#[tauri::command]
pub async fn create_volunteer(volunteer_req: VolunteerRequest, state: State<'_, SqlitePoolWrapper>,) -> Result<String, String> {
    match volunteer_req.validate_fields() {
        Ok(_) => {
            let query_result = sqlx::query!("INSERT INTO volunteer (volunteer_name, volunteer_cpf, volunteer_is_active) VALUES (?, ?, true)",
            volunteer_req.volunteer_name,
            volunteer_req.volunteer_cpf
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
pub async fn get_all_volunteers(state: State<'_, SqlitePoolWrapper>,) -> Result<Vec<Volunteer>, String> {
    let volunteer = sqlx::query_as!(
        Volunteer,
        "SELECT * FROM volunteer",
    )
    .fetch_all(&state.pool)
    .await;
    
    match volunteer {
        Ok(volunteer) => { 
            for v in &volunteer {
                println!("{:?}", v);
            }

            Ok(volunteer)  
        },
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
pub async fn get_volunteer(id: i64, state: State<'_, SqlitePoolWrapper>,) -> Result<Volunteer, String> {
    let volunteer = sqlx::query_as!(
        Volunteer,
        "SELECT * FROM volunteer WHERE volunteer_id = ?",
        id
    )
    .fetch_one(&state.pool)
    .await;
    
    match volunteer {
        Ok(volunteer) => Ok(volunteer),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
pub async fn update_volunteer(id: i64, volunteer_req: VolunteerRequest, state: State<'_, SqlitePoolWrapper>,) -> Result<String, String> { 
    match volunteer_req.validate_fields() {
        Ok(_) => {
            let query_result = sqlx::query!(
                "UPDATE volunteer SET volunteer_name = ?, volunteer_cpf = ?, volunteer_is_active = ? WHERE volunteer_id = ?",
                volunteer_req.volunteer_name,
                volunteer_req.volunteer_cpf,
                volunteer_req.volunteer_is_active,
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
pub async fn delete_volunteer(id: i64, state: State<'_, SqlitePoolWrapper>,) -> Result<String, String> {
    let volunteer = sqlx::query!(
        "DELETE FROM volunteer WHERE volunteer_id = ?",
        id
    )
    .execute(&state.pool)
    .await;
    
    match volunteer {
        Ok(_) => Ok("Success".to_owned()),
        Err(error) => Err(error.to_string()),
    }
}


