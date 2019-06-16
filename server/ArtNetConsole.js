'use strict';
const colors = require('colors');

class ArtNetConsole {

    static error(message, context) {
        message = this.getPrefix() + this.getContextPrefix(context) + colors.red('🛑[ERR] ') + message;
    }

    static warn(message, context) {
        message = this.getPrefix() + this.getContextPrefix(context) + colors.yellow('⚠️[WARN] ') + message;
        console.warn(message);
    }

    static info(message, context) {
        message = this.getPrefix() + this.getContextPrefix(context) + colors.blue('ℹ️[INFO] ') + message;
        console.log(message);
    }

    static poll(message, context) {
        message = this.getPrefix() + this.getContextPrefix(context) + colors.blue('ℹ️[INFO] ') + message;
        process.stdout.write(message);
    }

    static pollComplete(message) {
        message = colors.green('completed ') + message;
        process.stdout.write(message);
    }

    static getPrefix() {
        return colors.gray(" [ArtNet] ");
    }

    static getContextPrefix(type) {
        if(type === "udp4") {
            return colors.cyan("[UDP4] ");
        } else if(type === "rest") {
            return colors.green("[REST] ");
        }
    }

}

module.exports = ArtNetConsole