//
//  MQTTHandler.swift
//  iFollowSpot
//
//  Created by Jonas Kern on 28.05.18.
//  Copyright © 2018 Jonas Kern. All rights reserved.
//

import Foundation
import Moscapsule

class MQTTHandler {
    
    func testConnectToMQTTServer() {
        
        moscapsule_init()
        
        let clientId = "clientId-OfJjRVmSOA"
        let mqttConfig = MQTTConfig(clientId: clientId, host: "broker.mqttdashboard.com", port: 8000, keepAlive: 60)
        
        mqttConfig.onConnectCallback = { returnCode in
            NSLog("Return Code is \(returnCode.description) (this callback is declared in swift.)")
        }
        mqttConfig.onDisconnectCallback = { reasonCode in
            NSLog("Reason Code is \(reasonCode.description) (this callback is declared in swift.)")
        }
        mqttConfig.onSubscribeCallback = { (messageId, grantedQos) in
            NSLog("subscribed (mid=\(messageId),grantedQos=\(grantedQos))")
        }
        mqttConfig.onMessageCallback = { mqttMessage in
            if mqttMessage.topic == "iFollowSpot" {
                NSLog("MQTT Message received: payload= " + (mqttMessage.payloadString)!)
            }
        }
        
        let mqttClient = MQTT.newConnection(mqttConfig)
        
        sleep(10)
        
        mqttClient.subscribe("iFollowSpot", qos: 2)
        
        sleep(20)
        mqttClient.disconnect()
        sleep(2)
    }
    
}
