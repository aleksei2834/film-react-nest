import { Injectable } from "@nestjs/common";

import { BaseLogger } from "./base.logger";

@Injectable()
export class JsonLogger extends BaseLogger {
  protected format(level: string, message: unknown, context?: string): string {
    return JSON.stringify({
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}