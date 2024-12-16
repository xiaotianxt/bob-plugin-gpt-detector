export const RESPONSE_TEMPLATES = {
  "zh-Hans": {
    result: `• 文本类型：{class}
• 可信度：{confidence}
• AI 生成比例：{ratio}%`,
    aiSentencesTitle: "AI 生成的句子:",
    aiSentencesNone: "AI 生成的句子: 未检测到",
    class: {
      human: "人类撰写",
      ai: " AI 生成",
    },
    confidence: {
      high: "较高",
      low: "较低",
    },
  },
  en: {
    result: `• Text Type: {class}
• Confidence: {confidence}
• AI Content Ratio: {ratio}%`,
    aiSentencesTitle: "AI Generated Sentences:",
    aiSentencesNone: "AI Generated Sentences: None detected",
    class: {
      human: "Human Written",
      ai: "AI Generated",
    },
    confidence: {
      high: "High",
      low: "Low",
    },
  },
};
