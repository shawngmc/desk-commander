const { exec } = require("child_process");

let child;


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
});
