/**
 * 由于各大服务商的语言代码都不大一样，
 * 所以我定义了一份 Bob 专用的语言代码，以便 Bob 主程序和插件之间互传语种。
 * Bob 语言代码列表 https://ripperhe.gitee.io/bob/#/plugin/addtion/language
 *
 * 转换的代码建议以下面的方式实现，
 * `xxx` 代表服务商特有的语言代码，请替换为真实的，
 * 具体支持的语种数量请根据实际情况而定。
 *
 * Bob 语言代码转服务商语言代码(以为 'zh-Hans' 为例): var lang = langMap.get('zh-Hans');
 * 服务商语言代码转 Bob 语言代码: var standardLang = langMapReverse.get('xxx');
 */

import {
  PluginValidate,
  ServiceError,
  TextTranslate,
} from "@bob-translate/types";
import { supportLanguageList } from "./lang";
import { ServiceProvider } from "./types";
import { handleGeneralError, handleValidateError } from "./utils";
import { getServiceAdapter } from "./adapter";

const validatePluginConfig = (): ServiceError | null => {
  return null;
};

export const supportLanguages = () =>
  supportLanguageList.map(([standardLang]) => standardLang);

export const translate: TextTranslate = (query) => {
  const { serviceProvider } = $option;

  const serviceAdapter = getServiceAdapter(serviceProvider as ServiceProvider);

  const error = validatePluginConfig();
  if (error) {
    handleGeneralError(query, error);
    return;
  }

  serviceAdapter.translate(query).catch((error: unknown) => {
    handleGeneralError(query, error);
  });
};

export const pluginValidate: PluginValidate = (completion) => {
  const { serviceProvider } = $option;
  const pluginConfigError = validatePluginConfig();
  const serviceAdapter = getServiceAdapter(serviceProvider as ServiceProvider);

  if (pluginConfigError) {
    handleValidateError(completion, pluginConfigError);
    return;
  }

  serviceAdapter
    .testApiConnection("Hello, world!", completion)
    .catch((error: unknown) => {
      handleValidateError(completion, error);
    });
};

export const pluginTimeoutInterval = () => 60;
