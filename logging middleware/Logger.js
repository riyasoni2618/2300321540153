import { Log } from './Log.js';

const LEVEL_PRIORITY = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const PACKAGE_NAMES = {
  Application: 'application',
  NotificationService: 'service',
  PriorityInbox: 'inbox',
  MinHeap: 'heap',
  PriorityCalculator: 'calculator',
  OutputFormatter: 'output',
};

const DEFAULT_STACK = process.env.LOG_STACK || 'backend';

class Logger {
  constructor(options = {}) {
    this.minLevel = LEVEL_PRIORITY[options.level?.toLowerCase()] ?? LEVEL_PRIORITY.info;
    this.context = options.context ?? 'App';
    this.stack = options.stack ?? DEFAULT_STACK;
    this.packageName = options.packageName ?? resolvePackageName(this.context);
  }

  child(context) {
    return new Logger({
      level: this.levelName(),
      context,
      stack: this.stack,
    });
  }

  levelName() {
    return Object.keys(LEVEL_PRIORITY).find(
      (key) => LEVEL_PRIORITY[key] === this.minLevel
    );
  }

  error(message, meta) {
    this._log('error', message, meta);
  }

  warn(message, meta) {
    this._log('warn', message, meta);
  }

  info(message, meta) {
    this._log('info', message, meta);
  }

  debug(message, meta) {
    this._log('debug', message, meta);
  }

  _log(level, message, meta) {
    if (LEVEL_PRIORITY[level] > this.minLevel) {
      return;
    }

    const text = meta ? `${message} | ${formatMeta(meta)}` : message;
    Log(this.stack, level, this.packageName, text);
  }
}

function resolvePackageName(context) {
  if (PACKAGE_NAMES[context]) {
    return PACKAGE_NAMES[context];
  }

  return context.toLowerCase();
}

function formatMeta(meta) {
  if (typeof meta === 'string') {
    return meta;
  }

  try {
    return JSON.stringify(meta);
  } catch {
    return String(meta);
  }
}

export default Logger;
