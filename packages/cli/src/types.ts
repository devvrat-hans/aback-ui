export interface RegistryFile {
  path: string;
  content: string;
  type?: string;
  target?: string;
}

export interface RegistryItemMeta {
  status?: string;
  usedIn?: string[];
  [key: string]: unknown;
}

export interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  categories?: string[];
  docs?: string;
  meta?: RegistryItemMeta;
  files: RegistryFile[];
}

export interface RegistryIndexItem {
  name: string;
  type: string;
  title: string;
  description: string;
  categories?: string[];
  docs?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  meta?: RegistryItemMeta;
}

export interface RegistryIndex {
  name?: string;
  homepage?: string;
  items: RegistryIndexItem[];
}

export type PackageManager = "bun" | "pnpm" | "yarn" | "npm";

export interface AbackConfig {
  $schema?: string;
  style?: string;
  rsc?: boolean;
  tsx?: boolean;
  tailwind?: {
    config?: string;
    css?: string;
    baseColor?: string;
    cssVariables?: boolean;
    [key: string]: unknown;
  };
  aliases?: {
    components?: string;
    utils?: string;
    ui?: string;
    lib?: string;
    hooks?: string;
    [key: string]: string | undefined;
  };
  registries?: Record<string, string>;
  [key: string]: unknown;
}

export interface InstallDirs {
  components: string;
  ui: string;
  blocks: string;
  lib: string;
  hooks: string;
  styles: string;
}

export type OverwriteMode = "prompt" | "always" | "never";

export interface FileWriteResult {
  item: string;
  target: string;
  absolutePath: string;
  status: "written" | "unchanged" | "skipped";
}

export interface RegistryFetch {
  (url: string): Promise<{
    ok: boolean;
    status: number;
    json(): Promise<unknown>;
    text(): Promise<string>;
  }>;
}
