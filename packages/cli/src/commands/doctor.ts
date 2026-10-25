import { findProjectRoot } from "../config.js";
import { diagnoseProject, type DoctorStatus } from "../doctor.js";
import { commandError } from "../errors.js";
import type { Logger } from "../logger.js";

export interface DoctorCommandOptions {
  cwd: string;
  json?: boolean;
  logger: Logger;
}

const SYMBOL: Record<DoctorStatus, string> = {
  pass: "✓",
  warn: "!",
  fail: "✗",
  skip: "–",
};

export async function runDoctor(options: DoctorCommandOptions): Promise<number> {
  const root = await findProjectRoot(options.cwd);
  if (!root) {
    throw commandError(
      `No package.json found from ${options.cwd}. Run this inside a JavaScript project.`,
    );
  }

  const report = await diagnoseProject({ root });

  if (options.json) {
    options.logger.raw(JSON.stringify(report, null, 2));
    return report.summary.ok ? 0 : 1;
  }

  const { logger } = options;
  logger.raw("Aback UI doctor");
  logger.dim(report.root);
  logger.raw("");

  for (const check of report.checks) {
    logger.raw(`${SYMBOL[check.status]} ${check.title}: ${check.detail}`);
    if (check.hint && check.status !== "pass") {
      logger.dim(`  → ${check.hint}`);
    }
  }

  const { passed, warnings, errors, skipped } = report.summary;
  logger.raw("");
  logger.raw(
    `${passed} passed, ${warnings} warning${warnings === 1 ? "" : "s"}, ` +
      `${errors} error${errors === 1 ? "" : "s"}${skipped ? `, ${skipped} skipped` : ""}.`,
  );

  if (errors > 0) {
    logger.warn("Fix the errors above, then run `aback-ui doctor` again.");
  } else if (warnings > 0) {
    logger.info("No blocking problems. Review the warnings above.");
  } else {
    logger.success("Everything checks out.");
  }

  return report.summary.ok ? 0 : 1;
}
