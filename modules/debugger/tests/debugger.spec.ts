import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Debugger } from '../src/debugger';
import { FoundryFileSystem } from "@rpgmadesimple/utils";

vi.mock('@rpgmadesimple/utils', () => ({
  Misc: {
    validate: vi.fn(),
    argStringfy: vi.fn((...args) => args.join(' ')),
  },
  Time: {
    getNowFormatted: vi.fn(() => '09:30:00'),
  },
  FoundryFileSystem: {
    ensure: vi.fn(),
    save: vi.fn(),
  },
}));

vi.mock('../src/constants', () => ({
  Constants: {
    nameFlat: 'Debugger',
  },
}));

describe('Debugger', () => {
  let debuggerInstance: Debugger;

  beforeEach(() => {
    vi.clearAllMocks();
    Debugger.shouldDebugGlobal(true);
    debuggerInstance = new Debugger('testModule', 'TEST', true, true);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('constructor', () => {
    it('should initialize correctly', () => {
      expect(debuggerInstance['module']).toBe('testModule');
      expect(debuggerInstance['prefix']).toBe('[TEST]');
      expect(debuggerInstance['shouldDebugVal']).toBe(true);
      expect(debuggerInstance['shouldSaveVal']).toBe(true);
      expect(debuggerInstance['logStorage']).toBe('');
      expect(Debugger.getRegisteredDebuggers()).toContain(debuggerInstance);
      expect(console.info).toHaveBeenCalledWith(
        '[Debugger] registered a Debugger for the "testModule" module'
      );
    });

    it('should set default debug/save flags when undefined', () => {
      const instance = new Debugger('testModule', 'TEST');
      expect(instance['shouldDebugVal']).toBe(false);
      expect(instance['shouldSaveVal']).toBe(false);
      expect(instance['module']).toBe('testModule');
      expect(instance['prefix']).toBe('[TEST]');
      expect(instance['logStorage']).toBe('');
      expect(Debugger.getRegisteredDebuggers()).toContain(instance);
    });
  });

  describe('shouldDebugGlobal', () => {
    it('should set SHOULD_DEBUG_GLOBAL flag', () => {
      Debugger.shouldDebugGlobal(false);
      expect(Debugger.isDebugGlobalEnabled()).toBe(false);
      Debugger.shouldDebugGlobal(true);
      expect(Debugger.isDebugGlobalEnabled()).toBe(true);
    });
  });

  describe('shouldDebug', () => {
    it('should set instance debug flag', () => {
      debuggerInstance.shouldDebug(false);
      expect(debuggerInstance['shouldDebugVal']).toBe(false);
      debuggerInstance.shouldDebug(true);
      expect(debuggerInstance['shouldDebugVal']).toBe(true);
    });
  });

  describe('shouldSave', () => {
    it('should set instance save flag', () => {
      debuggerInstance.shouldSave(false);
      expect(debuggerInstance['shouldSaveVal']).toBe(false);
      debuggerInstance.shouldSave(true);
      expect(debuggerInstance['shouldSaveVal']).toBe(true);
    });
  });

  describe('log', () => {
    it('should output to console and update logStorage when enabled', () => {
      debuggerInstance.log('test message');
      expect(console.log).toHaveBeenCalledWith('[TEST]', 'test message');
      expect(debuggerInstance['logStorage']).toBe('[09:30:00] test message');
    });

    it('should not output to console or update logStorage when globally disabled', () => {
      Debugger.shouldDebugGlobal(false);
      debuggerInstance.log('test message');
      expect(console.log).not.toHaveBeenCalled();
      expect(debuggerInstance['logStorage']).toBe('');
    });

    it('should not output to console and should update logStorage when locally disabled', () => {
      debuggerInstance.shouldDebug(false);
      debuggerInstance.log('test message');
      expect(console.log).not.toHaveBeenCalled();
      expect(debuggerInstance['logStorage']).toBe('[09:30:00] test message');
    })

    it('should output to console and should not update logStorage when locally disabled', () => {
      debuggerInstance.shouldSave(false);
      debuggerInstance.log('test message');
      expect(console.log).toHaveBeenCalledWith('[TEST]', 'test message');
      expect(debuggerInstance['logStorage']).toBe('');
    });
  });

  describe('info', () => {
    it('should output to console and update logStorage when enabled', () => {
      debuggerInstance.info('test message');
      expect(console.info).toHaveBeenCalledWith('[TEST][INFO]', 'test message');
      expect(debuggerInstance['logStorage']).toBe('[09:30:00][INFO] test message');
    });

    it('should not output to console or update logStorage when globally disabled', () => {
      Debugger.shouldDebugGlobal(false);
      debuggerInstance.info('test message');
      expect(console.info).not.toHaveBeenCalledWith('[TEST][INFO]', 'test message');
      expect(debuggerInstance['logStorage']).toBe('');
    });

    it('should not output to console and should update logStorage when locally disabled', () => {
      debuggerInstance.shouldDebug(false);
      debuggerInstance.info('test message');
      expect(console.info).not.toHaveBeenCalledWith('[TEST][INFO]', 'test message');
      expect(debuggerInstance['logStorage']).toBe('[09:30:00][INFO] test message');
    })

    it('should output to console and should not update logStorage when locally disabled', () => {
      debuggerInstance.shouldSave(false);
      debuggerInstance.info('test message');
      expect(console.info).toHaveBeenCalledWith('[TEST][INFO]', 'test message');
      expect(debuggerInstance['logStorage']).toBe('');
    });
  });

  describe('warn', () => {
    it('should output to console and update logStorage when enabled', () => {
      debuggerInstance.warn('test message');
      expect(console.warn).toHaveBeenCalledWith('[TEST][WARN]', 'test message');
      expect(debuggerInstance['logStorage']).toBe('[09:30:00][WARN] test message');
    });

    it('should not output to console or update logStorage when globally disabled', () => {
      Debugger.shouldDebugGlobal(false);
      debuggerInstance.warn('test message');
      expect(console.warn).not.toHaveBeenCalled();
      expect(debuggerInstance['logStorage']).toBe('');
    });

    it('should not output to console and should update logStorage when locally disabled', () => {
      debuggerInstance.shouldDebug(false);
      debuggerInstance.warn('test message');
      expect(console.warn).not.toHaveBeenCalled();
      expect(debuggerInstance['logStorage']).toBe('[09:30:00][WARN] test message');
    })

    it('should output to console and should not update logStorage when locally disabled', () => {
      debuggerInstance.shouldSave(false);
      debuggerInstance.warn('test message');
      expect(console.warn).toHaveBeenCalledWith('[TEST][WARN]', 'test message');
      expect(debuggerInstance['logStorage']).toBe('');
    });
  });

  describe('error', () => {
    it('should output to console and update logStorage when enabled', () => {
      debuggerInstance.error('test message');
      expect(console.error).toHaveBeenCalledWith('[TEST][ERROR]', 'test message');
      expect(debuggerInstance['logStorage']).toBe('[09:30:00][ERROR] test message');
    });

    it('should not output to console or update logStorage when globally disabled', () => {
      Debugger.shouldDebugGlobal(false);
      debuggerInstance.error('test message');
      expect(console.error).not.toHaveBeenCalled();
      expect(debuggerInstance['logStorage']).toBe('');
    });

    it('should not output to console and should update logStorage when locally disabled', () => {
      debuggerInstance.shouldDebug(false);
      debuggerInstance.error('test message');
      expect(console.error).not.toHaveBeenCalled();
      expect(debuggerInstance['logStorage']).toBe('[09:30:00][ERROR] test message');
    })

    it('should output to console and should not update logStorage when locally disabled', () => {
      debuggerInstance.shouldSave(false);
      debuggerInstance.error('test message');
      expect(console.error).toHaveBeenCalledWith('[TEST][ERROR]', 'test message');
      expect(debuggerInstance['logStorage']).toBe('');
    });
  });

  describe('dump', () => {
    it('should call file save methods with logStorage when permissions allow', async () => {
      vi.mocked(FoundryFileSystem.ensure).mockReturnValue(Promise.resolve(true));
      vi.mocked(FoundryFileSystem.save).mockReturnValue(Promise.resolve(true));
      debuggerInstance['logStorage'] = 'test log';
      await debuggerInstance.dump();

      expect(FoundryFileSystem.ensure).toHaveBeenCalledWith('./debugger');
      expect(FoundryFileSystem.save).toHaveBeenCalledWith(
        'testModule_log.json',
        'test log'
      );
      expect(global.saveDataToFile).toHaveBeenCalledWith(
        'test log',
        'application/json',
        'testModule.log'
      );
    });

    it('should output warning when permissions are unsufficient', async () => {
      global.game = {
        permissions: {
          FILES_BROWSE: [2],
          FILES_UPLOAD: [2],
        },
        user: { role: 1 },
      };
      debuggerInstance['logStorage'] = 'test log to download';
      await debuggerInstance.dump();
      expect(console.warn).toHaveBeenCalledWith(
        '[Debugger][WARN] current user lacks enough permission to dump log to server'
      );
      expect(FoundryFileSystem.ensure).not.toHaveBeenCalled();
      expect(FoundryFileSystem.save).not.toHaveBeenCalled();
      expect(global.saveDataToFile).toHaveBeenCalledWith(
        'test log to download',
        'application/json',
        'testModule.log'
      );
    });
  });

  describe('dumpAll', () => {
    it('should call dump on all registered debuggers', async () => {
      const debugger2 = new Debugger('module2', 'TEST2', true, true);
      const dumpSpy = vi.spyOn(debuggerInstance, 'dump');
      const dumpSpy2 = vi.spyOn(debugger2, 'dump');
      await Debugger.dumpAll();
      expect(dumpSpy).toHaveBeenCalled();
      expect(dumpSpy2).toHaveBeenCalled();
    })
  })
})
