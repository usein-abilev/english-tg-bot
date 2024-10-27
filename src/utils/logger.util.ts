import winston, { format } from "winston";
import { inspect } from "util";

const SYMBOLS = [Symbol.for("splat"), Symbol.for("MESSAGE"), Symbol.for("LEVEL")] as const;

export const logger = winston.createLogger({
    level: "silly",
    format: format.combine(
        format.colorize(),
        format.splat(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf((info) => {
            const { namespace, timestamp, level, message, ...meta } = info;
            const ts = timestamp.slice(0, 19).replace("T", " ");

            const cleanedMeta = Array.isArray(meta)
                ? meta
                : Object.keys(meta).reduce(
                      (acc, key) => {
                          if (!SYMBOLS.includes(key as never)) {
                              acc[key] = meta[key];
                          }
                          return acc;
                      },
                      {} as Record<string, unknown>,
                  );

            const metaStr = Object.keys(meta).length ? inspect(cleanedMeta, { colors: true }) : "";
            if (namespace) {
                const colorized = `\x1b[36m${namespace}\x1b[0m`;
                return `${ts} [${level}] (${colorized}): ${message} ${metaStr}`;
            }
            return `${ts} [${level}]: ${message} ${metaStr}`;
        }),
    ),
    transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: "logs.log" }),
    ],
});

export function createChildLogger(namespace: string): winston.Logger {
    return logger.child({ namespace });
}
