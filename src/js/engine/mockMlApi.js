/* Lassi Emotions - Mock ML Model Service */

export class MockMlApiService {
  constructor(nlpEngine) {
    this.nlpEngine = nlpEngine;
  }

  async predictEmotionAsync(text) {
    // Simulate API network latency (250ms - 500ms)
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 250) + 250));

    const result = this.nlpEngine.analyze(text);
    
    return {
      status: 'success',
      model: 'Lassi-EmotionBERT-v2',
      primaryEmotion: result.emotionId,
      confidence: result.confidence,
      intensity: result.intensity,
      timestamp: new Date().toISOString()
    };
  }
}
