# iFollowSpot
## ITS-Projekt SoSe 2018
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
* Fernbildübertragung (Kamerabild im Netzwerk zur Verfügung stellen)
* Moving-Head-Steuerung (Umwandlung von Netzwerkübertragung zu DMX-Signalen)
* Applikations-Entwicklung (Entwicklung der App mit Livebildanzeige und Steuerelementen)
