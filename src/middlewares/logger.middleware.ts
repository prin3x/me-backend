import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    );

    // Listen for the response to finish
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${
          res.statusCode
        } (${duration}ms)`,
      );
    });

    // Listen for errors
    res.on('error', (err: Error) => {
      console.error(
        `[${new Date().toISOString()}] ERROR on ${req.method} ${
          req.originalUrl
        }:`,
        err,
      );
    });

    next();
  }
}
