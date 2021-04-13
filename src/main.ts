import * as core from '@actions/core';

import './env';

import {validateDocFiles, validateLicenseFile} from './lib/validate';

async function run() {
  const licenseResults = await validateLicenseFile(`${process.cwd()}/LICENSE`);
  const docResults = await validateDocFiles(process.cwd());

  if (!licenseResults.valid || !docResults.valid) {
    core.setFailed(`Failed OSS Compliance Check
-------
${[...licenseResults.errors, ...docResults.errors].map((err) => `ERROR: ${err}`).join('\n\n')}
    `);
  }
}

run();
