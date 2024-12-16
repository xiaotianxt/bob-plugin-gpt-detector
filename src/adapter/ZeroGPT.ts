import {
  HttpResponse,
  ServiceError,
  TextTranslateQuery,
  ValidationCompletion,
} from "@bob-translate/types";
import type { ZeroGPTResponse } from "../types";
import { BaseAdapter } from "./base";
import { mapToSupportedLanguage } from "../utils";
import { RESPONSE_TEMPLATES } from "../constants";

export class ZeroGPTAdapter extends BaseAdapter {
  protected extractErrorFromResponse(
    errorResponse: HttpResponse<unknown>
  ): ServiceError {
    return {
      type: "api",
      message:
        errorResponse.response.statusCode === 401
          ? "Invalid API key"
          : "API error",
      addition: JSON.stringify(errorResponse.data),
    };
  }

  public buildHeaders(): Record<string, string> {
    const header = {
      "Content-Type": "application/json",
      "x-rapidapi-host": "zerogpt.p.rapidapi.com",
      "x-rapidapi-key": $option.apiKey,
    };
    return header;
  }

  public buildRequestBody(query: TextTranslateQuery): Record<string, unknown> {
    return {
      input_text: query.text,
    };
  }

  public parseResponse(
    response: HttpResponse<ZeroGPTResponse>,
    query: TextTranslateQuery
  ): string[] {
    const { data: respData } = response;
    if (
      typeof respData === "object" &&
      "success" in respData &&
      "data" in respData
    ) {
      const data = respData.data;
      $log.info(JSON.stringify(data, null, 2));

      const supportedLang = mapToSupportedLanguage(query.detectFrom);
      const template = RESPONSE_TEMPLATES[supportedLang];

      const result: string[] = [];

      if (data.confidence_category === "high") {
      }
      result.push(
        template.result
          .replace("{ratio}", data.is_gpt_generated + "")
          .replace(
            "{confidence}",
            template.confidence[
              data.confidence_category === "high" ? "high" : "low"
            ]
          )
          .replace(
            "{class}",
            template.class[data.predicted_class == "human" ? "human" : "ai"]
          )
      );

      if (data.gpt_generated_sentences.length > 0) {
        result.push(
          `${template.aiSentencesTitle}\n` +
            data.gpt_generated_sentences
              .map((sentence, index) => {
                return `   ${index + 1}. ${sentence}`;
              })
              .join("\n")
        );
      } else {
        result.push(`\n${template.aiSentencesNone}`);
      }

      return result;
    }
    throw new Error("Invalid response format");
  }

  public getUrl(): string {
    return "https://zerogpt.p.rapidapi.com/api/v1/detectText";
  }

  public async testApiConnection(
    text: string,
    completion: ValidationCompletion
  ): Promise<void> {
    this.translate({
      text,
      from: "auto",
      to: "zh-Hans",
    } as TextTranslateQuery);
  }
}
