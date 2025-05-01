import type { TranslationRequest, TranslationResponse } from "../interfaces/translation.interface"

export async function translateText(request: TranslationRequest): Promise<TranslationResponse> {
  const startTime = process.hrtime()
  const { text, targetLang = "en", sourceLang } = request

  // Importação correta do módulo de tradução
  const { translate } = await import("@vitalets/google-translate-api")
  const result = await translate(text, {
    to: targetLang,
    from: sourceLang,
  })

  const [seconds, nanoseconds] = process.hrtime(startTime)
  const responseTime = seconds * 1000 + nanoseconds / 1e6

  // Usar uma abordagem mais segura para obter o idioma detectado
  let detectedLanguage = "unknown";
  if (result.raw) {
    // Usar type assertion para evitar erros de TypeScript
    const rawResponse = result.raw as any;
    if (rawResponse.src) {
      detectedLanguage = rawResponse.src;
    } else if (rawResponse.detectedLanguage) {
      detectedLanguage = rawResponse.detectedLanguage;
    }
  }

  return {
    originalText: text,
    translatedText: result.text,
    detectedLanguage: detectedLanguage,
    targetLanguage: targetLang,
    translationTime: responseTime,
    timestamp: new Date().toISOString(),
  }
}