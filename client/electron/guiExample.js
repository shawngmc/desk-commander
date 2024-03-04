const { exec } = require("child_process");
const { ipcRenderer } = require("electron");

let child;

ipcRenderer.send("run-command", "ls");
ipcRenderer.on("run-command-result", (event, result) => {
  if (result.error) {
    console.error("Error:", result.error);
  } else {
    console.log("Output:", result.output);
  }
});

const startCodeFunction = () => {
  console.log("Initiating program");

  child = exec("bash ../server_launch.sh", (error) => {
    if (error) {
      console.log(`exec error: ${error}`);
    }
  });
};

const toggleLightFunction = () => {
  console.log("Toggling light");

  fetch("http://localhost:5000/light/toggle");
};

const stopCodeFunction = () => {
  console.log('Stopping server...')
  fetch("http://localhost:5000/shutdown");
};

// const openFileFunctionSync = () => {
//   printBoth("From guiExample.js sending a request to main.js via ipc");
//   ipcRenderer.send("open_json_file_sync");
// };

// const openFileFunctionAsync = () => {
//   printBoth("From guiExample.js sending a request to main.js via ipc");
//   ipcRenderer.send("open_json_file_async");
// };

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("start_code")
    .addEventListener("click", startCodeFunction);
  document
    .getElementById("toggle_light")
    .addEventListener("click", toggleLightFunction);
  document
    .getElementById("stop_code")
    .addEventListener("click", stopCodeFunction);
  // document
  //   .getElementById("open_file_sync")
  //   .addEventListener("click", openFileFunctionSync);
  // document
  //   .getElementById("open_file_async")
  //   .addEventListener("click", openFileFunctionAsync);
});
