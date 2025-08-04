// sdk/src/utils/logger.ts

import type { Logger } from '../types';

export class ConsoleLogger implements Logger {
  constructor(private enabled: boolean = false, private prefix: string = '[Identro]') {}

  debug(message: string, data?: any): void {
    if (!this.enabled) return;
    console.debug(`${this.prefix} ${message}`, data || '');
  }

  info(message: string, data?: any): void {
    if (!this.enabled) return;
    console.info(`${this.prefix} ${message}`, data || '');
  }

  warn(message: string, data?: any): void {
    console.warn(`${this.prefix} ${message}`, data || '');
  }

  error(message: string, error?: any): void {
    console.error(`${this.prefix} ${message}`, error || '');
  }
}

// No-op logger for production
export class NoOpLogger implements Logger {
  debug(_message: string, _data?: any): void {}
  info(_message: string, _data?: any): void {}
  warn(_message: string, _data?: any): void {}
  error(_message: string, _error?: any): void {}
}