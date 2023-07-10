const { invoke } = window.__TAURI__.tauri;

// html elements
let dir_display;

// variables
let dirList;
let currentPath = "C:";
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

    // creating the element
    const button = document.createElement("button");
    button.setAttribute("id", element.toString());
    button.textContent = element;
    // check if element is a directory
    if (!element.match(/\.[0-9a-z]+$/i)) {
      button.onclick = async function () {
        await changeDir(element.toString());
        currentPath = currentPath + "/" + element.toString();
        path_bar.value = currentPath;
        console.log(currentPath);
      };

      // console.log(button.textContent);

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

  // first load!
  let path_bar = document.getElementById("path_bar");
  let search_bar = document.getElementById("search_bar");
  path_bar.value = currentPath;

  // event handlers
  path_bar.addEventListener("keypress", function (event) {
    // enter key handling
    if (event.key === "Enter") {
      event.preventDefault();
      currentPath = path_bar.value.toString();
      changeDir(currentPath);
    }
  });

  // query handling

  // calls the function when input value changes
  search_bar.addEventListener("input", function (event) {
    changeDir(path_bar.value, search_bar.value);
  });

  let back_button = document.getElementById("back_button");
  back_button.addEventListener("click", async function (event) {
    await changeDir("..", search_bar.value);

    // update the path
    let n = currentPath.lastIndexOf("/");
    currentPath = currentPath.substring(0, n != -1 ? n : currentPath.length);
    path_bar.value = currentPath;
  });
});
