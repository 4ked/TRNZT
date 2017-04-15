//
//  ViewController.swift
//  TRNZT
//
//  Created by Max Goeke on 4/9/17.
//  Copyright © 2017 Max Goeke. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    @IBOutlet weak var webView: UIWebView!

    override func viewDidLoad() {
        super.viewDidLoad()
        let page = Bundle.main.path(forResource: "WebClient/Client/index", ofType: "html")!
        var content: String?
        do {
            content = try String(contentsOfFile: page, encoding: String.Encoding.utf8)
        } catch let error as NSError {
            print("error: \(error)")
        }
        
        let base = Bundle.main.path(forResource: "WebClient/Client/css/main", ofType: "css")!
        let baseUrl = URL(fileURLWithPath: base)
        webView.loadHTMLString(content!, baseURL: baseUrl)
    }


}


