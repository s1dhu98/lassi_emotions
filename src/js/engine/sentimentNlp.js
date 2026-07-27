/* Lassi Emotions - Advanced NLP Sentiment Engine */

export class SentimentNlpEngine {
  constructor(dataset) {
    this.dataset = dataset;
  }

  analyze(text) {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return {
        emotionId: 'happy',
        confidence: 0,
        category: 'joy',
        explanation: 'Empty text input provided.'
      };
    }

    const cleanText = text.toLowerCase().trim();
    const scores = {};

    // Initialize scores for all emotions
    this.dataset.emotions.forEach(emo => {
      scores[emo.id] = 0;
    });

    // 1. Emoji Direct Matching (High Precision)
    const emojiMap = {
      '🙂': 'happy', '😊': 'happy', '😀': 'happy',
      '😂': 'ecstatic', '🥳': 'ecstatic', '😁': 'ecstatic',
      '😭': 'heartbroken', '💔': 'heartbroken', '😢': 'sad', '🙁': 'sad', '☹️': 'sad',
      '😡': 'angry', '😠': 'angry', '🤬': 'furious', '😈': 'mischievous',
      '😱': 'scared', '😨': 'scared', '😰': 'anxious', '😥': 'anxious',
      '❤️': 'love', '💖': 'love', '😍': 'love', '🥰': 'love', '🌹': 'romantic', '🤗': 'affectionate',
      '😲': 'surprised', '😯': 'surprised', '🤯': 'shocked',
      '⚡': 'energetic', '🧘': 'calm', '🕊️': 'calm',
      '😜': 'playful', '🤪': 'silly', '💅': 'sassy',
      '😎': 'cool', '🔥': 'cool', '🏆': 'triumphant'
    };

    for (const [emoji, targetEmotion] of Object.entries(emojiMap)) {
      if (cleanText.includes(emoji)) {
        scores[targetEmotion] += 15;
      }
    }

    // 2. Keyword & Phrase Scoring
    this.dataset.emotions.forEach(emo => {
      if (emo.keywords) {
        emo.keywords.forEach(kw => {
          const kwClean = kw.toLowerCase();
          if (cleanText === kwClean) {
            scores[emo.id] += 10;
          } else if (cleanText.includes(kwClean)) {
            // Phrase or word match
            const bonus = kwClean.length > 5 ? 5 : 3;
            scores[emo.id] += bonus;
          }
        });
      }
    });

    // 3. Find Top Scoring Emotion
    let topEmotionId = 'happy';
    let maxScore = -1;

    for (const [emoId, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        topEmotionId = emoId;
      }
    }

    // Fallback if score is 0
    if (maxScore <= 0) {
      if (cleanText.includes('not') || cleanText.includes('bad') || cleanText.includes('no') || cleanText.includes('hate')) {
        topEmotionId = 'sad';
        maxScore = 2;
      } else if (cleanText.includes('good') || cleanText.includes('nice') || cleanText.includes('love') || cleanText.includes('awesome')) {
        topEmotionId = 'happy';
        maxScore = 3;
      } else {
        // Random pick from dataset
        topEmotionId = this.dataset.emotions[Math.floor(Math.random() * this.dataset.emotions.length)].id;
        maxScore = 1;
      }
    }

    const matchedEmotion = this.dataset.emotions.find(e => e.id === topEmotionId);
    const confidencePct = Math.min(98, Math.max(65, Math.floor(maxScore * 14 + 50)));

    return {
      emotionId: topEmotionId,
      confidence: confidencePct,
      category: matchedEmotion ? matchedEmotion.category : 'joy',
      nameEn: matchedEmotion ? matchedEmotion.nameEn : 'Happy',
      nameHi: matchedEmotion ? matchedEmotion.nameHi : 'प्रसन्न',
      explanation: `Detected: ${matchedEmotion.nameEn} (${confidencePct}% match)`
    };
  }
}
