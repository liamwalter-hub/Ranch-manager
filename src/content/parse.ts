import { parse } from 'yaml';
import { packSchema, type Pack } from './schema';

/** Parses and checks a pack. Throws a readable error if the file is wrong. */
export function parsePack(yamlText: string, fileName = 'pack.yaml'): Pack {
  const result = packSchema.safeParse(parse(yamlText));
  if (!result.success) {
    const problems = result.error.issues.map(i => `  - ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
    throw new Error(`Content file ${fileName} has problems:\n${problems}`);
  }
  return result.data;
}
