// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use tauri::regex;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command(rename_all = "snake_case")]

// deprecated for now

// fn get_all_dir(dir_path: String) -> Vec<String> {
//     let root = std::path::Path::new(&dir_path);
//     std::env::set_current_dir(&root).is_ok();
//     let dir_content = fs::read_dir("").unwrap();
//     let mut paths: Vec<String> = Vec::new();

//     for path in dir_content {
//         paths.push(path.unwrap().path().display().to_string());
//     }
//     return paths;
// }

fn get_dir(dir_path: &str, filter: String) -> Vec<String> {

  // 
  let root = std::path::Path::new(&dir_path);
  std::env::set_current_dir(&root).is_ok();
  let dir_content = fs::read_dir("").unwrap();

  // variables
  let mut paths: Vec<String> = Vec::new();


  let re = regex::Regex::new(format!("(?i){}",filter).as_str()).unwrap();

  if filter != "" {
    for path in dir_content {
      let elt = path.unwrap().path().display().to_string();
      if re.is_match(elt.as_str())  {
        paths.push(elt);
      }
    }
  } else {
        for path in dir_content {
        paths.push(path.unwrap().path().display().to_string());
    }
  }

  return paths;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
