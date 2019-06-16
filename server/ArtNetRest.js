'use strict';

const Console = require('./ArtNetConsole');
const express = require('express');
const bodyParser = require("body-parser");

const CONSOLE_KEY = 'rest';

let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

class ArtNetRest {
    
    constructor() {
        let app = express();
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(allowCrossDomain);
        app.get('/', this.getStatus());
        
        app.post('/send', function (req, res) {
            let value = req.body.value;
            let send = new Uint8Array([value]);
            for(let i = 0; i < clients.length; i++) {
                server.send(Buffer.from(send), 9050, slaves[i].ipAdress);
            } 
            status.packets.send++;
            res.send('sended to artnet');
        });
        app.listen(9051);
        Console.info('Service listening on 9051', 'rest')
    }

    static getStatus(request, respond) {
        respond.setHeader("Content-Type", "application/json");
        respond.send(JSON.stringify(status));
    }

}

module.exports = ArtNetRest