use tauri::State;

use crate::{error::ValidationError, SqlitePoolWrapper};

pub trait RequestValidation {
    fn validate_fields(&self) -> Result<(), ValidationError>;
    async fn validate_database_constraint(&self, _state: State<'_, SqlitePoolWrapper>) -> Result<(), ValidationError> {
        Ok(())
    }
}
