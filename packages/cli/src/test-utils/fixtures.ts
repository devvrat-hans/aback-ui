import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import type { Logger } from "../logger.js";
import type { Prompter } from "../prompt.js";

export interface CreatedProject {
  root: string;
  cleanup(): Promise<void>;
}

export interface ProjectOptions {
  srcDir?: boolean;
  withConfig?: boolean;
  css?: string;
}

const CONFIG = {
  style: "aback",
  rsc: true,
  tsx: true,
  tailwind: { config: "", css: "src/app/globals.css", baseColor: "neutral", cssVariables: true },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
    ui: "@/components/ui",
    lib: "@/lib",
    hooks: "@/hooks",
  },
  registries: { "@aback": "https://abackui.com/r/{name}.json" },
};

export async function createProject(options: ProjectOptions = {}): Promise<CreatedProject> {
  const root = await mkdtemp(path.join(tmpdir(), "aback-cli-project-"));
  const srcDir = options.srcDir ?? true;
  const css = options.css ?? "src/app/globals.css";

  const files: Record<string, string> = {
    "package.json": JSON.stringify(
      {
        name: "fixture-app",
        private: true,
        dependencies: { next: "16.0.0", react: "19.0.0", "react-dom": "19.0.0" },
        devDependencies: { tailwindcss: "^4.3.3", typescript: "^5.9.3" },
      },
      null,
      2,
    ),
    "tsconfig.json": JSON.stringify(
      {
        compilerOptions: {
          baseUrl: ".",
          paths: { "@/*": [srcDir ? "./src/*" : "./*"] },
        },
      },
      null,
      2,
    ),
    "bun.lock": "",
  };

  if (options.withConfig) {
    files["aback-ui.json"] = JSON.stringify(CONFIG, null, 2);
  }
  files[css] = '@import "tailwindcss";\n\n:root { color-scheme: light; }\n';

  for (const [file, content] of Object.entries(files)) {
    const absolute = path.join(root, file);
    await mkdir(path.dirname(absolute), { recursive: true });
    await writeFile(absolute, content, "utf8");
  }

  return {
    root,
    async cleanup() {
      await rm(root, { recursive: true, force: true });
    },
  };
}

function item(name: string, extra: Record<string, unknown> = {}) {
  return {
    name,
    type: "registry:ui",
    title: name,
    description: `${name} component`,
    files: [
      {
        path: `components/ui/${name}.tsx`,
        target: `components/ui/${name}.tsx`,
        content: `export const ${name.replace(/-/g, "_")} = true;\n`,
      },
    ],
    ...extra,
  };
}

export interface CreatedRegistry {
  dir: string;
  cleanup(): Promise<void>;
}

export async function createRegistry(): Promise<CreatedRegistry> {
  const dir = await mkdtemp(path.join(tmpdir(), "aback-cli-registry-"));
  const utils = {
    name: "utils",
    type: "registry:lib",
    title: "Class utility",
    files: [
      {
        path: "lib/utils.ts",
        target: "lib/utils.ts",
        content: 'export function cn() {\n  return "";\n}\n',
      },
    ],
    dependencies: ["clsx", "tailwind-merge"],
  };
  const theme = {
    name: "theme",
    type: "registry:file",
    title: "Aback theme",
    files: [
      {
        path: "styles/aback.css",
        target: "~/styles/aback.css",
        content: "@theme inline {\n  --color-brand: #009bf9;\n}\n",
      },
    ],
  };
  const button = item("button", {
    dependencies: ["class-variance-authority", "radix-ui"],
    registryDependencies: [path.join(dir, "utils.json")],
    docs: "https://abackui.com/docs/components/button",
  });
  const escape = {
    ...item("escape"),
    files: [
      {
        path: "components/ui/escape.tsx",
        target: "../../escaped.tsx",
        content: "nope\n",
      },
    ],
  };
  const signIn = {
    name: "sign-in",
    type: "registry:block",
    title: "Sign in",
    files: [
      {
        path: "registry/blocks/sign-in.tsx",
        target: "components/blocks/sign-in.tsx",
        content: "export function SignInBlock() {\n  return null;\n}\n",
      },
    ],
    registryDependencies: [path.join(dir, "utils.json")],
  };
  const cyclicA = item("cyclic-a", {
    registryDependencies: [path.join(dir, "cyclic-b.json")],
  });
  const cyclicB = item("cyclic-b", {
    registryDependencies: [path.join(dir, "cyclic-a.json")],
  });

  const entries: Array<[string, unknown]> = [
    ["utils.json", utils],
    ["theme.json", theme],
    ["button.json", button],
    ["sign-in.json", signIn],
    ["escape.json", escape],
    ["cyclic-a.json", cyclicA],
    ["cyclic-b.json", cyclicB],
  ];

  for (const [file, content] of entries) {
    await writeFile(path.join(dir, file), JSON.stringify(content, null, 2), "utf8");
  }

  await writeFile(
    path.join(dir, "index.json"),
    JSON.stringify({
      name: "aback-ui",
      items: [utils, theme, button, signIn].map((entry) => ({
        name: entry.name,
        type: entry.type,
        title: entry.title,
        description: "description" in entry ? entry.description : entry.title,
      })),
    }),
    "utf8",
  );

  return {
    dir,
    async cleanup() {
      await rm(dir, { recursive: true, force: true });
    },
  };
}

export function captureLogger(): { logger: Logger; lines: string[] } {
  const lines: string[] = [];
  const push = (message: string) => {
    lines.push(message);
  };
  return {
    lines,
    logger: {
      info: push,
      step: push,
      success: push,
      warn: push,
      error: push,
      dim: push,
      raw: push,
    },
  };
}

export const denyPrompter: Prompter = {
  confirm: async () => false,
};

export const acceptPrompter: Prompter = {
  confirm: async () => true,
};
