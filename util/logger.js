module.exports = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    FgGray: "\x1b[90m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
    BgGray: "\x1b[100m",

    getTimestamp() {
        const now = new Date();
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        return now.toLocaleString('en-GB', options).replace(',', ' -');
    },

    log(message) {
        console.log(`${this.FgMagenta}${this.getTimestamp()} ${this.FgCyan}[RANKUP] ${this.FgGreen}${message}${this.Reset}`);
    },

    warn(message) {
        console.log(`${this.FgMagenta}${this.getTimestamp()} ${this.FgCyan}[RANKUP] ${this.FgYellow}${message}${this.Reset}`);
    },

    error(message, code = undefined) {
        if (code) {
            console.log(`${this.FgMagenta}${this.getTimestamp()} ${this.FgCyan}[RANKUP](${code}) ${this.FgRed}${message}${this.Reset}`);
        } else {
            console.log(`${this.FgMagenta}${this.getTimestamp()} ${this.FgCyan}[RANKUP] ${this.FgRed}${message}${this.Reset}`);
        }
    },
};