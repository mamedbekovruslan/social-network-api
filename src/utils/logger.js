const LEVELS = ['debug', 'info', 'warn', 'error'];

const createConsoleMethod = (level) => {
  if (level === 'error') return console.error.bind(console);
  if (level === 'warn') return console.warn.bind(console);
  if (level === 'info') return console.info.bind(console);
  return console.log.bind(console);
};

export class Logger {
  constructor(context = 'app') {
    this.context = context;
  }

  log(level, message, meta) {
    if (!LEVELS.includes(level)) level = 'info';
    const method = createConsoleMethod(level);
    const timestamp = new Date().toISOString();
    if (meta) {
      method(`[${timestamp}] [${this.context}] [${level.toUpperCase()}] ${message}`, meta);
    } else {
      method(`[${timestamp}] [${this.context}] [${level.toUpperCase()}] ${message}`);
    }
  }

  debug(message, meta) {
    this.log('debug', message, meta);
  }

  info(message, meta) {
    this.log('info', message, meta);
  }

  warn(message, meta) {
    this.log('warn', message, meta);
  }

  error(message, meta) {
    this.log('error', message, meta);
  }
}

export const logger = new Logger('api');
