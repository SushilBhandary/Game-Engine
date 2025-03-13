export class Logger {
    static LogLevel = {
        DEBUG: 0,
        INFO: 1,
        WARNING: 2,
        ERROR: 3
    };

    constructor() {
        this.logLevel = Logger.LogLevel.INFO;
        this.logs = [];
        this.maxLogs = 1000;
    }

    log(message, level = Logger.LogLevel.INFO, context = '') {
        if (level < this.logLevel) return;

        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            context
        };

        this.logs.push(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        const levelString = Object.keys(Logger.LogLevel)[level];
        const contextString = context ? `[${context}] ` : '';
        
        switch (level) {
            case Logger.LogLevel.DEBUG:
                console.debug(`${timestamp} ${contextString}${message}`);
                break;
            case Logger.LogLevel.INFO:
                console.info(`${timestamp} ${contextString}${message}`);
                break;
            case Logger.LogLevel.WARNING:
                console.warn(`${timestamp} ${contextString}${message}`);
                break;
            case Logger.LogLevel.ERROR:
                console.error(`${timestamp} ${contextString}${message}`);
                break;
        }
    }

    debug(message, context = '') {
        this.log(message, Logger.LogLevel.DEBUG, context);
    }

    info(message, context = '') {
        this.log(message, Logger.LogLevel.INFO, context);
    }

    warn(message, context = '') {
        this.log(message, Logger.LogLevel.WARNING, context);
    }

    error(message, context = '') {
        this.log(message, Logger.LogLevel.ERROR, context);
    }

    getLogs(level = null) {
        if (level === null) {
            return [...this.logs];
        }
        return this.logs.filter(log => log.level === level);
    }

    clearLogs() {
        this.logs = [];
    }
}