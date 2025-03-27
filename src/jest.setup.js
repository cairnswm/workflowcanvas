globalThis.importMeta = {
  env: {
    VITE_API_URL: 'https://example.com',
    VITE_FEATURE_FLAG: 'true',
  }
};

// Alias to match how it's used in code
globalThis.import = {
  meta: globalThis.importMeta,
};