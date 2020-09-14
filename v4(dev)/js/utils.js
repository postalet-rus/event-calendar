"use strict";
let loadScriptStatus;
let timesToCheck = 0;


// loading status
function loadCheck() {
  if (!loadScriptStatus) {
    timesToCheck++;
  }
  if (timesToCheck >= 3 || loadScriptStatus) {
    document.querySelector("#loadingMsg").innerHTML = "Error was occured while trying to load main.js";
    clearInterval(loaded);
  }
}

const loaded = setInterval(loadCheck, 1000);