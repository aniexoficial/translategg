import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/logger.service';
import { ApiError } from '../interfaces/translation.interface';

export function notFoundHandler(req: Request, res: Response) {
  const error: ApiError = {
    error: 'Endpoint not found',
    message: `O caminho ${req.path} não existe`,
    code: 'ENDPOINT_NOT_FOUND'
  };
  
  logger.warn(`Route not found: ${req.method} ${req.path}`, error);
  res.status(404).json(error);
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error';
  const errorStack = err instanceof Error ? err.stack : undefined;
  
  const error: ApiError = {
    error: 'Internal server error',
    message: errorMessage,
    code: 'INTERNAL_SERVER_ERROR',
    details: process.env.NODE_ENV === 'development' ? errorStack : undefined
  };

  logger.error('Internal server error occurred', {
    error,
    path: req.path,
    method: req.method,
    stack: errorStack
  });
  
  res.status(500).json(error);
}