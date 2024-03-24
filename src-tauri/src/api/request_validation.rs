use crate::error::ValidationError;

pub trait RequestValidation {
    fn validate_fields(&self) -> Result<(), ValidationError>;
}
