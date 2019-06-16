'use strict';

const Console = require('./ArtNetConsole');

class ArtNet {
    
    constructor(_server, testSlaves) {
        this.server = _server;

        this.poll(testSlaves);

        this.polledSlaves = 0;
    }

    handleMessage(msg, info) {
        if (this.checkMessage(msg, 'artnet_broadcast')) {
            server.send(Buffer.from('{ "added": true, "message": "Added to Artnet!" }'), info.port, info.address);
            //slaves.push(new ArtNetSlave(info.address));
        } else if (this.checkMessage(msg, 'poll')) {
            this.polledSlaves++;
        }
    }

    completePoll(polledSlaves) {
        if (polledSlaves === 0) {
            Console.pollComplete('without any slaves.\n');
        } else if (polledSlaves === 1){
            Console.pollComplete(`with ${polledSlaves} slave.\n`);
        } else {
            Console.pollComplete(`with ${polledSlaves} slaves.\n`);
        }
        polledSlaves = 0;
    }

    checkMessage(message, check) {
        if(message.equals(Buffer.from(check)))
            return true;
        else
            return false;
    }

    poll(slaves) { 
        Console.poll('Poll Devices... ', 'udp4')
        this.polledSlaves = 0;
        for(let i = 0; i < slaves.length; i++) {
            this.server.send(Buffer.from('poll'), this.server.address().port, slaves[i]);
        }
        setTimeout(() => { this.poll(slaves) }, 50000);
        setTimeout(() => { this.completePoll(this.polledSlaves) }, 2000);
    }
}

module.exports = ArtNet