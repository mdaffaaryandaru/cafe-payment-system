import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  constructor() {
    this.use = this.use.bind(this);
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const body = JSON.stringify(req.body);
    const headers = JSON.stringify(req.headers);

    this.logger.log(
      `Request: ${method} ${originalUrl} - Body: ${body} - Headers: ${headers}`,
    );
    next();
  }
}
