import { MessageBrokerHelper } from "@/helpers";
import type { Provider } from "@nestjs/common";

export const Helpers: Provider[] = [MessageBrokerHelper];
