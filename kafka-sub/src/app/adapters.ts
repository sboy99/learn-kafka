import { DbAdapter } from "@/adapters";
import { DB_ADAPTER } from "@/app/constants/tokens";
import type { Provider } from "@nestjs/common";

export const Adapters: Provider[] = [
	{
		provide: DB_ADAPTER,
		useClass: DbAdapter,
	},
];
