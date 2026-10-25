// Loaded with `node --import` so any network request fails loudly. The CLI
// must install from the registry bundled in its own package.
globalThis.fetch = async (input) => {
  throw new Error(`network blocked in the consumer test: ${String(input)}`);
};
