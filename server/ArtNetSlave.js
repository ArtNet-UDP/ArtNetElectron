'use strict';
class ArtNetSlave {
    constructor(ipAdress, type) {
        this.ipAdress = ipAdress;
        this.type = type;
    }

    get ipAdress() { return this._ipAdress }
    set ipAdress(address) { this._ipAdress = address }

    get type() { return this._type }
    set type(type) { this._type = type }
}

module.exports = ArtNetSlave