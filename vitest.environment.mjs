import { builtinEnvironments } from 'vitest/environments';

export default {
  name: 'jsdom-native-abort',
  transformMode: 'web',
  async setup(global, options) {
    // Capture native Node.js AbortController/AbortSignal before jsdom replaces them.
    // jsdom installs its own versions, which are incompatible with Node.js's undici
    // (the internal fetch implementation). Remix's createMemoryRouter creates a Request
    // with a signal, and undici uses a brand-check (private field) rather than instanceof,
    // so jsdom's AbortSignal always fails the check.
    const NativeAbortController = global.AbortController;
    const NativeAbortSignal = global.AbortSignal;

    const env = await builtinEnvironments.jsdom.setup(global, options);

    // Restore native versions so undici's fetch/Request accepts the signals.
    const g = global;
    g.AbortController = NativeAbortController;
    g.AbortSignal = NativeAbortSignal;

    return env;
  },
};
