export function format(moduleId: string, stringId: string, data?: Record<string, string>): string {
  // @ts-ignore
  return game.i18n?.format(`${moduleId}.${stringId}`, data) ?? "";
}

export function localize(moduleId: string, stringId: string): string {
  // @ts-ignore
  return game.i18n?.localize(`${moduleId}.${stringId}`) ?? "";
}
