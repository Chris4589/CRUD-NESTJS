import Logger, { createLogger, stdSerializers, LoggerOptions } from 'bunyan';
import * as apiInfo from '../../package.json';
import * as os from 'os';
import * as ip from 'ip';
import * as path from 'path';
import { Injectable, Logger as Log4 } from '@nestjs/common';
import { Log } from '../interfaces/log.interface';

@Injectable()
export class BunyanLogger {
  write(): Logger {
    const options: LoggerOptions = {
      // this funcion needs "resolveJsonModule": true in tsconfig.json
      name: apiInfo.name,
      hostname: `${os.hostname()}:${ip.address()}`,
      streams: [{
        level: 'debug',
        name: 'debug',
        path: process.env.SERVER_LOG_DEBUG,
      }, {
        level: 'error',
        name: 'error',
        path: process.env.SERVER_LOG_ERROR,
      }],
      responseCode: '',
    };
    return createLogger(options);
  }

  logError(data: Log, className: string, message: string): void {
    const printer: Log4 = new Log4(className);
    printer.error(message);
    const logger = this.write();
    logger.error(data, message);
  }

  logInfo(data: Log, className: string, message: string): void {
    const printer: Log4 = new Log4(className);
    printer.log(message);
    const logger = this.write();
    logger.info(data, message);
  }
}
