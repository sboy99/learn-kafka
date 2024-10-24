import { HandleException } from "@/app/decorators";
import type { TConfig } from "@/app/modules/config";
import { EventEnum } from "@/domain/enums";
import {
	Inject,
	Injectable,
	Logger,
	type OnApplicationShutdown,
	type OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
	type Admin,
	type AdminConfig,
	Kafka,
	type KafkaConfig,
	Partitioners,
	type Producer,
	type ProducerConfig,
} from "kafkajs";
import { z } from "zod";
import type { EventPort } from "./ports";

@Injectable()
export class KafkaAdapter<T = unknown>
	implements EventPort<T>, OnModuleInit, OnApplicationShutdown
{
	private readonly _logger: Logger;
	private readonly _broker: Kafka;
	private readonly _producer: Producer;
	private readonly _admin: Admin;

	constructor(
		@Inject(ConfigService)
		private readonly _configService: ConfigService<TConfig>,
	) {
		this._logger = new Logger(KafkaAdapter.name);
		this._broker = new Kafka(this._brokerConfig);
		this._producer = this._broker.producer(this._producerConfig);
		this._admin = this._broker.admin(this._adminConfig);
	}

	async onModuleInit(): Promise<void> {
		await this._connect();
	}

	async onApplicationShutdown(): Promise<void> {
		await this._disconnect();
	}

	// -------------------------------PUBLIC--------------------------------- //

	public async onCreate(...args: unknown[]): Promise<void> {
		const topics = args?.[0];
		this.assetTopics(topics);
		await this.createTopics(topics);
	}

	public async publish(topic: EventEnum, message: T): Promise<void> {
		const serializedMessage = this.serializeMessage(message);
		// TODO: Do partioning here if needed
		await this._producer.send({
			topic,
			messages: [
				{
					value: serializedMessage,
				},
			],
		});
	}

	// -------------------------------PRIVATE--------------------------------- //

	private get _brokerConfig(): KafkaConfig {
		const kafkaClientId =
			this._configService.getOrThrow<string>("KAFKA_CLIENT_ID");
		const kafkaHost = this._configService.getOrThrow<string>("KAFKA_BROKER");
		return {
			clientId: kafkaClientId,
			brokers: [kafkaHost],
		};
	}

	private get _producerConfig(): ProducerConfig {
		return {
			createPartitioner: Partitioners.LegacyPartitioner,
		};
	}

	private get _adminConfig(): AdminConfig {
		return {
			retry: {
				initialRetryTime: 100,
				maxRetryTime: 1000,
				retries: 5,
			},
		};
	}

	@HandleException(true)
	private async _connect(): Promise<void> {
		await this._producer.connect();
		await this._admin.connect();
		this._logger.log("Connected to Kafka");
	}

	@HandleException()
	private async _disconnect(): Promise<void> {
		await this._producer.disconnect();
		await this._admin.disconnect();
		this._logger.log("Disconnected from Kafka");
	}

	private async listTopics(): Promise<EventEnum[]> {
		const topics = await this._admin.listTopics();
		return topics as EventEnum[];
	}

	private async createTopics(topics: EventEnum[]): Promise<void> {
		const existingTopics = await this.listTopics();
		const newTopics = topics.filter((topic) => !existingTopics.includes(topic));
		if (newTopics.length === 0) return;
		await this._admin.createTopics({
			topics: newTopics.map((topic) => ({
				topic,
			})),
		});
	}

	private assetTopics(topics: unknown): asserts topics is EventEnum[] {
		const validationSchema = z.nativeEnum(EventEnum).array();
		if (validationSchema.safeParse(topics).success) return;
		this._logger.error("Invalid topics", topics);
		throw new Error("Invalid topics");
	}

	private serializeMessage<T = unknown>(message: T): string {
		return JSON.stringify(message);
	}

	private deserializeMessage<T = unknown>(message: string): T {
		return JSON.parse(message);
	}
}
