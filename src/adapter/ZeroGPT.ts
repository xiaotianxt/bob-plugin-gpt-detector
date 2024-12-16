import {
  HttpResponse,
  ServiceError,
  TextTranslateQuery,
  ValidationCompletion,
} from "@bob-translate/types";
import type { ZeroGPTResponse } from "../types";
import { handleValidateError } from "../utils";
import { BaseAdapter } from "./base";

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

  public parseResponse(response: HttpResponse<ZeroGPTResponse>): string {
    const { data } = response;
    if (typeof data === "object" && "success" in data) {
      $log.info(JSON.stringify(data, null, 2));
      const aiPercentage = data.data.is_gpt_generated;
      return `${aiPercentage}%`;
    }
    throw new Error("Invalid response data");
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
