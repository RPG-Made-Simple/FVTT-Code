/**
 * Returns the current time formatted.
 * @returns string in `HH:MM:SS` format.
 */
export function getNowFormatted() {
  const now = new Date();
  const time = now.toTimeString().slice(0, 8);
  const milliseconds = now.getMilliseconds();

  return `${time}.${milliseconds.toString().padStart(3, '0')}`;
}
