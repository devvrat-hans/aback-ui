import { createInterface } from "node:readline/promises";

export interface Prompter {
  confirm(message: string, defaultValue?: boolean): Promise<boolean>;
}

interface ReadableInput {
  isTTY?: boolean;
}

interface WritableOutput {
  write(chunk: string): boolean;
}

/** Interactive prompt that returns the default answer when stdin is not a TTY. */
export function createPrompter(
  input: ReadableInput = process.stdin as ReadableInput,
  output: WritableOutput = process.stdout as WritableOutput,
): Prompter {
  return {
    async confirm(message, defaultValue = false) {
      if (!input.isTTY) return defaultValue;

      const suffix = defaultValue ? " [Y/n] " : " [y/N] ";
      const readline = createInterface({
        input: input as NodeJS.ReadStream,
        output: output as NodeJS.WritableStream,
      });
      try {
        const answer = (await readline.question(`${message}${suffix}`)).trim().toLowerCase();
        if (!answer) return defaultValue;
        return answer === "y" || answer === "yes";
      } finally {
        readline.close();
      }
    },
  };
}
