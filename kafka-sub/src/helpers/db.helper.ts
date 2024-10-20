import type { TConfig } from "@/app/modules/config";
import * as dbSchema from "@db/schema";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";

@Injectable()
export class DbHelper {
	private readonly _logger = new Logger(DbHelper.name);
	private readonly _pool: Pool;
	private readonly _db: NodePgDatabase<typeof dbSchema> & {
		$client: Pool;
	};

	constructor(
		@Inject(ConfigService)
		private readonly _configService: ConfigService<TConfig>,
	) {
		this._pool = new Pool(this._poolConfig);
		this._db = drizzle({ client: this._pool, schema: dbSchema });
	}

	// -------------------------------PUBLIC--------------------------------- //

	public get db(): NodePgDatabase<typeof dbSchema> & { $client: Pool } {
		return this._db;
	}

	public async query<T>(query: string, values?: unknown[]): Promise<T[]> {
		const client = await this._pool.connect();
		try {
			const { rows } = await client.query(query, values);
			return rows as T[];
		} catch (_error) {
			this._logger.error(_error);
		} finally {
			client.release();
		}
		return [];
	}

	// -------------------------------PRIVATE--------------------------------- //

	private get _poolConfig(): PoolConfig {
		const maxPoolConnections = 20;
		const host = this._configService.getOrThrow<string>("POSTGRES_HOST");
		const database = this._configService.getOrThrow<string>("POSTGRES_DB");
		const user = this._configService.getOrThrow<string>("POSTGRES_USER");
		const password =
			this._configService.getOrThrow<string>("POSTGRES_PASSWORD");

		return {
			host,
			user,
			password,
			database,
			max: maxPoolConnections,
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 2000,
		};
	}
}
