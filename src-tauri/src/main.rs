// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};
use tauri::Runtime;

mod api;

struct SqlitePoolWrapper {
    pub pool: SqlitePool,
}

async fn establish_connection() -> SqlitePool {
  dotenv::dotenv().expect("Unable to load environment variables from .env file");
  
  let db_url = std::env::var("DATABASE_URL").expect("Unable to read DATABASE_URL env var");
  
  SqlitePoolOptions::new()
    .max_connections(100)
    .connect(&db_url)
    .await.expect("Unable to connect to Sqlite")
}

#[tokio::main]
async fn main() {
    let pool: SqlitePool = Runtime::new().unwrap().block_on(establish_connection());
    tauri::Builder::default()
        .manage(SqlitePoolWrapper{pool})
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
