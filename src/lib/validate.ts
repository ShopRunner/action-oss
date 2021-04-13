import * as path from 'path';
import diff from 'cli-diff';

import { generateCodeOfConduct, generateLicense, getApprovedLicenseList } from './template';
import { readFileAsync } from './fs';

// Utils
// -------

async function readFileAsyncSafe (path: string) {
  try {
    return await readFileAsync(path);
  } catch (err) {
    // force to void
  }
}

// License
// -------

function getMatchedYear (file: string) {
  const fileMatch = file.match(/[0-9]{4}/);
  return fileMatch && fileMatch.length ? fileMatch[0] : undefined;
}

async function validateLicenseCopyright (file: string): Promise<{ valid: boolean, currentYear?: string }> {
  const fileYear = getMatchedYear(file);
  const valid = /Copyright \(c\) [0-9]{4} ShopRunner, Inc\./.test(file);
  return {
    valid,
    currentYear: fileYear
  };
}

async function validateLicenseAllowed (file: string): Promise<{ valid: boolean, license?: string }> {
  const licenseList = await getApprovedLicenseList();
  let valid = false;
  let license;

  for (let i = 0; i < licenseList.length; i++) {
    const lic = licenseList[i];
    const fileYear = getMatchedYear(file);

    // Exit if already valid
    if (valid) {
      break;
    }

    if (fileYear) {
      const templateFile = await generateLicense(fileYear, lic);
      valid = templateFile === file;

      // if valid we set as the license output
      if (valid) {
        license = lic;
      }
    }
  }

  return {
    valid,
    license
  };
}

export async function validateLicense (fileContents?: Buffer) {
  const parsedFileContents = fileContents ? fileContents.toString() : '';
  const resultAllowed = await validateLicenseAllowed(parsedFileContents);
  const resultCopyright = await validateLicenseCopyright(parsedFileContents);
  const errors: string[] = [];

  if (!parsedFileContents) {
    errors.push('Could not find the LICENSE file, must be one of "LICENSE" in the root directory');
  }

  if (parsedFileContents && !resultAllowed.valid) {
    errors.push('This is not a recognized license.');
  }

  if (parsedFileContents && !resultCopyright.valid) {
    errors.push('There is no valid Copy Right Year.');
  }

  return {
    ...resultAllowed,
    ...resultCopyright,
    valid: parsedFileContents && resultAllowed.valid && resultCopyright.valid,
    errors
  };
}

export async function validateLicenseFile (path: string) {
  const file = await readFileAsyncSafe(path);
  return await validateLicense(file);
}

// Docs
// -------

function getMatchedEmail (file: string) {
  const fileMatch = file.match(/[a-zA-Z-]+@shoprunner\.com/);
  return fileMatch && fileMatch.length ? fileMatch[0] : undefined;
}

export async function validateCodeOfConduct (file?: string) {
  const maintainerEmail: string = getMatchedEmail(file || '') as string;
  const templateFile = await generateCodeOfConduct(maintainerEmail);
  return {
    valid: file && file === templateFile,
    diff: file ? diff(file, templateFile) : null
  };
}

export async function validateDocFiles (rootPath: string) {
  const errors: string[] = [];
  const codeOfConduct = (await readFileAsyncSafe(path.join(rootPath, 'CODE-OF-CONDUCT.md')))?.toString();
  const codeOfConductResult = await validateCodeOfConduct(codeOfConduct);
  const contribValid = await readFileAsyncSafe(path.join(rootPath, 'CONTRIBUTING.md'));
  const prTemplateValid = await readFileAsyncSafe(path.join(rootPath, '.github/PULL_REQUEST_TEMPLATE.md'));
  const bugFixTemplateValid = await readFileAsyncSafe(path.join(rootPath, '.github', 'ISSUE_TEMPLATE', 'bug_report.md'));
  const featureTemplateValid = await readFileAsyncSafe(path.join(rootPath, '.github', 'ISSUE_TEMPLATE', 'feature_report.md'));

  if (!codeOfConductResult.valid) {
    if (codeOfConduct) {
      errors.push(`The CODE-OF-CONDUCT.md is invalid: ${codeOfConductResult.diff}`);
    } else {
      errors.push('The CODE-OF-CONDUCT.md is missing.');
    }
  }

  if (!contribValid) {
    errors.push('The CONTRIBUTING.md is invalid or missing.');
  }

  if (!prTemplateValid) {
    errors.push('The .github/PULL_REQUEST_TEMPLATE.md is invalid or missing.');
  }

  if (!bugFixTemplateValid) {
    errors.push('The .github/ISSUE_TEMPLATE/bug_report.md is invalid or missing.');
  }

  if (!featureTemplateValid) {
    errors.push('The .github/ISSUE_TEMPLATE/feature_report.md is invalid or missing.');
  }

  return {
    valid: codeOfConductResult.valid && contribValid && prTemplateValid && bugFixTemplateValid && featureTemplateValid,
    errors
  };
}
