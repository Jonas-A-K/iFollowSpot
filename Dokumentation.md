# iFollowSpot – ITS-Projekt SoSe 2018
## Inhalt
1. Einleitung
2. Fernbildübertragung (Laura Saupe)
3. WLAN Access-Point (Laura Saupe)
4. MQTT-Broker und -Client auf Raspberry Pi (Lasse Schinckel)
5. RF24-Schnittstelle zum zweiten Raspberry Pi (Lasse Schinckel)
6. MQTT-Client über Websockets (Jonas Kern)
7. Videofeed in der Web-Applikation (Jonas Kern)
8. Frontend der Web-Applikation (Jonas Kern)
9. Fazit
## 1. Einleitung
### Teilnehmer
* Laura Saupe (2219616)
* Lasse Schinckel (2219669)
* Jonas Kern (2219758)
### Kurzbeschreibung
Unser Produkt ermöglicht die Nachrüstung eines herkömmlichen DMX-gesteuerten Moving-Heads zu einem ferngesteuerten Verfolgerscheinwerfer mit Fernbildübertragung.
### Technische Umsetzung
Eine auf einem Moving-Head befestigte USB-Kamera übertragt ihr Livevideo an einen Raspberry Pi. Der Mikrocomputer stellt diesen Livestream per Netzwerk zur Verfügung.
Eine Applikation auf einem Mobilgerät empfängt das Videosignal der USB-Kamera und stellt dieses auf seinem Display dar.
Mit virtuellen Kontrollelementen auf dem Display lassen sich Parameter wie Drehung, Neigung, Zoom etc. einstellen, die vom Moving-Head umgesetzt werden.
Das Signal wird hierbei über Netzwerk vom Mobilgerät an den Raspberry Pi übertragen und per Funk an einen weiteren Mikrocomputer übertragen, der sich an der Basis des Scheinwerfers befindet. Über ein DMX-Interface erhält der Moving-Head sein Steuersignal.
### Verwendete Geräte
* Raspberry Pi 3 B (2x)
* USB-Webcam
* Montagematerial zur Befestigung der Kamera
* DMX-Interface
* Mobilgerät (Tablet, Smartphone)
* Moving-Head-Scheinwerfer
### Arbeitsbereiche
* Laura Saupe: Fernbildübertragung (Kamerabild im Netzwerk zur Verfügung stellen)
* Jonas Kern: Applikations-Entwicklung (Entwicklung der App mit Livebildanzeige und Steuerelementen)
* Lasse Schinckel: Moving-Head-Steuerung (Umwandlung von Netzwerkübertragung zu DMX-Signalen)
## 6. MQTT-Client über Websockets
Um MQTT in unserer Webapplikation verwenden zu können, nutzen wir MQTT über Websockets. Dafür verwenden wir die Bibliothek "MQTT.js", die sowohl für Node.js-Anwendungen als auch für den Browser entwickelt wurde. "MQTT.js" ist auf GitHub unter MIT-Lizenz frei verfügbar (https://github.com/mqttjs/MQTT.js).
### Verwendung von MQTT.js in unserer Webapplikaition
#### 1. Verbindung zum Server
Um uns mit dem MQTT-Broker auf dem Raspberry Pi zu verbinden, richten wir eine MQTT-Websocket-Verbindung ein.
```js
var client = mqtt.connect({host: '192.168.1.1', port: 1883});
```
[Link zum Code](https://github.com/Jonas-A-K/iFollowSpot/blob/5347b54144479db5bdce12d285f371ea0b402455/iFollowSpot_web/js/app.js#L9)
Alle weiteren Funktionen, dieser Verbindungen können dann aus dem Objekt "client" heraus aufgerufen werden.
#### 2. Senden von Steuerbefehlen für den Moving-Head
Mit der Funktion `publishCommand` werden Steuerbefehle für den Moving-Head über MQTT versendet. Dies erfolgt im JSON-Format.
```js
function publishCommand(channel, value) {
  cmdObj = { "c":parseInt(channel), "v":parseInt(value) };
  cmdJSON = JSON.stringify(cmdObj);
  client.publish(topic, cmdJSON);
  displayDMXStatus();
}
```
[Link zum Code](https://github.com/Jonas-A-K/iFollowSpot/blob/5347b54144479db5bdce12d285f371ea0b402455/iFollowSpot_web/js/app.js#L233)
Zwei Variablen werden im JSON übergeben. Mit `c` wird der DMX-Kanal bezeichnet, mit `v`der zugehörige Wert. Die Funktion `publish` des MQTT-Clients senden letztendlich die Daten an den Broker.
#### 3. Abonieren des Themas "ifollowspot"
Wir abonieren das Thema "ifollowspot", um die Nachrichten, die wir verschicken auch selbst empfangen zu können. Dies dient dazu, dass die übertragenen Werte auch dem Nutzer im Frontend angezeigt werden können, und somit ein direktes Feedback zur Qualität der Verbindung besteht. Falls sich also z. B. der Wert des Dimmers nur sprunghaft und mit viel Verzögerung ändert, spricht dies für eine schlechte Verbindung zum Netzwerk.
```js
client.subscribe(topic);
```
[Link zum Code](https://github.com/Jonas-A-K/iFollowSpot/blob/5347b54144479db5bdce12d285f371ea0b402455/iFollowSpot_web/js/app.js#L541)
#### 4. Behandlung von MQTT-Ereignissen
Das Client-Objekt liefert Events, auf deren Eintritt reagiert werden kann. Das wichtigste Event ist das Event `"message"`:
``` js
client.on("message", function (topic, payload) {
…
```
[Link zum Code](https://github.com/Jonas-A-K/iFollowSpot/blob/5347b54144479db5bdce12d285f371ea0b402455/iFollowSpot_web/js/app.js#L292)
Bei einer neuen Nachricht mit Topic "ifollowspot" wird mit Hilfe dieses Callbacks der aktuelle Status des jewiligen Kanals dem Nutzer angezeigt.
Andere MQTT-Events sind `connect`, `reconnect`, `close`, `offline` und `error`, die im Frontend jeweils eine entsprechende Benachrichtung für den Nutzer auslösen und per Icon über den Status der Verbindung informieren.
