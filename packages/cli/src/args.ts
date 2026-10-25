const BOOLEAN_FLAGS = new Set([
  "yes",
  "overwrite",
  "dry-run",
  "no-install",
  "no-overwrite",
  "json",
  "all",
  "force",
  "help",
  "version",
]);

const ALIASES: Record<string, string> = {
  y: "yes",
  h: "help",
  v: "version",
};

export interface ParsedArgs {
  command: string | undefined;
  positionals: string[];
  flags: Map<string, string | boolean>;
  unknown: string[];
}

/**
 * A deliberately small argument parser. It supports the shapes the CLI
 * documents: `--flag`, `--flag=value`, `--flag value`, `-y`, and `--`.
 * Unknown flags are reported instead of silently ignored.
 */
export function parseArgs(argv: string[]): ParsedArgs {
  const positionals: string[] = [];
  const flags = new Map<string, string | boolean>();
  const unknown: string[] = [];
  let command: string | undefined;
  let endOfFlags = false;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === undefined) continue;

    if (token === "--") {
      endOfFlags = true;
      continue;
    }

    if (endOfFlags || !token.startsWith("-") || token === "-") {
      if (command === undefined) {
        command = token;
      } else {
        positionals.push(token);
      }
      continue;
    }

    if (token.startsWith("--")) {
      const body = token.slice(2);
      if (!body) {
        unknown.push(token);
        continue;
      }

      const equals = body.indexOf("=");
      const rawName = equals === -1 ? body : body.slice(0, equals);
      const name = ALIASES[rawName] ?? rawName;
      if (!BOOLEAN_FLAGS.has(name) && equals === -1) {
        const next = argv[index + 1];
        if (next !== undefined && !next.startsWith("-")) {
          flags.set(name, next);
          index += 1;
          continue;
        }
        unknown.push(token);
        continue;
      }

      if (equals !== -1) {
        flags.set(name, body.slice(equals + 1));
      } else {
        flags.set(name, true);
      }
      continue;
    }

    const short = token.slice(1);
    const name = ALIASES[short] ?? short;
    if (BOOLEAN_FLAGS.has(name)) {
      flags.set(name, true);
    } else {
      unknown.push(token);
    }
  }

  return { command, positionals, flags, unknown };
}

export function flagString(args: ParsedArgs, name: string): string | undefined {
  const value = args.flags.get(name);
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function flagBoolean(args: ParsedArgs, name: string): boolean {
  return args.flags.get(name) === true;
}
