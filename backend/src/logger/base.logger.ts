import { LoggerService } from "@nestjs/common";

export abstract class BaseLogger implements LoggerService {
  protected abstract format(level: string, message: unknown, context?: string): string;

  log(message: unknown, context?: string): void {
    console.log(this.format('log', message, context));
  }

  error(message: unknown, trace?: string, context?: string): void {
    console.error(this.format('error', message, context));
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: unknown, context?: string): void {
    console.warn(this.format('warn', message, context));
  }

  debug(message: unknown, context?: string): void {
    console.debug(this.format('debug', message, context));
  }

  verbose(message: unknown, context?: string): void {
    console.log(this.format('verbose', message, context));
  }
}