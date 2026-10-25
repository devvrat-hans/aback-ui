import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import {
  detectAlias,
  detectFramework,
  detectTailwindMajor,
  existsPath,
  loadConfig,
  readPackageJson,
  readTsconfig,
  resolveAlias,
  resolveInstallDirs,
} from "./config.js";
import { safeJoin, toPosix } from "./paths.js";
import type { AbackConfig } from "./types.js";

export type DoctorStatus = "pass" | "warn" | "fail" | "skip";

export interface DoctorCheck {
  id: string;
  title: string;
  status: DoctorStatus;
  detail: string;
  /** What the developer should do when the check is not passing. */
  hint?: string;
}

export interface DoctorSummary {
  passed: number;
  warnings: number;
  errors: number;
  skipped: number;
  ok: boolean;
}

export interface DoctorReport {
  root: string;
  checks: DoctorCheck[];
  summary: DoctorSummary;
}

export interface DoctorOptions {
  root: string;
  /** Node version to test, defaulting to the running process. */
  nodeVersion?: string;
}

const MINIMUM_NODE = { major: 20, minor: 9 } as const;

const LOCKFILES = ["bun.lock", "bun.lockb", "pnpm-lock.yaml", "yarn.lock", "package-lock.json"];

function compareVersions(actual: string, minimum: { major: number; minor: number }): boolean {
  const [major = 0, minor = 0] = actual.split(".").map((part) => Number.parseInt(part, 10));
  return major > minimum.major || (major === minimum.major && minor >= minimum.minor);
}

function relative(root: string, absolute: string): string {
  return toPosix(path.relative(root, absolute)) || ".";
}

/**
 * Resolve an aliased module the way a bundler would: the alias points at a
 * module name, not a file, so `@/lib/utils` must find `utils.ts` as well as
 * `utils/index.ts`.
 */
async function resolveModuleFile(base: string): Promise<string | null> {
  for (const extension of ["", ".ts", ".tsx", ".js", ".jsx"]) {
    const candidate = `${base}${extension}`;
    if (await existsPath(candidate)) return candidate;
  }
  for (const index of ["index.ts", "index.tsx", "index.js", "index.jsx"]) {
    const candidate = path.join(base, index);
    if (await existsPath(candidate)) return candidate;
  }
  return null;
}

/**
 * Inspect a project without changing it.
 *
 * Every check is local and deterministic: no registry request, no package
 * install, and no file writes. That makes `doctor` safe to run in CI and in a
 * pre-commit hook, and it means the result never depends on network access.
 */
export async function diagnoseProject(options: DoctorOptions): Promise<DoctorReport> {
  const { root } = options;
  const checks: DoctorCheck[] = [];

  function add(
    id: string,
    title: string,
    status: DoctorStatus,
    detail: string,
    hint?: string,
  ) {
    checks.push({ id, title, status, detail, ...(hint ? { hint } : {}) });
  }

  const nodeVersion = options.nodeVersion ?? process.versions.node;
  if (compareVersions(nodeVersion, MINIMUM_NODE)) {
    add("node", "Node.js", "pass", `${nodeVersion} meets the >=20.9 requirement.`);
  } else {
    add(
      "node",
      "Node.js",
      "fail",
      `${nodeVersion} is below the required >=20.9.`,
      "Upgrade Node.js. Aback UI packages declare engines >=20.9.",
    );
  }

  let pkg;
  try {
    pkg = await readPackageJson(root);
    add("package", "package.json", "pass", "Found and parsed.");
  } catch (error) {
    add(
      "package",
      "package.json",
      "fail",
      (error as Error).message,
      "Run this command from a JavaScript project.",
    );
  }

  if (pkg) {
    const framework = detectFramework(pkg);
    add(
      "framework",
      "Framework",
      "pass",
      framework === "unknown"
        ? "No Next.js, Vite, Remix, or Astro dependency detected; components are framework-agnostic."
        : `Detected ${framework}.`,
    );

    const tailwind = detectTailwindMajor(pkg);
    if (tailwind === null) {
      add(
        "tailwind",
        "Tailwind CSS",
        "fail",
        "Tailwind CSS is not in dependencies or devDependencies.",
        "Install Tailwind CSS v4: the Aback theme uses @theme inline.",
      );
    } else if (tailwind < 4) {
      add(
        "tailwind",
        "Tailwind CSS",
        "fail",
        `Tailwind CSS v${tailwind} is installed; v4 is required.`,
        "Upgrade to Tailwind CSS v4 before installing components.",
      );
    } else {
      add("tailwind", "Tailwind CSS", "pass", `v${tailwind} detected.`);
    }
  }

  let config: AbackConfig | null = null;
  try {
    config = await loadConfig(root);
    if (config) {
      add("config", "aback-ui.json", "pass", "Found and parsed.");
    } else {
      add(
        "config",
        "aback-ui.json",
        "fail",
        "aback-ui.json is missing.",
        "Run `aback-ui init` to create it and install the theme.",
      );
    }
  } catch (error) {
    add(
      "config",
      "aback-ui.json",
      "fail",
      (error as Error).message,
      "Fix the JSON, or run `aback-ui init --force` to rewrite it.",
    );
  }

  if (!config) {
    add("aliases", "Path aliases", "skip", "Needs aback-ui.json.");
    add("utils", "Class utility", "skip", "Needs aback-ui.json.");
    add("css", "Global stylesheet", "skip", "Needs aback-ui.json.");
    add("theme", "Aback theme", "skip", "Needs aback-ui.json.");
    add("registry", "Registry", "skip", "Needs aback-ui.json.");
    add("installed", "Installed components", "skip", "Needs aback-ui.json.");
  } else {
    if (config.style === "aback") {
      add("style", "Style", "pass", 'Using the "aback" style.');
    } else {
      add(
        "style",
        "Style",
        "warn",
        `aback-ui.json sets style "${config.style ?? "(missing)"}", not "aback".`,
        'Set "style" to "aback" so component docs and theme tokens match.',
      );
    }

    const tsconfig = await readTsconfig(root);
    const alias = detectAlias(tsconfig, root);
    if (alias) {
      add(
        "aliases",
        "Path aliases",
        "pass",
        `${alias.prefix} resolves to ${relative(root, alias.base)}.`,
      );
    } else {
      add(
        "aliases",
        "Path aliases",
        "warn",
        "No usable path alias in tsconfig.json or jsconfig.json.",
        'Add a mapping such as "@/*": ["./src/*"] under compilerOptions.paths.',
      );
    }

    const utilsAlias = config.aliases?.utils;
    const utilsTarget = utilsAlias ? resolveAlias(utilsAlias, tsconfig, root) : null;
    const utilsFile = utilsTarget ? await resolveModuleFile(utilsTarget.absolute) : null;
    if (!utilsTarget) {
      add(
        "utils",
        "Class utility",
        "warn",
        `The utils alias "${utilsAlias ?? "(missing)"}" does not resolve inside the project.`,
        "Set aliases.utils in aback-ui.json, for example @/lib/utils.",
      );
    } else if (utilsFile) {
      add("utils", "Class utility", "pass", `${relative(root, utilsFile)} exists.`);
    } else {
      add(
        "utils",
        "Class utility",
        "warn",
        `${relative(root, utilsTarget.absolute)} is missing.`,
        "Run `aback-ui add utils` to restore the cn() helper.",
      );
    }

    const cssRelative = config.tailwind?.css;
    if (!cssRelative) {
      add(
        "css",
        "Global stylesheet",
        "fail",
        "tailwind.css is not set in aback-ui.json.",
        "Set tailwind.css to the project stylesheet, for example src/app/globals.css.",
      );
    } else {
      let cssPath: string | null = null;
      try {
        cssPath = safeJoin(root, cssRelative.replace(/^\.\//, ""));
      } catch (error) {
        add("css", "Global stylesheet", "fail", (error as Error).message);
      }

      if (cssPath) {
        if (!(await existsPath(cssPath))) {
          add(
            "css",
            "Global stylesheet",
            "fail",
            `${cssRelative} does not exist.`,
            "Correct tailwind.css in aback-ui.json, or create the file.",
          );
        } else {
          const css = await readFile(cssPath, "utf8");
          if (css.includes("aback.css") || css.includes("@theme inline")) {
            add("css", "Global stylesheet", "pass", `${cssRelative} imports Aback styles.`);
          } else {
            add(
              "css",
              "Global stylesheet",
              "warn",
              `${cssRelative} does not reference aback.css.`,
              'Add @import "./styles/aback.css"; after the Tailwind import.',
            );
          }
        }
      }
    }

    const dirs = await resolveInstallDirs(root, config);
    const themeFile = path.join(dirs.styles, "aback.css");
    if (await existsPath(themeFile)) {
      add("theme", "Aback theme", "pass", `${relative(root, themeFile)} exists.`);
    } else {
      add(
        "theme",
        "Aback theme",
        "warn",
        `${relative(root, themeFile)} is missing.`,
        "Run `aback-ui add theme` to install the semantic tokens.",
      );
    }

    const registry = config.registries?.["@aback"];
    if (!registry) {
      add(
        "registry",
        "Registry",
        "warn",
        'No "@aback" registry in aback-ui.json.',
        'Add "@aback": "https://abackui.com/r/{name}.json" under registries.',
      );
    } else if (!registry.includes("{name}") || !/^https?:\/\//.test(registry)) {
      add(
        "registry",
        "Registry",
        "warn",
        `The "@aback" template is not an HTTP template with {name}.`,
        'Use "https://abackui.com/r/{name}.json".',
      );
    } else {
      add("registry", "Registry", "pass", registry);
    }

    try {
      const entries = await readdir(dirs.ui);
      const components = entries.filter(
        (entry) => entry.endsWith(".tsx") && !entry.endsWith(".test.tsx"),
      );
      add(
        "installed",
        "Installed components",
        "pass",
        components.length === 0
          ? "No components installed yet."
          : `${components.length} component file(s) in ${relative(root, dirs.ui)}.`,
      );
    } catch {
      add("installed", "Installed components", "pass", "No components installed yet.");
    }
  }

  const locks = [];
  for (const lock of LOCKFILES) {
    if (await existsPath(path.join(root, lock))) locks.push(lock);
  }
  if (locks.length > 1) {
    add(
      "lockfile",
      "Package manager",
      "warn",
      `Multiple lockfiles found: ${locks.join(", ")}.`,
      "Keep the lockfile for the package manager you use and remove the others.",
    );
  } else if (locks.length === 1) {
    add("lockfile", "Package manager", "pass", `Using ${locks[0]}.`);
  } else {
    add("lockfile", "Package manager", "skip", "No lockfile found.");
  }

  const summary: DoctorSummary = {
    passed: checks.filter((check) => check.status === "pass").length,
    warnings: checks.filter((check) => check.status === "warn").length,
    errors: checks.filter((check) => check.status === "fail").length,
    skipped: checks.filter((check) => check.status === "skip").length,
    ok: checks.every((check) => check.status !== "fail"),
  };

  return { root, checks, summary };
}
