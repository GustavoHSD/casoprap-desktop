use serde::{Serialize, Deserialize};

use crate::error::ValidationError;

use super::request_validation::RequestValidation;

#[derive(Serialize)]
struct Resource {
    id: i32,
    description: String,
    price: f32,
    volunteer_id: i32
}

#[derive(Serialize, Deserialize)]
struct ResourceRequest {
    description: String,
    price: f32,
    volunteer_id: i32
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

