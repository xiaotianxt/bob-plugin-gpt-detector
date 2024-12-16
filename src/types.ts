// https://github.com/openai/openai-node/blob/master/src/resources/chat/completions.ts
// https://github.com/openai-translator/bob-plugin-openai-translator/blob/main/src/types.ts

import {
  HttpResponse,
  TextTranslateQuery,
  ValidationCompletion,
} from "@bob-translate/types";
import { RESPONSE_TEMPLATES } from "./constants";

type Expand<T> = { [K in keyof T]: T[K] };

export type TextOnlyQuery = Expand<
  Pick<TextTranslateQuery, "text" | "onCompletion"> &
    Partial<Omit<TextTranslateQuery, "text" | "onCompletion">>
>;

export interface ZeroGPTResponse {
  success: boolean;
  data: {
    is_gpt_generated: number; // GPT生成概率，百分比表示
    is_human_written: number; // 人类书写概率，百分比表示
    gpt_generated_sentences: string[]; // GPT生成的句子数组
    words_count: number; // 单词数量
    feedback_message: string; // 反馈消息，可为空
    predicted_class: string; // 预测类别（例如 "human"）
    confidence_category: string; // 置信度类别（例如 "low", "high"）
  };
  code: number;
  message: string;
}

export interface ServiceAdapter {
  getUrl: () => string;
  buildHeaders: () => Record<string, string>;
  buildRequestBody: (query: TextTranslateQuery) => Record<string, unknown>;
  parseResponse: (
    response: HttpResponse<ZeroGPTResponse>,
    query: TextTranslateQuery
  ) => string[];
  testApiConnection: (
    text: string,
    completion: ValidationCompletion
  ) => Promise<void>;
  makeRequest: (
    url: string,
    header: Record<string, string>,
    body: Record<string, unknown>,
    query: TextTranslateQuery
  ) => Promise<void>;
  translate: (query: TextTranslateQuery) => Promise<void>;
}

export type ServiceProvider = "ZeroGPT";

export interface TypeCheckConfig {
  [key: string]: {
    type: "string" | "object" | "null";
    optional?: boolean;
    nullable?: boolean;
  };
}

export type SupportedLanguage = keyof typeof RESPONSE_TEMPLATES;

export interface TemplateStrings {
  result: string;
  aiSentencesTitle: string;
  aiSentencesNone: string;
  class: {
    human: string;
    ai: string;
  };
  confidence: {
    high: string;
    low: string;
  };
}
