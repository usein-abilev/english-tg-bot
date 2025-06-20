import { createChildLogger } from "../../utils/logger.util";

const logger = createChildLogger("DebugDecorator");

interface DebugOptions {
    name?: string;
}

/**
 * Debug decorator used to measure the time it takes to execute a function.
 * It's useful for debugging and performance optimization.
 */
export default function Debug(options?: DebugOptions) {
    return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const name = options?.name || propertyKey;

        if (originalMethod.constructor.name === "AsyncFunction") {
            descriptor.value = async function (...args: unknown[]) {
                const start = Date.now();
                const result = await originalMethod.apply(this, args);
                const end = Date.now();
                logger.debug(`Method '${name}' took ${end - start} ms to execute.`);
                return result;
            };
        } else if (originalMethod.constructor.name === "Function") {
            descriptor.value = function (...args: unknown[]) {
                const start = Date.now();
                const result = originalMethod.apply(this, args);
                const end = Date.now();
                logger.debug(`Method '${name}' took ${end - start} ms to execute.`);
                return result;
            };
        } else {
            throw new Error("Debug decorator can only be applied to functions.");
        }
    };
}
