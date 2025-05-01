import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/logger.service';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  logger.info(`Request: ${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body
  });
  next();
}