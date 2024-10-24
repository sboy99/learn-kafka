import type { TConfig } from "@/app/modules/config";
import * as dbSchema from "@db/schema";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import type { PgTable } from "drizzle-orm/pg-core";
import { Pool, type PoolConfig } from "pg";
import type { DbPort, TDBSchemaMap, TRecords } from "./ports";

@Injectable()
export class DbAdapter<T extends TRecords, TEntity = TDBSchemaMap<T>>
	implements DbPort<T, TEntity>
{
	private readonly _logger = new Logger(DbAdapter.name);
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

	public async insert(table: T, entity: TEntity): Promise<void> {
		await this._insert(table, [entity]);
	}

	public async insertMany(table: T, entities: TEntity[]): Promise<void> {
		await this._insert(table, entities);
	}

	public async upsert(table: T, entity: TEntity): Promise<void> {
		throw new Error("Method not implemented.");
	}

	public async update(table: T, id: string, entity: TEntity): Promise<void> {
		throw new Error("Method not implemented.");
	}

	public async delete(table: T, id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}

	public async findOne(table: T, id: string): Promise<TEntity | null> {
		throw new Error("Method not implemented.");
	}

	public async list(table: T): Promise<TEntity[]> {
		throw new Error("Method not implemented.");
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

	private async _insert(table: T, entities: TEntity[]): Promise<void> {
		const pgTable = this._resolveTable(table);
		await this._db.insert(pgTable).values(entities);
	}

	private _resolveTable(table: T): PgTable {
		if (table === "TASKS") {
			return dbSchema.tasks;
		}

		if (table === "USERS") {
			return dbSchema.users;
		}

		throw new Error(`Table "${table}" not found.`);
	}
}
