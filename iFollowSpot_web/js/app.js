/*
 * iFollowSpot Web Application
 * created by Jonas Kern 2018
 * Licensed under MIT License
 *
 */

// ========== MQTT CONFIGURATION ==========
var client = mqtt.connect({host: 'test.mosquitto.org', port: 8080});
var topic = "ifollowspot/demo";



// ========== DEFAULT SETTINGS ==========
var dmxDimmerChD = 1;
var dmxPanChD    = 2;
var dmxTiltChD   = 4;

var dimmerStartD = 128;
var panCenterD   = 0;
var tiltCenterD  = 0;

var panMaxD      = 90;
var panMinD      = -90;

var tiltMaxD     = 90;
var tiltMinD     = -90;



// ========== INITIALISING VARIABLES ==========

// Settings to default values
var dmxDimmerCh = dmxDimmerChD;
var dmxPanCh    = dmxPanChD;
var dmxTiltCh   = dmxTiltChD;

var dimmerStart = dimmerStartD;
var panCenter   = panCenterD;
var tiltCenter  = tiltCenterD;

var panMax      = panMaxD;
var panMin      = panMinD;

var tiltMax     = tiltMaxD;
var tiltMin     = tiltMinD;

// Pan and tilt to origin
var panDeg      = panCenter;
var tiltDeg     = panCenter;

// Default DMX values for all channels
var dimmer      = dimmerStart;
var pan         = degreeToDMX(panCenter);
var tilt        = degreeToDMX(tiltCenter);

// Interval and timer for mousedown event
var timer;
var interval = 100;

// UI Controls: On screen controls
var dimmerControl = document.getElementById("dimmer-input");
var leftControl   = document.getElementById("left");
var rightControl  = document.getElementById("right");
var upControl     = document.getElementById("up");
var downControl   = document.getElementById("down");

// UI Controls: Settings
var dimmerDMXControl  = document.getElementById("dimmer-channel");
var panDMXControl     = document.getElementById("pan-channel");
var tiltDMXControl    = document.getElementById("tilt-channel");

var panCenterControl  = document.getElementById("pan-center");
var tiltCenterControl = document.getElementById("tilt-center");

var panMaxControl     = document.getElementById("pan-max");
var panMinControl     = document.getElementById("pan-min");

var tiltMaxControl    = document.getElementById("tilt-max");
var tiltMinControl    = document.getElementById("tilt-min");

var saveControl       = document.getElementById("save-settings");
var resetControl      = document.getElementById("reset-settings");
var restoreControl    = document.getElementById("restore-settings");



// ========== Functions ==========

// Convert degrees to 8-Bit
function degreeToDMX(degreeValue) {
  return Math.round((((degreeValue * 65536) / 360) * 256) / 65536);
}

// Reset settings
function resetSettings() {
  dmxDimmerCh = dmxDimmerChD;
  dmxPanCh    = dmxPanChD;
  dmxTiltCh   = dmxTiltChD;

  dimmerStart = dimmerStartD;
  panCenter   = panCenterD;
  tiltCenter  = tiltCenterD;

  panMax      = panMaxD;
  panMin      = panMinD;

  tiltMax     = tiltMaxD;
  tiltMin     = tiltMinD;
}

// Display settings
function displaySettings() {

  // Display DMX chennels in settings menu
  document.getElementById("dimmer-channel").value = dmxDimmerCh;
  document.getElementById("pan-channel").value = dmxPanCh;
  document.getElementById("tilt-channel").value = dmxTiltCh;

  // Display origin values in settings menu
  document.getElementById("pan-center").value = panCenter;
  document.getElementById("tilt-center").value = tiltCenter;

  // Display limits in settings menu
  document.getElementById("pan-max").value = panMax;
  document.getElementById("pan-min").value = panMin;
  document.getElementById("tilt-max").value = tiltMax;
  document.getElementById("tilt-min").value = tiltMin;
}

// Display DMX Status
function displayDMXStatus() {

  // Display control values (Percentage/Degree)
  document.getElementById("dimmer-output").innerHTML = Math.round((((dimmer * 65536) / 256) * 100) / 65536);
  document.getElementById("pan").innerHTML = panDeg + "°";
  document.getElementById("tilt").innerHTML = tiltDeg + "°";

  // Display DMX channels
  document.getElementById("dimmer-ch-status").innerHTML = dmxDimmerCh;
  document.getElementById("pan-ch-status").innerHTML = dmxPanCh;
  document.getElementById("tilt-ch-status").innerHTML = dmxTiltCh;

  // Display DMX raw values
  document.getElementById("dimmer-dmx-value").innerHTML = dimmer;
  document.getElementById("pan-dmx-value").innerHTML = pan;
  document.getElementById("tilt-dmx-value").innerHTML = tilt;
}

// Set max/min on center inputs
function setMaxMinForCenter() {
  document.getElementById("pan-center").max = panMax;
  document.getElementById("pan-center").min = panMin;
  document.getElementById("tilt-center").max = tiltMax;
  document.getElementById("tilt-center").min = tiltMin;
}

// Check if the client is connected to the MQTT server
function checkMqttStatus() {
  if (client.connected == true) {
    UIkit.notification("Connection Status: OK", {status: 'success'});
  } else {
    UIkit.notification("Connection Status: Device unavailable", {status: 'danger'});
  }
}

// Publish a command to the MQTT server
function publishCommand(channel, value) {
  cmdObj = { "ch":channel, "value":value };
  cmdJSON = JSON.stringify(cmdObj);
  client.publish(topic, cmdJSON);
}

function restoreSettings(notification) {
  if (typeof(Storage) !== "undefined") {
    if (localStorage.settings) {
      if (notification) {
        UIkit.notification("Last save state successfully restored.", {status: 'success'});
      }

      settings = JSON.parse(localStorage.settings);

      // Saved settings
      dmxDimmerCh = settings.dmxDimmerCh;
      dmxPanCh    = settings.dmxPanCh;
      dmxTiltCh   = settings.dmxTiltCh;

      panCenter   = settings.panCenter;
      tiltCenter  = settings.tiltCenter;

      panMax      = settings.panMax;
      panMin      = settings.panMin;

      tiltMax     = settings.tiltMax;
      tiltMin     = settings.tiltMin;

      panDeg = panCenter;
      tiltDeg = panCenter;

      pan = degreeToDMX(panCenter);
      tilt = degreeToDMX(tiltCenter);

    } else {
      UIkit.notification("No saved state found.", {status: 'primary'});
    }
  } else {
    UIkit.notification("This Browser doesn't support Web Storage. Settings can't be restored.", {status: 'danger'});
  }

  setMaxMinForCenter();
  displaySettings();
  displayDMXStatus();
}



// ========== INITILISATION ON PAGE LOAD ==========

// Load settings from local storage or use default values, display values in settings menu
document.addEventListener('DOMContentLoaded', function() {
  restoreSettings();
  setMaxMinForCenter();
  displaySettings();
  displayDMXStatus();
});

// Subscribe to MQTT topic (see MQTT Configuration)
client.subscribe(topic);



// ========== INITILISATION ON PAGE LOAD ==========

// Read MQTT Messages and set control values
client.on("message", function (topic, payload) {

  cmdString = payload.toString();
  cmdJSON = JSON.parse(cmdString);
  channel = cmdJSON.ch;
  value = cmdJSON.value;

  switch (channel) {
    case dmxDimmerCh:
      dimmer = value;
      break;
    case dmxPanCh:
      pan = value;
      panDeg = Math.round((((value * 65536) / 256) * 360) / 65536);
      break;
    case dmxTiltCh:
      tilt = value;
      tiltDeg = Math.round((((value * 65536) / 256) * 360) / 65536);
      break;
    default:
      break;
  }

  displayDMXStatus()

})



// ========== HANDLE MQTT EVENTS ==========

client.on("connect", function (connack) {
  UIkit.notification("Successfully connected to iFollowSpot device", {status: 'success'});
  document.getElementById("mqtt-status").setAttribute("uk-icon", "link");
})

client.on("reconnect", function () {
  document.getElementById("mqtt-status").setAttribute("uk-icon", "clock");
})

client.on("close", function () {
  if (client.reconnecting == false) {
    UIkit.notification("Connection has been closed.", {status: 'warning'});
  }
  document.getElementById("mqtt-status").setAttribute("uk-icon", "bolt");
})

client.on("offline", function () {
  UIkit.notification("Client is offline.", {status: 'danger'});
  document.getElementById("mqtt-status").setAttribute("uk-icon", "warning");
})

client.on("error", function (error) {
  UIkit.notification("An Error occured: " + error);
})



// ========== HANDLE CONTROL INPUTS ==========

dimmerControl.addEventListener("input", function () {
  publishCommand(dmxDimmerCh, this.value);
});

leftControl.addEventListener("mousedown", function () {
   timer = setInterval(function () {
        publishCommand(dmxPanCh, pan - 1);
   }, interval);
});

rightControl.addEventListener("mousedown", function () {
   timer = setInterval(function () {
        publishCommand(dmxPanCh, pan + 1);
   }, interval);
});

upControl.addEventListener("mousedown", function () {
   timer = setInterval(function () {
        publishCommand(dmxTiltCh, tilt + 1);
   }, interval);
});

downControl.addEventListener("mousedown", function () {
   timer = setInterval(function () {
        publishCommand(dmxTiltCh, tilt - 1);
   }, interval);
});

document.addEventListener("mouseup", function() {
  if (timer) clearInterval(timer)
});



// ========== HANDLE SETTINGS ==========

// DMX channels
dimmerDMXControl.addEventListener("change", function() {
  dmxDimmerCh = this.value;
});

panDMXControl.addEventListener("change", function() {
  dmxPanCh = this.value;
});

tiltDMXControl.addEventListener("change", function() {
  dmxTiltCh = this.value;
});

// Center
panCenterControl.addEventListener("change", function() {
  panCenter = this.value;
  publishCommand(dmxPanCh, degreeToDMX(panCenter));
});

tiltCenterControl.addEventListener("change", function() {
  tiltCenter = this.value;
  publishCommand(dmxTiltCh, degreeToDMX(tiltCenter));
});

// Limits
panMaxControl.addEventListener("change", function() {
  panMax = this.value;
  publishCommand(dmxPanCh, degreeToDMX(panMax));
  setMaxMinForCenter();
});

panMinControl.addEventListener("change", function() {
  panMin = this.value;
  publishCommand(dmxPanCh, degreeToDMX(panMin));
  setMaxMinForCenter();
});

tiltMaxControl.addEventListener("change", function() {
  tiltMax = this.value;
  publishCommand(dmxTiltCh, degreeToDMX(tiltMax));
  setMaxMinForCenter();
});

tiltMinControl.addEventListener("change", function() {
  tiltMin = this.value;
  publishCommand(dmxTiltCh, degreeToDMX(tiltMin));
  setMaxMinForCenter();
});

// Save settings
saveControl.addEventListener("click", function() {

  settings = {
    "dmxPanCh": dmxPanCh,
    "dmxTiltCh": dmxTiltCh,
    "panCenter": panCenter,
    "tiltCenter": tiltCenter,
    "panMax": panMax,
    "panMin": panMin,
    "tiltMax": tiltMax,
    "tiltMin": tiltMin
  };

  settingsString = JSON.stringify(settings);

  if (typeof(Storage) !== "undefined") {
    localStorage.setItem("settings", settingsString);
    UIkit.notification("Your settings have been saved.", {status: 'success'});
  } else {
    UIkit.notification("This browser doesn't support web storage. Settings can't be stored locally.", {status: 'danger'});
  }

});

// Reset settings
resetControl.addEventListener("click", function() {

  // Remove stored settings
  if (typeof(Storage) !== "undefined") {
    localStorage.removeItem("settings");
    UIkit.notification("Settings have been reset.", {status: 'success'});
  } else {
    UIkit.notification("This browser doesn't support web storage.", {status: 'danger'});
  }

  resetSettings();
  displaySettings();
  displayDMXStatus();

});

// Restore settings
restoreControl.addEventListener("click", function() {
  restoreSettings();
});
