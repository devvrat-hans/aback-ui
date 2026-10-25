export class CommandError extends Error {
  readonly code: number;

  constructor(message: string, code = 1) {
    super(message);
    this.name = "CommandError";
    this.code = code;
  }
}

export function commandError(message: string, code = 1): CommandError {
  return new CommandError(message, code);
}
