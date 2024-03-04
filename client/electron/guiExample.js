const { exec } = require("child_process");
const nodeConsole = require("console");
const { ipcRenderer } = require("electron");
var net = require('net');

var conn_client = null;

var update_ui_state = function() {
  var connected = (conn_client != null);
  document.getElementById("start_code").disabled = connected;
  document.getElementById("send_code").disabled = !connected;
  document.getElementById("stop_code").disabled = !connected;
}
setTimeout(update_ui_state, 200);

var client_connected = function(client) {
  console.log(`client connected`);
  conn_client = client;
  update_ui_state();
}


var server = net.createServer(client => {
  const chunks = [];
  client_connected(client);
  client.setEncoding('utf8');

  client.on('end', () => {
    console.log('client disconnected');
    conn_client = null;
    update_ui_state();
  });


  client.on('data', chunk => {
    console.log(`Got data: ${chunk}`);
    chunks.push(chunk)

    if (chunk.match(/\r\n$/)) {
      const {ping} = JSON.parse(chunks.join(''));
      client.write(JSON.stringify({pong: ping}));
    }
  });
});


const terminalConsole = new nodeConsole.Console(process.stdout, process.stderr);
let child;

ipcRenderer.send("run-command", "ls");
ipcRenderer.on("run-command-result", (event, result) => {
  if (result.error) {
    console.error("Error:", result.error);
  } else {
    console.log("Output:", result.output);
  }
});

const printBoth = (str) => {
  console.log(`Javascript: ${str}`);
  terminalConsole.log(`Javascript: ${str}`);
};

const sendToProgram = (str) => {
  conn_client.write(str);
  // child.stdin.write(str);
  // child.stdout.on("data", (data) => {
  //   printBoth(
  //     `Following data has been piped from python program: ${data.toString(
  //       "utf8"
  //     )}`
  //   );
  // });
};

const startCodeFunction = () => {
  printBoth("Initiating program");

  child = exec("bash ../server_launch.sh", (error) => {
    if (error) {
      printBoth(`exec error: ${error}`);
    }
  });
};

const toggleLightFunction = () => {
  printBoth("Toggling light");

  fetch("http://localhost:5000/light/toggle")
};

const sendCodeFunction = () => {
  const stringToSend = document.getElementById("string_to_send").value;
  printBoth(`Sending "${stringToSend}" to program`);
  sendToProgram(stringToSend);
};

const stopCodeFunction = () => {
  printBoth("Terminated program");
  sendToProgram("terminate");
  child.stdin.end();
};

const openFileFunctionSync = () => {
  printBoth("From guiExample.js sending a request to main.js via ipc");
  ipcRenderer.send("open_json_file_sync");
};

const openFileFunctionAsync = () => {
  printBoth("From guiExample.js sending a request to main.js via ipc");
  ipcRenderer.send("open_json_file_async");
};

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("start_code")
    .addEventListener("click", startCodeFunction);
  document
    .getElementById("toggle_light")
    .addEventListener("click", toggleLightFunction);
  document
    .getElementById("send_code")
    .addEventListener("click", sendCodeFunction);
  document
    .getElementById("stop_code")
    .addEventListener("click", stopCodeFunction);
  document
    .getElementById("open_file_sync")
    .addEventListener("click", openFileFunctionSync);
  document
    .getElementById("open_file_async")
    .addEventListener("click", openFileFunctionAsync);
});
