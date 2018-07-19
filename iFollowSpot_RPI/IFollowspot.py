from __future__ import print_function

import paho.mqtt.client as mqtt
import time
from RF24 import *
import RPi.GPIO as GPIO

#NRF24
irq_gpio_pin = None
radio = RF24(22, 0);

pipes = [0xF0F0F0F0E1, 0xF0F0F0F0D2]
send_payload = ''
millis = lambda: int(round(time.time() * 1000))

radio.begin()
radio.enableDynamicPayloads()
radio.setRetries(5,15)
radio.printDetails()

radio.openWritingPipe(pipes[0])
radio.openReadingPipe(1,pipes[1])

#MQTT
MQTT_SERVER = "192.168.1.1"
MQTT_PATH1 = "ifollowspot"

def on_connect(client, userdata, flags, rc):

    print("============== MQTT ==============")
    print("MQTT: Connected with result code "+str(rc))
    print("==================================")

    client.subscribe(MQTT_PATH1)

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
    send_payload = msg.payload

    # First, stop listening so we can talk.
    radio.stopListening()
    # Take the time, and send it.  This will block until complete
    print('Now sending: ' + str(send_payload))
    radio.write(send_payload)

    # Now, continue listening
    radio.startListening()

    # Wait here until we get a response, or timeout
    started_waiting_at = millis()
    timeout = False
    while (not radio.available()) and (not timeout):
        if (millis() - started_waiting_at) > 5:
            timeout = True

    # Describe the results
    if timeout:
        print('failed, response timed out.')
    else:
        # Grab the response, compare, and send to debugging spew
        len = radio.getDynamicPayloadSize()
        receive_payload = radio.read(len)

        # Spew it
        print('got response size={} value="{}"'.format(len, receive_payload.decode('utf-8')))

    time.sleep(0.005)

client = mqtt.Client(transport="websockets")
client.on_connect = on_connect
client.on_message = on_message

client.connect(MQTT_SERVER, 1883, 60)

client.loop_forever()
