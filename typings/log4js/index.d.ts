import { Logger, LoggingEvent } from 'log4js';

declare module "log4js" {
  interface Logger {
    info(...args: any[]): void;
  }

  function addLayout(name: string, config: (a: any) => (logEvent: LoggingEvent) => any): void;
}