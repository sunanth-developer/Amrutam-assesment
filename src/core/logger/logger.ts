type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function log(level: LogLevel, message: string, meta?: unknown) {
  if (!__DEV__ && level === 'debug') return;
  const prefix = `[${level}]`;
  if (meta !== undefined) {
    console[level === 'debug' ? 'log' : level](prefix, message, meta);
  } else {
    console[level === 'debug' ? 'log' : level](prefix, message);
  }
}

export const logger = {
  debug: (msg: string, meta?: unknown) => log('debug', msg, meta),
  info: (msg: string, meta?: unknown) => log('info', msg, meta),
  warn: (msg: string, meta?: unknown) => log('warn', msg, meta),
  error: (msg: string, meta?: unknown) => log('error', msg, meta),
};
