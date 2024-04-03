use serde::{Serialize, Deserialize};
use tauri::State;

use crate::{error::ValidationError, SqlitePoolWrapper};

use super::{request_validation::RequestValidation, volunteer::Volunteer};

#[derive(Serialize)]
pub struct Resource {
    id: i64,
    description: String,
    price: f64,
    volunteer_id: i64
}

#[derive(Serialize, Deserialize)]
pub struct ResourceRequest {
    description: String,
    price: f64,
    volunteer_id: i64
}

#[derive(Clone)]
struct ResourceEager {
    id: i64,
    description: String,
    price: f64,
    volunteer_id: i64,
    name: String,
    cpf: String,
    is_active: bool,
}

#[derive(Serialize)]
pub struct ResourceEagerResponse {
    resource: Resource,
    volunteer: Volunteer,
}

impl From<&ResourceEager> for ResourceEagerResponse {
    fn from(resource_eager: &ResourceEager) -> Self {
        ResourceEagerResponse {
            resource: Resource {
                id: resource_eager.id,
                description: resource_eager.description.clone(),
                price: resource_eager.price,
                volunteer_id: resource_eager.volunteer_id,
            },
            volunteer: Volunteer {
                id: resource_eager.volunteer_id,
                name: resource_eager.name.clone(),
                cpf: resource_eager.cpf.clone(),
                is_active: resource_eager.is_active,
            }
        }
    }
}


impl RequestValidation for ResourceRequest {
    fn validate_fields(&self) -> Result<(), ValidationError> {
        match (self.description.trim().is_empty() , self.price < 0.0) {
            (true, true) => Err(ValidationError::FieldValidationError(("Description should not be empty and price should not be negative").to_owned())),
            (true, _) => Err(ValidationError::FieldValidationError(("Description should not be empty").to_owned())),
            (_, true) => Err(ValidationError::FieldValidationError(("Price should not be negative").to_owned())),
            _ => Ok(()) 
        }
    }
}

#[tauri::command]
pub async fn create_resource(resource_req: ResourceRequest, state: State<'_, SqlitePoolWrapper>,) -> Result<String, String> {
   match resource_req.validate_fields() {
        Ok(_) => {
            let query_result = sqlx::query!("INSERT INTO resource (description, price, volunteer_id) VALUES (?, ?, ?)",
                resource_req.description,
                resource_req.price,
                resource_req.volunteer_id,
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
pub async fn get_all_resources(state: State<'_, SqlitePoolWrapper>,) -> Result<Vec<Resource>, String> {
    let resource = sqlx::query_as!(
        Resource,
        "SELECT * FROM resource",
    )
    .fetch_all(&state.pool)
    .await;
    
    match resource {
        Ok(resource) => Ok(resource),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
pub async fn get_all_resources_eager(state: State<'_, SqlitePoolWrapper>,) -> Result<Vec<ResourceEagerResponse>, String> {
    let resources = sqlx::query_as!(
        ResourceEager,
        "SELECT 
            resource.id, 
            resource.price, 
            resource.description, 
            resource.volunteer_id, 
            name, 
            cpf, 
            is_active 
        FROM resource LEFT JOIN volunteer ON volunteer_id = volunteer.id",
    )
    .fetch_all(&state.pool)
    .await;
    
    match resources {
        Ok(resources) => { 
            let resource_response: Vec<ResourceEagerResponse> = resources.clone().iter().map(|resource| ResourceEagerResponse::from(resource)).collect();
            Ok(resource_response)
        },
        Err(error) => Err(error.to_string()),
    }
}
#[tauri::command]
pub async fn get_resource(id: i64, state: State<'_, SqlitePoolWrapper>,) -> Result<Resource, String> {
    let resource = sqlx::query_as!(
        Resource,
        "SELECT * FROM resource WHERE id = ?",
        id
    )
    .fetch_one(&state.pool)
    .await;
    
    match resource {
        Ok(resource) => Ok(resource),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
pub async fn update_resource(id: i64, resource_req: ResourceRequest, state: State<'_, SqlitePoolWrapper>,) -> Result<String, String> { 
    match resource_req.validate_fields() {
        Ok(_) => {
            let query_result = sqlx::query!(
                "UPDATE resource SET description = ?, price = ? WHERE volunteer_id = ?", 
                resource_req.description,
                resource_req.price,
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
pub async fn delete_resource(id: i64, state: State<'_, SqlitePoolWrapper>,) -> Result<String, String> {
    let resource = sqlx::query!(
        "DELETE FROM resource WHERE id = ?",
        id
    )
    .execute(&state.pool)
    .await;
    
    match resource {
        Ok(_) => Ok("Success".to_owned()),
        Err(error) => Err(error.to_string()),
    }
}


