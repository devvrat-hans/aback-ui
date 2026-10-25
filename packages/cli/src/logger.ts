import type { Writable } from "node:stream";

export interface Logger {
  info(message: string): void;
  step(message: string): void;
  success(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  dim(message: string): void;
  raw(message: string): void;
}

const ANSI = {
  reset: "\u001b[0m",
  dim: "\u001b[2m",
  bold: "\u001b[1m",
  green: "\u001b[32m",
  red: "\u001b[31m",
  yellow: "\u001b[33m",
  blue: "\u001b[34m",
} as const;

function shouldColor(stream: Writable): boolean {
  if (process.env.NO_COLOR) return false;
  if (process.env.FORCE_COLOR) return true;
  return Boolean((stream as Writable & { isTTY?: boolean }).isTTY);
}

export function createLogger(
  out: Writable = process.stdout,
  err: Writable = process.stderr,
): Logger {
  const colorOut = shouldColor(out);
  const colorErr = shouldColor(err);

  function paint(stream: Writable, enabled: boolean, code: string, message: string) {
    stream.write(enabled ? `${code}${message}${ANSI.reset}\n` : `${message}\n`);
  }

  return {
    info: (message) => paint(out, colorOut, "", message),
    step: (message) => paint(out, colorOut, ANSI.blue, `→ ${message}`),
    success: (message) => paint(out, colorOut, ANSI.green, `✓ ${message}`),
    warn: (message) => paint(err, colorErr, ANSI.yellow, `! ${message}`),
    error: (message) => paint(err, colorErr, ANSI.red, `✗ ${message}`),
    dim: (message) => paint(out, colorOut, ANSI.dim, message),
    raw: (message) => {
      out.write(`${message}\n`);
    },
  };
}

export const silentOut = {
  isTTY: false,
  write() {
    return true;
  },
} as unknown as Writable;

export const silentErr = {
  isTTY: false,
  write() {
    return true;
  },
} as unknown as Writable;
