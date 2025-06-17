import { beforeEach, vi } from 'vitest';

global.game = {
  permissions: {
    FILES_BROWSE: [1],
    FILES_UPLOAD: [1],
  },
  user: { role: 1 },
}

global.saveDataToFile = vi.fn();

vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'info').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

global.hooksCallbacks = new Map<string, Array<(...args: any[]) => void>>;

global.Hooks = {
  once: vi.fn((hook: string, callback: (...args: any[]) => void) => {
    if (!global.hooksCallbacks.has(hook)) {
      global.hooksCallbacks.set(hook, []);
    }
    global.hooksCallbacks.get(hook)!.push(callback);
  }),
  call: vi.fn((hook: string, ...args: any[]) => {
    const callbacks = global.hooksCallbacks.get(hook) || [];
    callbacks.forEach((cb) => cb(...args));
    return true;
  }),
};

global.__triggerHook = (hook: string, ...args: any[]) => {
  const callbacks = global.hooksCallbacks.get(hook) || [];
  callbacks.forEach((cb) => cb(...args));
};

beforeEach(() => {
  global.hooksCallbacks.clear();
});

declare global {
  interface Window {
    hooksCallbacks: Map<string, Array<(...args: any[]) => void>>;
    __triggerHook: (hook: string, ...args: any[]) => void;
  }
}
