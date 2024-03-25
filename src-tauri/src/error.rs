use core::fmt;

pub enum ValidationError {
    FieldValidationError(String),
}

impl fmt::Display for ValidationError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ValidationError::FieldValidationError(msg) => {
                write!(f, "Field validation error: {}", msg)
            },
        }
    }
}

