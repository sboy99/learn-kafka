import type { MessageBrokerTopicEnum } from "@/domain/enums";
import type { MessageBrokerHelper } from "@/helpers";

export function KafkaConsumer(topic: MessageBrokerTopicEnum): MethodDecorator {
	return (
		_target: any,
		_propertyKey: string | symbol,
		descriptor: PropertyDescriptor,
	) => {
		const originalMethod = descriptor.value;

		descriptor.value = async function (..._args: any[]) {
			const messageBrokerHelper: MessageBrokerHelper =
				this._messageBrokerHelper;

			await messageBrokerHelper.consume(topic, {
				eachMessage: async ({ message }) => {
					if (!message.value) {
						return;
					}

					// Extract payload and context
					const payload = JSON.parse(message.value.toString());

					// Call the original method with the extracted payload and context
					await originalMethod.call(this, payload);
				},
			});
		};

		return descriptor;
	};
}
