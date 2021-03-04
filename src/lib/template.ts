import { readdirSync } from 'fs';
import * as path from 'path';

import { readDirAsync, readFileAsync } from './fs';

export const getTemplatePath = (type: string) => path.join(process.env.ROOT_PATH as string, 'templates', type);

export async function getApprovedLicenseList (): Promise<string[]> {
  return await readDirAsync(getTemplatePath('licenses'));
}

export function getApprovedLicenseListSync (): string[] {
  return readdirSync(getTemplatePath('licenses'));
}

export async function generateLicense (year: string, license: string) {
  const fileContents = await readFileAsync(path.join(getTemplatePath('licenses'), license));
  return fileContents.toString().replace('{{YEAR}}', year);
}

export async function generateCodeOfConduct (maintainerEmail: string) {
  const fileContents = await readFileAsync(path.join(getTemplatePath('docs'), 'CODE-OF-CONDUCT.md'));
  return fileContents.toString().replace(/{{MAINTAINER_EMAIL}}/g, maintainerEmail);
}
