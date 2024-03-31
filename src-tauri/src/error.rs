use core::fmt;

pub enum ValidationError {
    FieldValidationError(String),
    DatabaseValidationError(String),
}

impl fmt::Display for ValidationError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::FieldValidationError(msg) => {
                write!(f, "Field validation error: {}", msg)
            },
            Self::DatabaseValidationError(msg) => {
                write!(f, "Database validation error: {}", msg)
            }
        }
    }
}

