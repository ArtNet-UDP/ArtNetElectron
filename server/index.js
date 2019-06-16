const express = require('express');
const bodyParser = require("body-parser");
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const ArtNetSlave = require('./ArtNetSlave');
const ArtNet = require('./ArtNet');
const Console = require('./ArtNetConsole');

let ArtNetHelper;

let testSlaves = [
    '192.168.178.20',
    '192.168.178.44'
];

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(allowCrossDomain);

let slaves = [];

let status = { "status": "Online", "packets": { "send": 0, "received": 0 } }

server.on('error', (err) => {
    Console.error(`Server Error: \n${err.stack}`, 'udp4');
    status.status = "Offline";
    server.close();
});

server.on('close', () => {
    status.status = "Offline";
    Console.info('Server closed.', 'udp4');
});

server.on('message', (msg, info) => {
    if (msg.equals(Buffer.from("artnet_broadcast"))) {
        server.send(Buffer.from('{ "added": true, "message": "Added to Artnet!" }'), info.port, info.address);
        slaves.push(new ArtNetSlave(info.address));
    }
    ArtNetHelper.handleMessage(msg, info);
});

server.on('listening', () => {
    Console.info(`Server listening on ${server.address().port}`, 'udp4');
    server.setBroadcast(true);
    ArtNetHelper = new ArtNet(server, testSlaves);
});

app.get('/', function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(status));
});

app.post('/send', function (req, res) {
    let value = req.body.value;
    let send = new Uint8Array([value]);
    for(let i = 1; i < testSlaves.length; i++) {
        server.send(Buffer.from(send), 9050, testSlaves[i]);
    } 
    status.packets.send++;
    res.send('sended to artnet');
});
app.listen(9051);
Console.info('Service listening on 9051', 'rest')

server.bind(9050, "192.168.178.11");