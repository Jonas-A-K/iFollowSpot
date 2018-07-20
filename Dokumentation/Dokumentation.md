# iFollowSpot – ITS-Projekt SoSe 2018
## Inhalt
1. [Einleitung](#1-einleitung)
2. [Fernbildübertragung (Laura Saupe)](#2-fernbildübertragung)
3. [WLAN-Access-Point (Laura Saupe)](#3-wlan-access-point)
4. [MQTT-Broker und -Client auf Raspberry Pi (Lasse Schinckel)](#4-mqtt-broker-und--client-auf-raspberry-pi)
5. [RF24-Schnittstelle zwischen Arduino und Raspberry Pi (Lasse Schinckel)](#5-rf24-schnittstelle-zwischen-arduino-und-raspberry-pi)
6. [DMX-Schnittstelle (Lasse Schinckel)](#6-dmx-schnittstelle)
7. [Webapplikation (Jonas Kern)](#7-webapplikation)
   1. [MQTT-Client über Websockets](#71-mqtt-client-über-websockets)
   2. [Videofeed](#72-videofeed)
   3. [Frontend](#73-frontend)
   4. [Package Management und Build Process](#74-package-management-und-build-process)
8. [Plakat](#8-plakat)
9. [Fazit](#9-fazit)
## 1. Einleitung
### Teilnehmer
* Laura Saupe (2219616)
* Lasse Schinckel (2219669)
* Jonas Kern (2219758)
### Kurzbeschreibung
Unser Produkt ermöglicht die Nachrüstung eines herkömmlichen DMX-gesteuerten Moving-Heads zu einem ferngesteuerten Verfolgerscheinwerfer mit Fernbildübertragung.
### Technische Umsetzung
USB-Kamera und Raspberry-Pi werden am Kopf des Scheinwerfers befestigt und über einen Akku mit Strom versorgt. Durch den Akku ist keine Kabelverbindung zur Basis des Scheinwerfers nötig, die die Bewegung des Kopfes einschränken würde.

Der Raspberry Pi stellt eine Webapplikation zur Verfügung, die sich auf allen modernen Smartphones und Tablets unabhängig vom verwendeten Betriebssystem ausführen lässt. Die App zeigt das Livebild der Kamera und bietet virtuelle Steuerelemente zur Kontrolle des Scheinwerfers. Das Gerät muss sich dafür im kabellosen Netzwerk des Raspberry Pis befinden.

Die Steuersignale des Nutzers werden per Netzwerk an den Raspberry Pi geschickt. Dieser sendet das Signal über eine 2,4GHz Funkverbindung (RF-24 Transceiver) zum Wireless-DMX-Controller an der Basis des Scheinwerfers.

Der Wireless-DMX-Controller besteht aus einem Arduino Nano Mikrocomputer, einem weiteren RF-24 Transceiver zum Empfang der Steuersingale und einem DMX-Interface. Der Arduino dekodiert die empfangenen Steuersignale und stellt sie über seine serielle Schnittstelle dem DMX-Interface zur Verfügung, welches daraus ein Signal nach DMX-Standard erzeugt, welches quasi von jedem Scheinwerfer verwendet wird.
### Verwendete Geräte
* Raspberry Pi 3 B
* Arduino Nano
* RF24 Transceiver (2x)
* MAX485 Interface für DMX
* USB-Webcam
* Montagematerial zur Befestigung der Kamera
* DMX-Interface
* Mobilgerät (Tablet, Smartphone)
* Moving-Head-Scheinwerfer
![iFollowSpot Geräte](/Dokumentation/iFollowSpot_Geraete.jpg)
Übersicht zu verwendeten Komponenten
![iFollowSpot Arduino Box](/Dokumentation/iFollowSpot_Box.jpg)
Geöffnete 3D-gedruckte Box mit Arduino, MAX485 und NRF24
### Schaltplan
![iFollowSpot Schaltplan](/Dokumentation/iFollowSpot_Schaltplan.png)
Schaltplan, Funkverbindung durch gestrichelte Linie dargestellt
### Arbeitsbereiche
* Laura Saupe: Fernbildübertragung (Kamerabild im Netzwerk zur Verfügung stellen), WLAN-Einrichtung
* Jonas Kern: Applikations-Entwicklung (Entwicklung der App mit Livebildanzeige und Steuerelementen)
* Lasse Schinckel: Moving-Head-Steuerung (Umwandlung von Netzwerkübertragung zu DMX-Signalen)
## 2. Fernbildübertragung
Zur Fernbildübertragung kommt die Applikation [Motion](https://motion-project.github.io) zum Einsatz, welche das Signal verschiedener Kameratypen in einem Netzwerk zur Verfügung stellen kann. Damit im Betrieb der Verfolger-Operator ein flüssig laufendes Livebild der Szenerie bekommt, in dem der Bildinhalt ausreichend erkäntlich ist wurden folgende Konfigurationen gewählt:
- Bildauflösung: 480x640px
- Codec: MPEG 422P
- Framerate: 25fps 

Motion bietet die Möglichkeit Videos, Timelaps und Fotos zu speichern. Diese Funktion wurde ausgeschaltet, weil dadurch die Arbeitsleistungs des Raspberry Pi erheblich gemindert wurde, was dazu führte das ein delayfreier Livestream nicht mehr übermittelt werden konnte. 
Folgendes Tutorial wurde verwendet: [Raspi als Überwachungskamera](https://tutorials-raspberrypi.de/raspberry-pi-ueberwachungskamera-livestream-einrichten/)
## 3. WLAN-Access-Point
Der Raspberry Pi öffnet ein eigenes WLAN: "iFollowSpot", in welches der Nutzer sich mit seinem Mobilgerät einloggen kann, um auf die Webapplikation zuzugreifen. Hierzu wurde der Raspberry Pi neu aufgesetzt und eine statische IP in den Nutzerkonfigurationen erstellt. Für die Zuweisung der Nutzerkonfigurationen wurde ein DHCP-Server und eine DNS-Maske angegeben. 
Folgendes Tutorial wurde zur Hilfe genommen: [WLAN-Accsess-Point](https://www.elektronik-kompendium.de/sites/raspberry-pi/2002171.htm)
## 4. MQTT-Broker und -Client auf Raspberry Pi
Um Daten von der Webapplikation empfangen zu können, wurde auf dem Raspi die Anwendung Mosquitto zur Erstellung eines MQTT-Brokers installiert.

Die IP Adresse vom Raspberry Pi wird hierbei als Broker Adresse genutzt. Um dann die Daten auslesen zu können, muss der Raspberry Pi sich zusätzlich selbst subscriben. 
## 5. RF24-Schnittstelle zwischen Arduino und Raspberry Pi
Mit dem bei uns eingesetzten nRF24L01 haben wir eine GHz-Funkverbindung vom Raspberry Pi zum Arduino an der Basis des Movingheads hergestellt, um für Mobilität des Kopfes zu sorgen. Hierfür wurde eine freie Library für den RF24 genutzt
[Library](https://github.com/nRF24/RF24).

Für die Umsetzung wurde folgender [Guide]( https://github.com/nRF24/RF24(https://tutorials-raspberrypi.de/funkkommunikation-zwischen-raspberry-pis-und-arduinos-2-4-ghz/) genutzt.

#### Senderseite

Der Raspberry Pi gibt die über MQTT empfangenden Daten über den nRF24 weiter an den Arduino. Der Chip nutzt das SPI Interface vom Raspberry Pi, somit muss dieses erst in der Konfiguration freigeschaltet werden. 

Zuerst muss dem Raspberry Pi gesagt werden, auf welche GPIO Pins die Information verschickt werden soll.

(CODE)

Um Daten schicken zu können, darf der Raspberry Pi nicht empfangen oder anders „nicht zuhören“.

(CODE)

Jetzt kann die Payload verschickt werden.

(CODE)

Als letztes hört der Raspberry Pi wieder zu und prüft eine Response oder einen Timeout. 

(CODE)

Der Code wird immer nur on_message ausgeführt. D.h. es wird immer nur ein Signal geschickt wenn auch ein Signal über MQTT angekommen ist.

#### Empfängerseite

Am Arduino wird dann die Nachricht empfangen und entschlüsselt.

Auch dem Arduino muss mitgeteilt werden auf welchen Pins der Datenfluss stattfindet.

(CODE)

Um dynamische Größen empfangen zu können, müssen dynamische Payloads aktiviert werden.

(CODE)

Mit einer dynamischen Payload Größe können nun die Daten ausgelesen werden.

(CODE)


Am Ende schickt der Arduino eine Response zurück.

(CODE)
## 6. DMX-Schnittstelle
Der MAX485 ist eine physikalische Schnittstelle zur Übertragung eines invertierten und eines nichtinvertierten Datensignals. Dieser Standart wird RS-485 genannt. Dieser wurde gewählt, da DMX genau auf diesem Standart basiert und nur noch Pulsfolgen, die dem DMX Protokoll entsprechen, geschickt werden müssen. Für die Übertragung der Daten ist der tx Pin vom MAX485 zuständig. Dieser gibt das Signal einmal invertiert und einmal nicht invertiert an die beiden Ausgänge A und B. Diese werden dann mit einem 3 oder 5 poligen XLR Stecker verbunden. Bei unserem Projekt haben wir uns für die 5 polige Variante entschieden. Für eine sicherere Variante wäre noch eine Erdung nötig, die wir im kleinen Rahmen des Projektes jedoch vernachlässigt haben.

Zur Übertragung von DMX Daten wurde auf dem Arduino die Library von Van der Meeren (https://github.com/rad1o/l0unge-sender/tree/master/arduino_dmx) genutzt.

Für die Einstellung eines DMX Channels wird dann nur der Channel und die dazugehörige Value benötigt, welche über den nRF24 als .json Datei weitergeleitet wurden. Hierfür wird die .json Datei entpackt.

(CODE)

Danach werden die Werte in DMX Pulsfolgen umgewandelt.

(CODE)

Erst jetzt erhält der Movinghead ein DMX Signal und zeigt dies über eine Kontrollleuchte an.
## 7. Webapplikation
### 7.1 MQTT-Client über Websockets
Um MQTT in unserer Webapplikation verwenden zu können, nutzen wir MQTT über Websockets. Dafür verwenden wir die Bibliothek "MQTT.js", die sowohl für Node.js-Anwendungen als auch für den Browser entwickelt wurde. "MQTT.js" ist auf GitHub unter MIT-Lizenz frei verfügbar (https://github.com/mqttjs/MQTT.js).
#### Verwendung von MQTT.js in unserer Webapplikaition
##### 1. Verbindung zum Server
Um uns mit dem MQTT-Broker auf dem Raspberry Pi zu verbinden, richten wir eine MQTT-Websocket-Verbindung ein.
```js
var client = mqtt.connect({host: '192.168.1.1', port: 1883});
```
[Link zum Code](https://github.com/Jonas-A-K/iFollowSpot/blob/5347b54144479db5bdce12d285f371ea0b402455/iFollowSpot_web/js/app.js#L9)

Alle weiteren Funktionen, dieser Verbindungen können dann aus dem Objekt "client" heraus aufgerufen werden.
##### 2. Senden von Steuerbefehlen für den Moving-Head
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
##### 3. Abonieren des Themas "ifollowspot"
Wir abonieren das Thema "ifollowspot", um die Nachrichten, die wir verschicken auch selbst empfangen zu können. Dies dient dazu, dass die übertragenen Werte auch dem Nutzer im Frontend angezeigt werden können, und somit ein direktes Feedback zur Qualität der Verbindung besteht. Falls sich also z. B. der Wert des Dimmers nur sprunghaft und mit viel Verzögerung ändert, spricht dies für eine schlechte Verbindung zum Netzwerk.
```js
client.subscribe(topic);
```
[Link zum Code](https://github.com/Jonas-A-K/iFollowSpot/blob/5347b54144479db5bdce12d285f371ea0b402455/iFollowSpot_web/js/app.js#L541)
##### 4. Behandlung von MQTT-Ereignissen
Das Client-Objekt liefert Events, auf deren Eintritt reagiert werden kann. Das wichtigste Event ist das Event `"message"`:
```js
client.on("message", function (topic, payload) {
…
```
[Link zum Code](https://github.com/Jonas-A-K/iFollowSpot/blob/5347b54144479db5bdce12d285f371ea0b402455/iFollowSpot_web/js/app.js#L292)

Bei einer neuen Nachricht mit Topic "ifollowspot" wird mit Hilfe dieses Callbacks der aktuelle Status des jewiligen Kanals dem Nutzer angezeigt.
Andere MQTT-Events sind `connect`, `reconnect`, `close`, `offline` und `error`, die im Frontend jeweils eine entsprechende Benachrichtung für den Nutzer auslösen und per Icon über den Status der Verbindung informieren.
### 7.2 Videofeed
Der MJPEG-Stream, den der Raspberry Pi zur Verfügung stellt, wird in der Webapplikation über ein einfaches HTML `<img>`-Element integriert.
```html
<img class="fs-videofeed" src="http://192.168.1.1:8081" width="640" height="480">
```
[Link zum Code](https://github.com/Jonas-A-K/iFollowSpot/blob/1ff794e9e831501c3341e7d5210e8554b67e436a/iFollowSpot_web/index.html#L77)

Diese einfache Lösung schränkt leider die Browserkompatibilität ein wenig ein. Apples Safari zeigt bei einem Reload der Seite in manchen Fällen kein Bild mehr. Dieses Problem besteht jedoch in keinem anderen modernen Browser wie z. B. Chrome oder Firefox.
### 7.3 Frontend
Für das Frontend kommt das User-Interface-Framework "UIKit" zum Einsatz, welches auf https://getuikit.com mit MIT-Lizenz zur Verfügung steht. Das Framework kommt mit einer SCSS-Bibliothek und eine Javascript-Bibliothek.
#### UIKit SCSS Implementierung
Wir importieren UIKit in unsere [app.scss-Datei](https://github.com/Jonas-A-K/iFollowSpot/blob/master/iFollowSpot_web/scss/app.scss) die später alle unsere Styling-Anweisungen enthalten wird.
```scss
@import "../bower_components/uikit/src/scss/variables-theme.scss";
@import "../bower_components/uikit/src/scss/mixins-theme.scss";
…
@import "../bower_components/uikit/src/scss/uikit-theme.scss";
```
[Link zum Code](https://github.com/Jonas-A-K/iFollowSpot/blob/1ff794e9e831501c3341e7d5210e8554b67e436a/iFollowSpot_web/scss/app.scss#L15)

Somit können wir auf alle Variablen und Mixins zugreifen und das Framework für unser Design anpassen.
#### UIKit Javascript Implementierung
Die Javascript-Bibliothek von UIKit wird direkt in [index.html](https://github.com/Jonas-A-K/iFollowSpot/blob/master/iFollowSpot_web/index.html) eingebunden.
```html
<script src="bower_components/uikit/dist/js/uikit.min.js"></script>
<script src="bower_components/uikit/dist/js/uikit-icons.min.js"></script>
```
[Link zum Code](https://github.com/Jonas-A-K/iFollowSpot/blob/1ff794e9e831501c3341e7d5210e8554b67e436a/iFollowSpot_web/index.html#L8)

Für schnellere Ladezeiten kommt hier die minifizierte Version zum Einsatz.
### 7.4 Package Management und Build Process
Zur einfachen Verwaltung von Dependencies und zur schnellen, sicheren und effizienten Verarbeitung von SCSS und Javascript verwenden wir das Build-Tool [CodeKit](https://codekitapp.com). CodeKit integriert den Package Manager [Bower](https://bower.io) über den wir das UIKit-Framework verwalten und Updaten können. CodeKit übernimmt ebenfalls das Kompilieren von SCSS zu CSS, das Minifizieren für CSS und Javascript, sowie das Anlegen von Source-Maps. Vor der Verarbeitung prüft CodeKit auf Syntaxfehler. Die Build-Konfiguration unserer Webapplikation speichert CodeKit unter [iFollowSpot_web/config.codekit3](https://github.com/Jonas-A-K/iFollowSpot/blob/master/iFollowSpot_web/config.codekit3).
## 8. Plakat
![iFollowSpot Plakat](/Dokumentation/iFollowSpot_Plakat.jpg)
## 9. Fazit
