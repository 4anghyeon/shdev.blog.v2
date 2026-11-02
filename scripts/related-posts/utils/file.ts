import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const writeTextFile = async (filePath: string, content: string) => {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
};

export const sortKeys = <T>(record: Record<string, T>): Record<string, T> => {
  return Object.fromEntries(
    Object.entries(record).sort(([a], [b]) => a.localeCompare(b)),
  );
};
