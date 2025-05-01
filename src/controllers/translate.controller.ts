import { Request, Response } from 'express';
import { translateText } from '../services/translation.service';
import { logger } from '../services/logger.service';
import { TranslationRequest, ApiError } from '../interfaces/translation.interface';

export async function handleTranslation(req: Request, res: Response) {
  const { text, targetLang = 'en', sourceLang }: TranslationRequest = req.body;

  if (!text) {
    const error: ApiError = {
      error: 'Missing required parameter',
      message: 'O parâmetro "text" é obrigatório',
      code: 'MISSING_TEXT_PARAMETER'
    };
    logger.warn('Validation failed', error);
    return res.status(400).json(error);
  }

  if (typeof text !== 'string') {
    const error: ApiError = {
      error: 'Invalid parameter type',
      message: 'O parâmetro "text" deve ser uma string',
      code: 'INVALID_TEXT_TYPE'
    };
    logger.warn('Validation failed', error);
    return res.status(400).json(error);
  }

  try {
    logger.info(`Starting translation for text: ${text.substring(0, 50)}...`, {
      targetLang,
      sourceLang,
      textLength: text.length
    });

    const response = await translateText({ text, targetLang, sourceLang });

    logger.info('Translation completed successfully', {
      responseTime: `${response.translationTime.toFixed(2)}ms`,
      detectedLanguage: response.detectedLanguage,
      targetLanguage: response.targetLanguage
    });

    res.status(200).json(response);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    const apiError: ApiError = {
      error: 'Translation failed',
      message: errorMessage,
      code: 'TRANSLATION_ERROR',
      details: process.env.NODE_ENV === 'development' ? errorStack : undefined
    };

    logger.error('Translation failed', { 
      error: apiError,
      stack: errorStack
    });
    
    res.status(500).json(apiError);
  }
}