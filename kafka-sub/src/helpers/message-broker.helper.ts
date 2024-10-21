import { HandleException } from "@/app/decorators";
import type { TConfig } from "@/app/modules/config";
import type { MessageBrokerTopicEnum } from "@/domain/enums";
import {
	Inject,
	Injectable,
	Logger,
	type OnApplicationShutdown,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
	type Consumer,
	type ConsumerConfig,
	type ConsumerRunConfig,
	Kafka,
	type KafkaConfig,
} from "kafkajs";

@Injectable()
export class MessageBrokerHelper implements OnApplicationShutdown {
	private readonly _logger: Logger;
	private readonly _broker: Kafka;
	private readonly _consumers: Consumer[];

	constructor(
		@Inject(ConfigService)
		private readonly _configService: ConfigService<TConfig>,
	) {
		this._logger = new Logger(MessageBrokerHelper.name);
		this._broker = new Kafka(this._brokerConfig);
		this._consumers = [];
	}

	async onApplicationShutdown(): Promise<void> {
		await this._disconnectAllConsumers();
	}

	// -------------------------------PUBLIC--------------------------------- //

	public async consume(
		topic: MessageBrokerTopicEnum,
		runConfig: ConsumerRunConfig,
	): Promise<void> {
		const consumer = this._broker.consumer(this._consumerConfig);
		await consumer.connect();
		await consumer.subscribe({ topic: topic });
		await consumer.run(runConfig);
		this._consumers.push(consumer);
		this._logger.log(`Subscribed to topic: ${topic}`);
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

	private get _consumerConfig(): ConsumerConfig {
		const groupId = this._configService.getOrThrow<string>("KAFKA_GROUP_ID");
		return {
			groupId,
		};
	}

	@HandleException()
	private async _disconnectAllConsumers(): Promise<void> {
		await Promise.all(this._consumers.map((consumer) => consumer.disconnect()));
		this._logger.log("All consumers disconnected");
	}
}
