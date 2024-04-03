// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};

mod service;
mod error;

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
    let pool: SqlitePool = establish_connection().await;
    tauri::Builder::default()
        .manage(SqlitePoolWrapper{pool})
        .invoke_handler(tauri::generate_handler![
            service::volunteer::create_volunteer,
            service::volunteer::get_all_volunteers,
            service::volunteer::get_volunteer,
            service::volunteer::update_volunteer,
            service::volunteer::delete_volunteer,
            service::animal::create_animal,  
            service::animal::get_all_animals,
            service::animal::get_all_animals_eager,
            service::animal::get_animal,
            service::animal::update_animal,
            service::animal::delete_animal, 
            service::resource::create_resource,  
            service::resource::get_all_resources,
            service::resource::get_all_resources_eager,
            service::resource::get_resource,
            service::resource::update_resource,
            service::resource::delete_resource, 
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
