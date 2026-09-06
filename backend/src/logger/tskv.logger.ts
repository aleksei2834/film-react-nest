import { Injectable } from "@nestjs/common";

import { BaseLogger } from "./base.logger";

@Injectable()
export class TskvLogger extends BaseLogger {
  private escape(value: unknown): string {
    return String(value).replace(/\t/g, ' ').replace(/\n/g, ' ');
  }

  protected format(level: string, message: unknown, context?: string): string {
    const fields: Record<string, unknown> = {
      tskv_format: 'nest-log',
      timestamp: new Date().toISOString(),
      level,
      message,
    };
    if (context) {
      fields.context = context;
    }

    return Object.entries(fields)
      .map(([key, value]) => `${key}=${this.escape(value)}`)
      .join('\t');
  }
}