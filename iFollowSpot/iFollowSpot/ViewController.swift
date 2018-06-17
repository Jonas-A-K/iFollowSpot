//
//  ViewController.swift
//  iFollowSpot
//
//  Created by Jonas Kern on 20.05.18.
//  Copyright © 2018 Jonas Kern. All rights reserved.
//

import UIKit
import AVFoundation
import AVKit

class ViewController: UIViewController {
    
    var playerController = AVPlayerViewController()
    var player:AVPlayer?

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        /*
        let userCredential = URLCredential(user: "root",
                                           password: "1",
                                           persistence: .permanent)
        
        let protectionSpace = URLProtectionSpace.init(host: "192.168.1.1",
                                                      port: 8081,
                                                      protocol: "http",
                                                      realm: nil,
                                                      authenticationMethod: nil)
        
        var credential: URLCredential? = URLCredentialStorage.shared.defaultCredential(for: protectionSpace)
        
        URLCredentialStorage.shared.setDefaultCredential(userCredential, for: protectionSpace)
         https://devimages.apple.com.edgekey.net/samplecode/avfoundationMedia/AVFoundationQueuePlayer_HLS2/master.m3u8
        */
        
        let testURL = Bundle.main.path(forResource: "Video", ofType: "mp4")
        
        guard let url = URL(string: testURL!) else {
            return
        }
            
        self.player = AVPlayer(url: url)
        self.playerController.player = self.player
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func playVideo(_ sender: AnyObject) {
        
        self.present(self.playerController, animated: true, completion: {
            
            self.playerController.player?.play()
            
        })
        
    }
    
    @IBAction func mqttConnect(_ sender: Any) {
        NSLog("Trying to connect…")
        MQTTHandler().testConnectToMQTTServer()
    }
    
}

