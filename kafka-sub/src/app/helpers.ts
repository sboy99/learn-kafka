import { DbHelper } from "@/helpers";
import type { Provider } from "@nestjs/common";

export const Helpers: Provider[] = [DbHelper];
