import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
   private readonly logger = new Logger();

   private log(statusCode, message) {
      if (statusCode >= 100 && statusCode <= 299) {
         this.logger.log(message);
      } else if (statusCode >= 300 && statusCode <= 499) {
         this.logger.warn(message);
      } else if (statusCode > 499) {
         this.logger.error(message);
      }
   }

   use(req: Request, res: Response, next: NextFunction) {
      res.on('finish', () => {
         this.log(res.statusCode, `[${req.method}] ${req.url} - ${res.statusCode}`);
      });

      next();
   }
}