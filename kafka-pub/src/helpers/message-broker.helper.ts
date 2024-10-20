import type { TConfig } from "@/app/modules/config";
import type { MessageBrokerTopicEnum } from "@/domain/enums";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
	Kafka,
	type KafkaConfig,
	type Message,
	type Producer,
	type ProducerConfig,
} from "kafkajs";

@Injectable()
export class MessageBrokerHelper {
	private readonly _broker: Kafka;
	private readonly _producer: Producer;

	constructor(
		@Inject(ConfigService)
		private readonly _configService: ConfigService<TConfig>,
	) {
		this._broker = new Kafka(this._brokerConfig);
		this._producer = this._broker.producer(this._producerConfig);
	}

	// -------------------------------PUBLIC--------------------------------- //

	public async send(
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
			idempotent: true,
		};
	}
}
