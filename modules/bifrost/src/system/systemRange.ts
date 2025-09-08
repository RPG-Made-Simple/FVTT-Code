export enum SystemRangeUnit {
  FOOT = "foot",
  METER = "meter",
}

export interface SystemRange {
  unit: SystemRangeUnit,
  value: number,
}
