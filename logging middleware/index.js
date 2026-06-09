import Logger from './Logger.js';
import { Log, setAuthToken, getAuthToken } from './Log.js';

const logger = new Logger({
  level: process.env.LOG_LEVEL || 'info',
});

export default logger;
export { Logger, Log, setAuthToken, getAuthToken };
