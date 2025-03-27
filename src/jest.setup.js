globalThis.importMeta = {
  env: {
    VITE_API_URL: 'https://example.com',
    VITE_FEATURE_FLAG: 'true',
    VITE_ACCESSELF_API_KEY: 'test-api-key',
  }
};

// Alias to match how it's used in code
globalThis.import = {
  meta: globalThis.importMeta,
};
