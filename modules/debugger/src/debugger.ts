import { FoundryFileSystem, Misc, Time } from "@rpgmadesimple/utils";
import { Constants } from "./constants.ts";

/**
 * Schemas for runtime validation.
 */
const BooleanSchema = { type: "boolean" };
const StringSchema = { type: "string" };
const OptionalBooleanSchema = { type: ["boolean", "null", "undefined"] };

export class Debugger {
  static SHOULD_DEBUG: boolean = true;
  static debuggers: Array<Debugger> = [];

  /** Which module is this Debugger from */
  private module: string;

  /** Which prefix will be shown at the logger */
  private prefix: string = "";

  /** Should the Debugger actually debug? */
  private shouldDebugVal: boolean = false;

  /** Should the log be saved? */
  private shouldSaveVal: boolean = false;

  /** Where logs get stored for later dumping */
  private logStorage: string = "";

  /**
   * Toggles debugging for all registered Debuggers.
   * @param shouldDebug
   */
  static shouldDebugGlobal(shouldDebug: boolean): void {
    Misc.validate({ shouldDebug }, { shouldDebug: BooleanSchema.type });
    Debugger.SHOULD_DEBUG = shouldDebug;
  }

  /**
   * Toggles debugging for this instance.
   * @param shouldDebug
   */
  shouldDebug(shouldDebug: boolean): void {
    Misc.validate({ shouldDebug }, { shouldDebug: BooleanSchema.type });
    this.shouldDebugVal = shouldDebug;
  }

  /**
   * Toggles saving for this instance.
   * @param shouldSave
   */
  shouldSave(shouldSave: boolean): void {
    Misc.validate({ shouldSave }, { shouldSave: BooleanSchema.type });
    this.shouldSaveVal = shouldSave;
  }

  /**
   * Creates a new Debugger and returns it.
   * @param module the module this Debugger will be related to.
   * @param prefix the prefix for this Debugger's logs.
   * @param shouldDebug should it debug?
   * @param shouldSave should it save logs?
   */
  constructor(
    module: string,
    prefix: string,
    shouldDebug: boolean | null | undefined,
    shouldSave: boolean | null | undefined
  ) {
    Misc.validate(
      { module, prefix, shouldDebug, shouldSave },
      {
        module: StringSchema.type,
        prefix: StringSchema.type,
        shouldDebug: OptionalBooleanSchema.type,
        shouldSave: OptionalBooleanSchema.type,
      }
    );

    this.module = module;
    this.prefix = `[${prefix}]`;

    if (shouldDebug !== null && shouldDebug !== undefined) {
      this.shouldDebugVal = shouldDebug;
    }
    if (shouldSave !== null && shouldSave !== undefined) {
      this.shouldSaveVal = shouldSave;
    }

    console.info(
      `[${Constants.nameFlat}] registered a Debugger for the "${module}" module`
    );

    Debugger.debuggers.push(this);
  }

  /**
   * Logs at LOG level.
   * @param params
   */
  log(...params: Array<any>) {
    if (Debugger.SHOULD_DEBUG && this.shouldDebugVal) {
      console.log(`${this.prefix}>`, ...params);
    }

    if (Debugger.SHOULD_DEBUG && this.shouldSaveVal) {
      this.logStorage += Misc.argStringfy(...params);
    }
  }

  /**
   * Logs at INFO level.
   * @param params
   */
  info(...params: Array<any>) {
    if (Debugger.SHOULD_DEBUG && this.shouldDebugVal) {
      console.info(`${this.prefix}[INFO]`, ...params);
    }

    if (Debugger.SHOULD_DEBUG && this.shouldSaveVal) {
      this.logStorage += Misc.argStringfy(
        `[${Time.getNowFormatted()}][INFO]`,
        ...params
      );
    }
  }

  /**
   * Logs at WARN level.
   * @param params
   */
  warn(...params: Array<any>) {
    if (Debugger.SHOULD_DEBUG && this.shouldDebugVal) {
      console.warn(`${this.prefix}[WARN]`, ...params);
    }

    if (Debugger.SHOULD_DEBUG && this.shouldSaveVal) {
      this.logStorage += Misc.argStringfy(
        `[${Time.getNowFormatted()}][WARN]`,
        ...params
      );
    }
  }

  /**
   * Logs at ERROR level.
   * @param params
   */
  error(...params: Array<any>) {
    if (Debugger.SHOULD_DEBUG && this.shouldDebugVal) {
      console.error(`${this.prefix}[ERROR]`, ...params);
    }

    if (Debugger.SHOULD_DEBUG && this.shouldSaveVal) {
      this.logStorage += Misc.argStringfy(
        `[${Time.getNowFormatted()}][ERROR]`,
        ...params
      );
    }
  }

  /**
   * Dump the logs to a file.
   */
  async dump(): Promise<void> {
    if (
      game.permissions?.FILES_BROWSE.includes(game.user?.role ?? 0) &&
      game.permissions.FILES_UPLOAD.includes(game.user?.role ?? 0)
    ) {
      if (!(await FoundryFileSystem.ensure("./debugger"))) {
        console.error(
          `[${Constants.nameFlat}][ERROR] could not ensure debugger folder exists`
        );
      }

      if (
        !(await FoundryFileSystem.save(
          `${this.module}_log.json`,
          this.logStorage
        ))
      ) {
        console.error(
          `[${Constants.nameFlat}][ERROR] could not upload logs to server`
        );
      }
    } else {
      console.warn(
        `[${Constants.nameFlat}][WARN] current user lacks enough permission to dump log to server`
      );
    }

    saveDataToFile(this.logStorage, "application/json", `${this.module}.log`);
  }

  /**
   * Dump all logs.
   */
  static async dumpAll() {
    for (const debug of Debugger.debuggers) {
      await debug.dump();
    }
  }
}
