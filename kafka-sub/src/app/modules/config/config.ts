import { z } from "zod";

// -----------------------------CONSTANTS----------------------------------- //

const _str = z.string();
const _port = z.coerce.number();
const _num = z.coerce.number();

// -----------------------------SCHEMAS----------------------------------- //

export const NodeConfigSchema = z.object({
	NODE_ENV: z.enum(["production", "development"]),
});

export const AppConfigSchema = z.object({
	APP_HTTP_PORT: _port.default(3000),
});

export const PostgresConfigSchema = z.object({
	POSTGRES_HOST: _str,
	POSTGRES_USER: _str,
	POSTGRES_PASSWORD: _str,
	POSTGRES_DB: _str,
	POSTGRES_PORT: _port,
});

export const KafkaConfigSchema = z.object({
	KAFKA_CLIENT_ID: _str,
	KAFKA_BROKER: _str,
	KAFKA_GROUP_ID: _str,
});

export const ConfigSchema = AppConfigSchema.and(NodeConfigSchema)
	.and(PostgresConfigSchema)
	.and(KafkaConfigSchema);

export type TConfig = z.infer<typeof ConfigSchema>;
