import type { ServiceAdapter, ServiceProvider } from "../types";
import { ZeroGPTAdapter } from "./ZeroGPT";

export const getServiceAdapter = (
  serviceProvider: ServiceProvider
): ServiceAdapter => {
  switch (serviceProvider) {
    case "ZeroGPT":
      return new ZeroGPTAdapter();
    default:
      return new ZeroGPTAdapter();
  }
};
