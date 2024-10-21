import { Logger } from "@nestjs/common";

/**
 *  HandleException
 * @description Decorator to handle exceptions in methods
 * @param isThrow boolean
 * @returns MethodDecorator
 */
export function HandleException(isThrow = false): MethodDecorator {
	return (
		_target: any,
		propertyKey: string | symbol,
		descriptor: PropertyDescriptor,
	) => {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			try {
				return await originalMethod.apply(this, args);
			} catch (error) {
				Logger.error(
					`Error in ${String(propertyKey)}: ${error.message}`,
					error.stack,
				);
				if (isThrow) {
					throw error;
				}
			}
		};

		return descriptor;
	};
}
