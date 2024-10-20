import { HandleException } from "@/app/decorators";
import type { TConfig } from "@/app/modules/config";
import type { MessageBrokerTopicEnum } from "@/domain/enums";
import {
	Inject,
	Injectable,
	Logger,
	type OnModuleDestroy,
	type OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
	type Admin,
	type AdminConfig,
	Kafka,
	type KafkaConfig,
	type Message,
	Partitioners,
	type Producer,
	type ProducerConfig,
} from "kafkajs";

@Injectable()
export class MessageBrokerHelper implements OnModuleInit, OnModuleDestroy {
	private readonly _logger: Logger;
	private readonly _broker: Kafka;
	private readonly _producer: Producer;
	private readonly _admin: Admin;

	constructor(
		@Inject(ConfigService)
		private readonly _configService: ConfigService<TConfig>,
	) {
		this._logger = new Logger(MessageBrokerHelper.name);
		this._broker = new Kafka(this._brokerConfig);
		this._producer = this._broker.producer(this._producerConfig);
		this._admin = this._broker.admin(this._adminConfig);
	}

	async onModuleInit(): Promise<void> {
		await this._connect();
	}

	async onModuleDestroy(): Promise<void> {
		await this._disconnect();
	}

	// -------------------------------PUBLIC--------------------------------- //

	public async createTopics(topics: MessageBrokerTopicEnum[]): Promise<void> {
		const existingTopics = await this.listTopics();
		const newTopics = topics.filter((topic) => !existingTopics.includes(topic));
		if (newTopics.length === 0) return;
		await this._admin.createTopics({
			topics: newTopics.map((topic) => ({
				topic,
			})),
		});
	}

	public async listTopics(): Promise<MessageBrokerTopicEnum[]> {
		const topics = await this._admin.listTopics();
		return topics as MessageBrokerTopicEnum[];
	}

	public async publishMessage(
		topic: MessageBrokerTopicEnum,
		message: Message,
	): Promise<void> {
		await this._producer.send({
			topic,
			messages: [message],
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
}
