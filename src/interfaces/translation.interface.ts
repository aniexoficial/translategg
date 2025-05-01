export interface TranslationRequest {
    text: string;
    targetLang?: string;
    sourceLang?: string;
  }
  
  export interface TranslationResponse {
    originalText: string;
    translatedText: string;
    detectedLanguage: string;
    targetLanguage: string;
    translationTime: number;
    timestamp: string;
  }
  
  export interface ApiError {
    error: string;
    message: string;
    code: string;
    details?: string;
  }