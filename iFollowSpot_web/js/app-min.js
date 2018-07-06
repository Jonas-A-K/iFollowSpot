function degToDMX(t,e){return dmxValue=Math.round(65536*t/e*256/65536+128),dmxValue<0&&(dmxValue=0),dmxValue>255&&(dmxValue=255),dmxValue}function resetSettings(){dmxDimmerCh=dmxDimmerChD,dmxPanCh=dmxPanChD,dmxTiltCh=dmxTiltChD,dimmerStart=dimmerStartD,panCenter=panCenterD,tiltCenter=tiltCenterD,panFull=panFullD,tiltFull=tiltFullD,panMax=panMaxD,panMin=panMinD,tiltMax=tiltMaxD,tiltMin=tiltMinD}function displaySettings(){document.getElementById("dimmer-channel").value=dmxDimmerCh,document.getElementById("pan-channel").value=dmxPanCh,document.getElementById("tilt-channel").value=dmxTiltCh,document.getElementById("pan-center").value=panCenter,document.getElementById("tilt-center").value=tiltCenter,document.getElementById("pan-full").value=panFull,document.getElementById("tilt-full").value=tiltFull,document.getElementById("pan-max").value=panMax,document.getElementById("pan-min").value=panMin,document.getElementById("tilt-max").value=tiltMax,document.getElementById("tilt-min").value=tiltMin}function displayDMXStatus(){document.getElementById("dimmer-output").innerHTML=Math.round(65536*dimmer/256*100/65536)+"%",document.getElementById("pan").innerHTML=panDeg+"°",document.getElementById("tilt").innerHTML=tiltDeg+"°",document.getElementById("dimmer-ch-status").innerHTML=dmxDimmerCh,document.getElementById("pan-ch-status").innerHTML=dmxPanCh,document.getElementById("tilt-ch-status").innerHTML=dmxTiltCh,document.getElementById("dimmer-dmx-value").innerHTML=dimmer,document.getElementById("pan-dmx-value").innerHTML=pan,document.getElementById("tilt-dmx-value").innerHTML=tilt}function setMaxMin(){document.getElementById("pan-center").max=panMax,document.getElementById("pan-center").min=panMin,document.getElementById("pan-control").max=degToDMX(panMax,panFull),document.getElementById("pan-control").min=degToDMX(panMin,panFull),document.getElementById("tilt-center").max=tiltMax,document.getElementById("tilt-center").min=tiltMin,document.getElementById("tilt-control").max=degToDMX(tiltMax,tiltFull),document.getElementById("tilt-control").min=degToDMX(tiltMin,tiltFull)}function checkMqttStatus(){1==client.connected?UIkit.notification("Connection Status: OK",{status:"success"}):UIkit.notification("Connection Status: Device unavailable",{status:"danger"})}function publishCommand(t,e){cmdObj={c:parseInt(t),v:parseInt(e)},cmdJSON=JSON.stringify(cmdObj),cmdString=t+","+e,client.publish(topic,cmdJSON),displayDMXStatus()}function restoreSettings(t){"undefined"!=typeof Storage?localStorage.settings?(t&&UIkit.notification("Last save state successfully restored.",{status:"success"}),settings=JSON.parse(localStorage.settings),dmxDimmerCh=parseInt(settings.dmxDimmerCh),dmxPanCh=parseInt(settings.dmxPanCh),dmxTiltCh=parseInt(settings.dmxTiltCh),panCenter=parseInt(settings.panCenter),tiltCenter=parseInt(settings.tiltCenter),panFull=parseInt(settings.panFull),tiltFull=parseInt(settings.tiltFull),panMax=parseInt(settings.panMax),panMin=parseInt(settings.panMin),tiltMax=parseInt(settings.tiltMax),tiltMin=parseInt(settings.tiltMin),panDeg=panCenter,tiltDeg=panCenter,pan=degToDMX(panCenter,panFull),tilt=degToDMX(tiltCenter,tiltFull)):UIkit.notification("No saved state found.",{status:"primary"}):UIkit.notification("This Browser doesn't support Web Storage. Settings can't be restored.",{status:"danger"}),setMaxMin(),displaySettings(),displayDMXStatus()}var client=mqtt.connect({host:"192.168.1.1",port:1883}),topic="ifollowspot",dmxDimmerChD=1,dmxPanChD=2,dmxTiltChD=4,dimmerStartD=128,panCenterD=0,tiltCenterD=0,panFullD=540,tiltFullD=180,panMaxD=90,panMinD=-90,tiltMaxD=90,tiltMinD=-90,dmxDimmerCh=dmxDimmerChD,dmxPanCh=dmxPanChD,dmxTiltCh=dmxTiltChD,dimmerStart=dimmerStartD,panCenter=panCenterD,tiltCenter=tiltCenterD,panFull=panFullD,tiltFull=tiltFullD,panMax=panMaxD,panMin=panMinD,tiltMax=tiltMaxD,tiltMin=tiltMinD,panDeg=panCenter,tiltDeg=panCenter,dimmer=dimmerStart,pan=degToDMX(panCenter,panFull),tilt=degToDMX(tiltCenter,tiltFull),dimmerControl=document.getElementById("dimmer-input"),panControl=document.getElementById("pan-control"),tiltControl=document.getElementById("tilt-control"),dimmerDMXControl=document.getElementById("dimmer-channel"),panDMXControl=document.getElementById("pan-channel"),tiltDMXControl=document.getElementById("tilt-channel"),panCenterControl=document.getElementById("pan-center"),tiltCenterControl=document.getElementById("tilt-center"),panFullControl=document.getElementById("pan-full"),tiltFullControl=document.getElementById("tilt-full"),panMaxControl=document.getElementById("pan-max"),panMinControl=document.getElementById("pan-min"),tiltMaxControl=document.getElementById("tilt-max"),tiltMinControl=document.getElementById("tilt-min"),saveControl=document.getElementById("save-settings"),resetControl=document.getElementById("reset-settings"),restoreControl=document.getElementById("restore-settings");client.on("message",function(t,e){switch(cmdString=e.toString(),cmdJSON=JSON.parse(cmdString),channel=cmdJSON.c,value=cmdJSON.v,parseInt(channel)){case dmxDimmerCh:dimmer=value;break;case dmxPanCh:pan=value,panDeg=Math.round(65536*value/256*panFull/65536-panFull/2);break;case dmxTiltCh:tilt=value,tiltDeg=Math.round(65536*value/256*tiltFull/65536-tiltFull/2);break;default:break}displayDMXStatus()}),client.on("connect",function(t){UIkit.notification("Successfully connected to iFollowSpot device",{status:"success"}),document.getElementById("mqtt-status").setAttribute("uk-icon","link")}),client.on("reconnect",function(){document.getElementById("mqtt-status").setAttribute("uk-icon","clock")}),client.on("close",function(){0==client.reconnecting&&UIkit.notification("Connection has been closed.",{status:"warning"}),document.getElementById("mqtt-status").setAttribute("uk-icon","bolt")}),client.on("offline",function(){UIkit.notification("Client is offline.",{status:"danger"}),document.getElementById("mqtt-status").setAttribute("uk-icon","warning")}),client.on("error",function(t){UIkit.notification("An Error occured: "+t)}),dimmerControl.addEventListener("input",_.debounce(function(){publishCommand(dmxDimmerCh,this.value)},10,{trailing:!0,leading:!0})),panControl.addEventListener("input",function(){this.value>degToDMX(panMin,panFull)&&this.value<degToDMX(panMax,panFull)?(publishCommand(dmxPanCh,this.value),document.getElementById("pan").setAttribute("class","")):document.getElementById("pan").setAttribute("class","uk-text-danger")}),tiltControl.addEventListener("input",function(){this.value>degToDMX(tiltMin,tiltFull)&&this.value<degToDMX(tiltMax,tiltFull)?(publishCommand(dmxTiltCh,this.value),document.getElementById("tilt").setAttribute("class","")):document.getElementById("tilt").setAttribute("class","uk-text-danger")}),dimmerDMXControl.addEventListener("change",function(){dmxDimmerCh=this.value}),panDMXControl.addEventListener("change",function(){dmxPanCh=this.value}),tiltDMXControl.addEventListener("change",function(){dmxTiltCh=this.value}),panCenterControl.addEventListener("change",function(){panCenter=this.value,publishCommand(dmxPanCh,degToDMX(panCenter,panFull))}),tiltCenterControl.addEventListener("change",function(){tiltCenter=this.value,publishCommand(dmxTiltCh,degToDMX(tiltCenter,tiltFull))}),panFullControl.addEventListener("change",function(){panFull=this.value}),tiltFullControl.addEventListener("change",function(){tiltFull=this.value}),panMaxControl.addEventListener("change",function(){panMax=this.value,publishCommand(dmxPanCh,degToDMX(panMax,panFull)),setMaxMin()}),panMinControl.addEventListener("change",function(){panMin=this.value,publishCommand(dmxPanCh,degToDMX(panMin,panFull)),setMaxMin()}),tiltMaxControl.addEventListener("change",function(){tiltMax=this.value,publishCommand(dmxTiltCh,degToDMX(tiltMax,tiltFull)),setMaxMin()}),tiltMinControl.addEventListener("change",function(){tiltMin=this.value,publishCommand(dmxTiltCh,degToDMX(tiltMin,tiltFull)),setMaxMin()}),saveControl.addEventListener("click",function(){settings={dmxDimmerCh:dmxDimmerCh,dmxPanCh:dmxPanCh,dmxTiltCh:dmxTiltCh,panCenter:panCenter,tiltCenter:tiltCenter,panFull:panFull,tiltFull:tiltFull,panMax:panMax,panMin:panMin,tiltMax:tiltMax,tiltMin:tiltMin},settingsString=JSON.stringify(settings),"undefined"!=typeof Storage?(localStorage.setItem("settings",settingsString),UIkit.notification("Your settings have been saved.",{status:"success"})):UIkit.notification("This browser doesn't support web storage. Settings can't be stored locally.",{status:"danger"}),restoreSettings()}),resetControl.addEventListener("click",function(){"undefined"!=typeof Storage?(localStorage.removeItem("settings"),UIkit.notification("Settings have been reset.",{status:"success"})):UIkit.notification("This browser doesn't support web storage.",{status:"danger"}),resetSettings(),displaySettings(),displayDMXStatus()}),restoreControl.addEventListener("click",function(){restoreSettings(!0)}),document.addEventListener("DOMContentLoaded",function(){restoreSettings(!0),setMaxMin(),client.subscribe(topic),displaySettings(),displayDMXStatus()});
//# sourceMappingURL=./app-min.js.map