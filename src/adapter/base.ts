import {
  HttpResponse,
  ServiceError,
  TextTranslateQuery,
  ValidationCompletion,
} from "@bob-translate/types";
import type { ServiceAdapter, ZeroGPTResponse } from "../types";
import { convertToServiceError, handleGeneralError } from "../utils";

export abstract class BaseAdapter implements ServiceAdapter {
  abstract getUrl(): string;

  abstract buildHeaders(): Record<string, string>;

  abstract buildRequestBody(query: TextTranslateQuery): Record<string, unknown>;

  abstract parseResponse(response: HttpResponse<ZeroGPTResponse>): string;

  abstract testApiConnection(
    test: string,
    completion: ValidationCompletion
  ): Promise<void>;

  protected abstract extractErrorFromResponse(
    response: HttpResponse<any>
  ): ServiceError;

  protected handleGeneralCompletion(query: TextTranslateQuery, text: string) {
    query.onCompletion({
      result: {
        from: query.detectFrom,
        to: query.detectTo,
        toParagraphs: text.split("\n"),
      },
    });
  }

  protected handleRequestError(query: TextTranslateQuery, error: unknown) {
    const serviceError = convertToServiceError(error);
    handleGeneralError(query, serviceError);
  }

  public async translate(query: TextTranslateQuery): Promise<void> {
    try {
      const url = this.getUrl();
      const header = this.buildHeaders();
      const body = this.buildRequestBody(query);

      await this.makeRequest(url, header, body, query);
    } catch (error) {
      this.handleRequestError(query, error);
    }
  }

  public async makeRequest(
    url: string,
    header: Record<string, string>,
    body: Record<string, unknown>,
    query: TextTranslateQuery
  ): Promise<void> {
    try {
      const result = await $http.request({
        method: "POST",
        url,
        header,
        body,
      });

      $log.info(JSON.stringify(result, null, 2));
      $log.info(result.response.statusCode);

      if (result.error || result.response.statusCode >= 400) {
        handleGeneralError(query, this.extractErrorFromResponse(result));
      } else {
        const text = this.parseResponse(result);
        this.handleGeneralCompletion(query, text);
      }
    } catch (error) {
      this.handleRequestError(query, error);
    }
  }
}
