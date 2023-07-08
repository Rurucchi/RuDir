const { invoke } = window.__TAURI__.tauri;

// html elements
let dir_display;

// variables
let dirList;
let filter = "";

// calls to backend

async function getDir(path, filter) {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  let displayDir = await invoke("get_dir", { dir_path: path, filter: filter });
  return displayDir;
}

async function displayDir(dir, filter) {
  // if dir is not specified : go to C:/
  if (!dir) {
    dir = "c:/";
  }

  if (!filter) {
    filter = "";
  }

  // mapping each folder/file to the UI
  dir_display = document.querySelector("#dir_display");
  dirList = await getDir(dir, filter);

  dirList.forEach((element) => {
    // console.log(element);
    const button = document.createElement("button");
    button.setAttribute("id", element.toString());
    button.onclick = async function () {
      await changeDir(element.toString());
    };
    button.textContent = element;

    console.log(button.textContent);
    // check if element is a directory
    if (!element.match(/\.[0-9a-z]+$/i)) {
      button.innerHTML += `<img src="assets/folder.svg" width="20" height="20">`;
    }
    dir_display.appendChild(button);
  });
}

async function changeDir(inputPath, inputFilter) {
  // clear current dir
  const lastDir = document.getElementById("dir_display");
  lastDir.innerHTML = "";
  await displayDir(inputPath, inputFilter);
}

// front-end reactive

window.addEventListener("DOMContentLoaded", async () => {
  changeDir(document.getElementById("path_bar").value);

  // enter key handling
  let path_bar = document.getElementById("path_bar");
  path_bar.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      changeDir(path_bar.value);
    }
  });

  // query handling
  let search_bar = document.getElementById("search_bar");
  search_bar.addEventListener("input", function (event) {
    changeDir(path_bar.value, search_bar.value);
  });

  let back_button = document.getElementById("back_button");
  back_button.addEventListener("click", async function (event) {
    await changeDir("..", search_bar.value);
  });
});
