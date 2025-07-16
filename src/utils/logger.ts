export const logger = {
  info: (msg: string, ...args: any[]) => {
    console.log(`\x1b[32m[INFO]\x1b[0m ${msg}`, ...args);
  },
  warn: (msg: string, ...args: any[]) => {
    console.warn(`\x1b[33m[WARN]\x1b[0m ${msg}`, ...args);
  },
  error: (msg: string, ...args: any[]) => {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`, ...args);
  }
}; 