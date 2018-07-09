/*
 * iFollowSpot Web Application
 * created by Jonas Kern 2018
 * Licensed under MIT License
 *
 */

// ========== MQTT CONFIGURATION ==========
var client = mqtt.connect({host: '192.168.1.1', port: 1883});
var topic = "ifollowspot";



// ========== DEFAULT SETTINGS ==========
var dmxShutterChD  = 1;
var dmxDimmerChD   = 2;
var dmxPanChD      = 3;
var dmxTiltChD     = 5;

var panInvertD     = false;
var tiltInvertD    = false;

var dimmerStartD   = 128;
var panCenterD     = 0;
var tiltCenterD    = 0;

var panFullD       = 540;
var tiltFullD      = 180;

var panMaxD        = 90;
var panMinD        = -90;

var tiltMaxD       = 90;
var tiltMinD       = -90;

var shutterOpenD   = 255;
var shutterClosedD = 0;



// ========== INITIALISING VARIABLES ==========

// Settings to default values
var dmxShutterCh   = dmxShutterChD;
var dmxDimmerCh    = dmxDimmerChD;
var dmxPanCh       = dmxPanChD;
var dmxTiltCh      = dmxTiltChD;

var panInvert      = panInvertD;
var tiltInvert     = tiltInvertD;

var dimmerStart    = dimmerStartD;
var panCenter      = panCenterD;
var tiltCenter     = tiltCenterD;

var panFull        = panFullD;
var tiltFull       = tiltFullD;

var panMax         = panMaxD;
var panMin         = panMinD;

var tiltMax        = tiltMaxD;
var tiltMin        = tiltMinD;

var shutterOpen    = shutterOpenD;
var shutterClosed  = shutterClosedD;

// Pan and tilt to origin
var panDeg      = panCenter;
var tiltDeg     = panCenter;

// Default DMX values for all channels
var shutter     = shutterClosed;
var dimmer      = dimmerStart;
var pan         = degToDMX(panCenter, panFull);
var tilt        = degToDMX(tiltCenter, tiltFull);

// UI Controls: On screen controls
var dimmerControl        = document.getElementById("dimmer-input");
var panControl           = document.getElementById("pan-control");
var tiltControl          = document.getElementById("tilt-control");
var shutterControl       = document.getElementById("shutter-control");

// UI Controls: Settings
var shutterDMXControl    = document.getElementById("shutter-channel");
var dimmerDMXControl     = document.getElementById("dimmer-channel");
var panDMXControl        = document.getElementById("pan-channel");
var tiltDMXControl       = document.getElementById("tilt-channel");

var panInvertControl     = document.getElementById("pan-invert");
var tiltInvertControl    = document.getElementById("tilt-invert");

var panCenterControl     = document.getElementById("pan-center");
var tiltCenterControl    = document.getElementById("tilt-center");

var panFullControl       = document.getElementById("pan-full");
var tiltFullControl      = document.getElementById("tilt-full");

var panMaxControl        = document.getElementById("pan-max");
var panMinControl        = document.getElementById("pan-min");

var tiltMaxControl       = document.getElementById("tilt-max");
var tiltMinControl       = document.getElementById("tilt-min");

var shutterOpenControl   = document.getElementById("shutter-open");
var shutterClosedControl = document.getElementById("shutter-closed");

var saveControl          = document.getElementById("save-settings");
var resetControl         = document.getElementById("reset-settings");
var restoreControl       = document.getElementById("restore-settings");



// ========== Functions ==========

// Convert degrees to 8-Bit
function degToDMX(degreeValue, fullRotation) {
  dmxValue = Math.round(((((degreeValue * 65536) / fullRotation) * 256) / 65536) + 128);
  if (dmxValue < 0) {
    dmxValue = 0;
  }
  if (dmxValue > 255) {
    dmxValue = 255;
  }
  return dmxValue;
}

// Reset settings
function resetSettings() {
  dmxShutterCh  = dmxShutterChD;
  dmxDimmerCh   = dmxDimmerChD;
  dmxPanCh      = dmxPanChD;
  dmxTiltCh     = dmxTiltChD;

  panInvert     = panInvertD;
  tiltInvert    = tiltInvertD;

  dimmerStart   = dimmerStartD;
  panCenter     = panCenterD;
  tiltCenter    = tiltCenterD;

  panFull       = panFullD;
  tiltFull      = tiltFullD;

  panMax        = panMaxD;
  panMin        = panMinD;

  tiltMax       = tiltMaxD;
  tiltMin       = tiltMinD;

  shutterOpen   = shutterOpenD;
  shutterClosed = shutterClosedD;
}

// Display settings
function displaySettings() {

  // Display DMX chennels in settings menu
  document.getElementById("shutter-channel").value = dmxShutterCh;
  document.getElementById("dimmer-channel").value = dmxDimmerCh;
  document.getElementById("pan-channel").value = dmxPanCh;
  document.getElementById("tilt-channel").value = dmxTiltCh;

  // Display origin values in settings menu
  document.getElementById("pan-invert").checked = panInvert;
  document.getElementById("tilt-invert").checked = tiltInvert;

  // Display origin values in settings menu
  document.getElementById("pan-center").value = panCenter;
  document.getElementById("tilt-center").value = tiltCenter;

  // Display full rotation values in settings menu
  document.getElementById("pan-full").value = panFull;
  document.getElementById("tilt-full").value = tiltFull;

  // Display limits in settings menu
  document.getElementById("pan-max").value = panMax;
  document.getElementById("pan-min").value = panMin;
  document.getElementById("tilt-max").value = tiltMax;
  document.getElementById("tilt-min").value = tiltMin;

  // Display shutter closed and open states
  document.getElementById("shutter-open").value = shutterOpen;
  document.getElementById("shutter-closed").value = shutterClosed;
}

// Display DMX Status
function displayDMXStatus() {

  // Display control values (Percentage/Degree)
  document.getElementById("dimmer-output").innerHTML = Math.round((((dimmer * 65536) / 256) * 100) / 65536) + "%";
  document.getElementById("pan").innerHTML = panDeg + "°";
  document.getElementById("tilt").innerHTML = tiltDeg + "°";

  // Display DMX channels
  document.getElementById("shutter-ch-status").innerHTML = dmxShutterCh;
  document.getElementById("dimmer-ch-status").innerHTML = dmxDimmerCh;
  document.getElementById("pan-ch-status").innerHTML = dmxPanCh;
  document.getElementById("tilt-ch-status").innerHTML = dmxTiltCh;

  // Display DMX raw values
  document.getElementById("shutter-dmx-value").innerHTML = shutter;
  document.getElementById("dimmer-dmx-value").innerHTML = dimmer;
  document.getElementById("pan-dmx-value").innerHTML = pan;
  document.getElementById("tilt-dmx-value").innerHTML = tilt;


}

// Set max/min on center inputs
function setMaxMin() {
  document.getElementById("pan-center").max = panMax;
  document.getElementById("pan-center").min = panMin;
  document.getElementById("pan-control").max = degToDMX(panMax, panFull);
  document.getElementById("pan-control").min = degToDMX(panMin, panFull);

  document.getElementById("tilt-center").max = tiltMax;
  document.getElementById("tilt-center").min = tiltMin;
  document.getElementById("tilt-control").max = degToDMX(tiltMax, tiltFull);
  document.getElementById("tilt-control").min = degToDMX(tiltMin, tiltFull);
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
  cmdObj = { "c":parseInt(channel), "v":parseInt(value) };
  cmdJSON = JSON.stringify(cmdObj);
  cmdString = channel + "," + value;
  // Publish as json
  client.publish(topic, cmdJSON);
  displayDMXStatus();
}

function restoreSettings(notification) {
  if (typeof(Storage) !== "undefined") {
    if (localStorage.settings) {
      if (notification) {
        UIkit.notification("Last save state successfully restored.", {status: 'success'});
      }

      settings = JSON.parse(localStorage.settings);

      // Saved settings
      dmxShutterCh  = parseInt(settings.dmxShutterCh);
      dmxDimmerCh   = parseInt(settings.dmxDimmerCh);
      dmxPanCh      = parseInt(settings.dmxPanCh);
      dmxTiltCh     = parseInt(settings.dmxTiltCh);

      panInvert     = settings.panInvert;
      tiltInvert    = settings.tiltInvert;

      panCenter     = parseInt(settings.panCenter);
      tiltCenter    = parseInt(settings.tiltCenter);

      panFull       = parseInt(settings.panFull);
      tiltFull      = parseInt(settings.tiltFull);

      panMax        = parseInt(settings.panMax);
      panMin        = parseInt(settings.panMin);

      tiltMax       = parseInt(settings.tiltMax);
      tiltMin       = parseInt(settings.tiltMin);

      shutterOpen   = parseInt(settings.shutterOpen);
      shutterClosed = parseInt(settings.shutterClosed);

    } else {
      UIkit.notification("No saved state found.", {status: 'primary'});
    }
  } else {
    UIkit.notification("This Browser doesn't support Web Storage. Settings can't be restored.", {status: 'danger'});
  }

  setMaxMin();
  displaySettings();
  displayDMXStatus();
}



// ========== HANDLE MQTT EVENTS ==========

// Read MQTT Messages and set control values
client.on("message", function (topic, payload) {

  cmdString = payload.toString();
  // JSON
  cmdJSON = JSON.parse(cmdString);
  channel = cmdJSON.c;
  value = cmdJSON.v;

  switch (parseInt(channel)) {
    case dmxShutterCh:
      shutter = value;
      break;
    case dmxDimmerCh:
      dimmer = value;
      break;
    case dmxPanCh:
      pan = value;
      panDeg = Math.round(((((value * 65536) / 256) * panFull) / 65536) - (panFull / 2));
      break;
    case dmxTiltCh:
      tilt = value;
      tiltDeg = Math.round(((((value * 65536) / 256) * tiltFull) / 65536) - (tiltFull / 2));
      break;
    default:
      break;
  }

  displayDMXStatus()

})

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

dimmerControl.addEventListener("input", _.debounce(function () {
  publishCommand(dmxDimmerCh, this.value);
}, 10, { trailing: true, leading: true }));

panControl.addEventListener("input", function () {
  if (this.value > degToDMX(panMin, panFull) && this.value < degToDMX(panMax, panFull)) {
    if (panInvert == true) {
      publishCommand(dmxPanCh, (255 - this.value));
    } else {
      publishCommand(dmxPanCh, this.value);
    }
    document.getElementById("pan").setAttribute("class", "");
  } else {
    document.getElementById("pan").setAttribute("class", "uk-text-danger");
  }
});

tiltControl.addEventListener("input", function () {
  if (this.value > degToDMX(tiltMin, tiltFull) && this.value < degToDMX(tiltMax, tiltFull)) {
    if (tiltInvert == true) {
      publishCommand(dmxTiltCh, (255 - this.value));
    } else {
      publishCommand(dmxTiltCh, this.value);
    }
    document.getElementById("tilt").setAttribute("class", "");
  } else {
    document.getElementById("tilt").setAttribute("class", "uk-text-danger");
  }
});

shutterControl.addEventListener("change", function() {
  if (this.checked == true) {
    publishCommand(dmxShutterCh, shutterOpen);
  } else {
    publishCommand(dmxShutterCh, shutterClosed);
  }
});



// ========== HANDLE SETTINGS ==========

// DMX channels
shutterDMXControl.addEventListener("change", function() {
  dmxShutterCh = this.value;
});

dimmerDMXControl.addEventListener("change", function() {
  dmxDimmerCh = this.value;
});

panDMXControl.addEventListener("change", function() {
  dmxPanCh = this.value;
});

tiltDMXControl.addEventListener("change", function() {
  dmxTiltCh = this.value;
});

// Channel inversion
panInvertControl.addEventListener("change", function() {
  panInvert = this.checked;
});

tiltInvertControl.addEventListener("change", function() {
  tiltInvert = this.checked;
});

// Center
panCenterControl.addEventListener("change", function() {
  panCenter = this.value;
  publishCommand(dmxPanCh, degToDMX(panCenter, panFull));
});

tiltCenterControl.addEventListener("change", function() {
  tiltCenter = this.value;
  publishCommand(dmxTiltCh, degToDMX(tiltCenter, tiltFull));
});

// Full Rotation
panFullControl.addEventListener("change", function() {
  panFull = this.value;
});

tiltFullControl.addEventListener("change", function() {
  tiltFull = this.value;
});

// Limits
panMaxControl.addEventListener("change", function() {
  panMax = this.value;
  publishCommand(dmxPanCh, degToDMX(panMax, panFull));
  setMaxMin();
});

panMinControl.addEventListener("change", function() {
  panMin = this.value;
  publishCommand(dmxPanCh, degToDMX(panMin, panFull));
  setMaxMin();
});

tiltMaxControl.addEventListener("change", function() {
  tiltMax = this.value;
  publishCommand(dmxTiltCh, degToDMX(tiltMax, tiltFull));
  setMaxMin();
});

tiltMinControl.addEventListener("change", function() {
  tiltMin = this.value;
  publishCommand(dmxTiltCh, degToDMX(tiltMin, tiltFull));
  setMaxMin();
});

shutterOpenControl.addEventListener("change", function() {
  shutterOpen = this.value;
  publishCommand(dmxShutterCh, shutterOpen);
});

shutterOpenControl.addEventListener("change", function() {
  shutterClosed = this.value;
  publishCommand(dmxShutterCh, shutterClosed);
});

// Save settings
saveControl.addEventListener("click", function() {

  settings = {
    "dmxShutterCh"  : dmxShutterCh,
    "dmxDimmerCh"   : dmxDimmerCh,
    "dmxPanCh"      : dmxPanCh,
    "dmxTiltCh"     : dmxTiltCh,
    "panInvert"     : panInvert,
    "tiltInvert"    : tiltInvert,
    "panCenter"     : panCenter,
    "tiltCenter"    : tiltCenter,
    "panFull"       : panFull,
    "tiltFull"      : tiltFull,
    "panMax"        : panMax,
    "panMin"        : panMin,
    "tiltMax"       : tiltMax,
    "tiltMin"       : tiltMin,
    "shutterOpen"   : shutterOpen,
    "shutterClosed" : shutterClosed
  };

  settingsString = JSON.stringify(settings);

  if (typeof(Storage) !== "undefined") {
    localStorage.setItem("settings", settingsString);
    UIkit.notification("Your settings have been saved.", {status: 'success'});
  } else {
    UIkit.notification("This browser doesn't support web storage. Settings can't be stored locally.", {status: 'danger'});
  }

  restoreSettings();

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
  restoreSettings(true);
});



// ========== INITILISATION ON PAGE LOAD ==========

// Load settings from local storage or use default values, display values in settings menu
document.addEventListener('DOMContentLoaded', function() {
  restoreSettings(true);
  setMaxMin();
  // Subscribe to MQTT topic (see MQTT Configuration)
  client.subscribe(topic);
  displaySettings();
  displayDMXStatus();

  publishCommand(dmxShutterCh, shutter);
  publishCommand(dmxDimmerCh, dimmer);
  publishCommand(dmxPanCh, pan);
  publishCommand(dmxTiltCh, tilt);

  dimmerControl.value = dimmer;
  panControl.value = pan;
  tiltControl.value = tilt;

});
