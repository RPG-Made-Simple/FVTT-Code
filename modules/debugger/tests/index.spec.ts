import { prepareForAPI } from "@rpgmadesimple/utils/src/misc";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Debugger } from "../src/debugger";

describe('index.ts', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    vi.mock('@rpgmadesimple/utils/src/misc', () => ({
      prepareForAPI: vi.fn(),
    }));

    vi.mock('../src/constants', () => ({
      Constants: {
        id: 'debugger',
        nameFlat: 'Debugger',
      },
    }));

    vi.mock('../src/debugger', () => ({
      Debugger: vi.fn().mockImplementation((module, prefix, shouldDebug, shouldSave) => ({
        module,
        prefix: `[${prefix}]`,
        shouldDebugVal: shouldDebug ?? false,
        shouldSaveVal: shouldSave ?? false,
        logStorage: '',
        info: vi.fn(),
      })),
    }));

    await import('../src/index.ts');
  });

  describe('init hook', () => {
    it('should call prepareForAPI with correct arguments', () => {
      global.__triggerHook('init');
      // @ts-ignore
      expect(Hooks.once).toHaveBeenCalledWith('init', expect.any(Function));
      expect(prepareForAPI).toHaveBeenCalledWith('debugger', Debugger);
    });
  });

  describe('ready hook', () => {
    it('should create Debugger instance and log messages', () => {
      global.__triggerHook('ready');

      // @ts-ignore
      expect(Hooks.once).toHaveBeenCalledWith('ready', expect.any(Function));
      expect(Debugger).toHaveBeenCalledWith('debugger', 'Debugger', true, false);

      const debuggerInstance = (Debugger as any).mock.results[0].value as unknown as Debugger;
      expect(debuggerInstance['module']).toBe('debugger');
      expect(debuggerInstance['prefix']).toBe('[Debugger]');

      expect(debuggerInstance.info).toHaveBeenCalledWith('Ready!');
      expect(debuggerInstance.info).toHaveBeenCalledWith('Library by 🐲 RPG Made Simple');

      // @ts-ignore
      expect(Hooks.call).toHaveBeenCalledWith('debugger.ready');
    })
  });
});
