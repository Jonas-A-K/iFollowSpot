/**
 * iFollowSpot 
 *
 * Created by Lasse Schinckel and Jonas Kern 
 */
 
#include <SPI.h>
#include <ArduinoJson.h>
#include <Conceptinetics.h>
#include "nRF24L01.h"
#include "RF24.h"

// Hardware configuration
// Set up nRF24L01 radio on SPI bus plus pins 7 & 8
RF24 radio(7,8);

// Topology
// Radio pipe addresses for the 2 nodes to communicate.
const uint64_t pipes[2] = { 0xF0F0F0F0E1LL, 0xF0F0F0F0D2LL };

// Payload
const int min_payload_size = 4;
const int max_payload_size = 32;
char receive_payload[max_payload_size+1]; // +1 to allow room for a terminating NULL char

// DMX Channels
DMX_Master dmx_master ( 100 , 2 );

void setup(void)
{

  // Enable DMX, Set Shutter and Dimmer
  dmx_master.enable();
  //dmx_master.setChannelRange( 1, 2, 255 );

  // Setup and configure rf radio
  radio.begin();

  // enable dynamic payloads
  radio.enableDynamicPayloads();

  // optionally, increase the delay between retries & # of retries
  radio.setRetries(5,15);

  // Open pipes to other nodes for communication
  radio.openWritingPipe(pipes[1]);
  radio.openReadingPipe(1,pipes[0]);

  // Start listening
  radio.startListening();
}

void loop(void)
{

  // if there is data ready
  while ( radio.available() )
  {

    // Fetch the payload, and see if this was the last one.
    uint8_t len = radio.getDynamicPayloadSize();
    
    // If a corrupt dynamic payload is received, it will be flushed
    if(!len){
      continue; 
    }
    
    radio.read( receive_payload, len );

    // Put a zero at the end for easy printing
    receive_payload[len] = 0;

    // Decode JSON
    const size_t bufferSize = JSON_OBJECT_SIZE(2) + 20;
    DynamicJsonBuffer jsonBuffer(bufferSize);
    char* json = receive_payload;
    JsonObject& root = jsonBuffer.parseObject(json);
    int c = root["c"];
    int v = root["v"];


    // Set Channel and Value
    dmx_master.setChannelValue ( c, v );

    // First, stop listening so we can talk
    radio.stopListening();

    // Send the final one back.
    radio.write( receive_payload, len );

    // Now, resume listening so we catch the next packets.
    radio.startListening();
  }
}

