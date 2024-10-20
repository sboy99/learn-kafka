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

export const KafkaConfigSchema = z.object({
	KAFKA_BROKER: _str,
	KAFKA_CLIENT_ID: _str,
	KAFKA_GROUP_ID: _str,
	KAFKA_TOPIC: _str,
});

export const ConfigSchema =
	AppConfigSchema.and(NodeConfigSchema).and(KafkaConfigSchema);

export type TConfig = z.infer<typeof ConfigSchema>;
