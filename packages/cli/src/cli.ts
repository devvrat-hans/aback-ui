import { flagBoolean, flagString, parseArgs } from "./args.js";
import { runAdd } from "./commands/add.js";
import { runDiff } from "./commands/diff.js";
import { runDoctor } from "./commands/doctor.js";
import { runInit } from "./commands/init.js";
import { runList } from "./commands/list.js";
import { runView } from "./commands/view.js";
import { CommandError } from "./errors.js";
import { CLI_VERSION, HELP } from "./help.js";
import type { InstallDependenciesOptions } from "./install.js";
import { createLogger, type Logger } from "./logger.js";
import { createPrompter, type Prompter } from "./prompt.js";
import type { RegistryFetch } from "./types.js";

export interface CliContext {
  cwd?: string;
  logger?: Logger;
  prompter?: Prompter;
  fetchImpl?: RegistryFetch;
  installPackages?: (options: InstallDependenciesOptions) => Promise<void>;
}

export async function runCli(argv: string[], context: CliContext = {}): Promise<number> {
  const logger = context.logger ?? createLogger();
  const prompter = context.prompter ?? createPrompter();
  const args = parseArgs(argv);
  const cwd = flagString(args, "cwd") ?? context.cwd ?? process.cwd();

  if (args.unknown.length > 0) {
    logger.error(`Unknown option: ${args.unknown.join(", ")}`);
    logger.dim("Run `aback-ui --help` to see the available options.");
    return 1;
  }

  if (flagBoolean(args, "version") || args.command === "version") {
    logger.raw(CLI_VERSION);
    return 0;
  }

  if (flagBoolean(args, "help") || args.command === "help" || args.command === undefined) {
    logger.raw(HELP);
    return 0;
  }

  const shared = {
    cwd,
    registry: flagString(args, "registry"),
    logger,
    prompter,
    fetchImpl: context.fetchImpl,
  };

  try {
    switch (args.command) {
      case "init":
        return await runInit({
          ...shared,
          yes: flagBoolean(args, "yes"),
          force: flagBoolean(args, "force"),
          css: flagString(args, "css"),
          noInstall: flagBoolean(args, "no-install"),
          dryRun: flagBoolean(args, "dry-run"),
          installPackages: context.installPackages,
        });
      case "add":
        return await runAdd({
          ...shared,
          items: args.positionals,
          yes: flagBoolean(args, "yes"),
          overwrite: flagBoolean(args, "overwrite"),
          noOverwrite: flagBoolean(args, "no-overwrite"),
          noInstall: flagBoolean(args, "no-install"),
          dryRun: flagBoolean(args, "dry-run"),
          installPackages: context.installPackages,
        });
      case "doctor":
        return await runDoctor({
          cwd,
          json: flagBoolean(args, "json"),
          logger,
        });
      case "diff":
        return await runDiff({
          ...shared,
          items: args.positionals,
          all: flagBoolean(args, "all"),
          json: flagBoolean(args, "json"),
        });
      case "list":
        return await runList({
          ...shared,
          query: args.positionals[0],
          json: flagBoolean(args, "json"),
        });
      case "view":
        if (!args.positionals[0]) {
          throw new CommandError("Name the item to inspect, for example: aback-ui view button");
        }
        return await runView({
          ...shared,
          item: args.positionals[0],
          json: flagBoolean(args, "json"),
        });
      default:
        logger.error(`Unknown command: ${args.command}`);
        logger.dim("Run `aback-ui --help` for usage.");
        return 1;
    }
  } catch (error) {
    if (error instanceof CommandError) {
      logger.error(error.message);
      return error.code;
    }
    logger.error(error instanceof Error ? error.message : String(error));
    if (process.env.DEBUG) {
      logger.dim(error instanceof Error ? (error.stack ?? "") : "");
    }
    return 1;
  }
}
