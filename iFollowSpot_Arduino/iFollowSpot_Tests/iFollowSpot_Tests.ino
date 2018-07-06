/**
 * iFollowSpot 
 *
 * Created by Lasse Schinckel and Jonas Kern 
 */
 
#include <SPI.h>
#include <ArduinoJson.h>
//#include <Conceptinetics.h>
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

void setup(void)
{

  // Print preamble
  Serial.begin(115200);
  Serial.println(F("iFollowSpot"));

  // Setup and configure rf radio
  radio.begin();

  // enable dynamic payloads
  radio.enableDynamicPayloads();

  // optionally, increase the delay between retries & # of retries (Default: 5, 15)
  radio.setRetries(5,15);

  // Open pipes to other nodes for communication
  radio.openWritingPipe(pipes[1]);
  radio.openReadingPipe(1,pipes[0]);

  // Start listening
  radio.startListening();

  // Dump the configuration of the rf unit for debugging
  radio.printDetails();
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

    // Spew it
    Serial.print(F("Command received: "));
    Serial.println(receive_payload);

    // First, stop listening so we can talk
    radio.stopListening();

    // Decode JSON
    const size_t bufferSize = JSON_OBJECT_SIZE(2) + 20;
    DynamicJsonBuffer jsonBuffer(bufferSize);
    char* json = receive_payload;
    JsonObject& root = jsonBuffer.parseObject(json);
    int c = root["c"];
    int v = root["v"];

    // Print Channel and Value
    Serial.println(c);
    Serial.println(v);

    // Send the final one back.
    radio.write( receive_payload, len );
    Serial.println(F("Sent response."));

    // Now, resume listening so we catch the next packets.
    radio.startListening();
  }
  
}

