"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
require("./env");
const validate_1 = require("./lib/validate");
async function run() {
    const licenseResults = await validate_1.validateLicenseFile(`${process.cwd()}/LICENSE`);
    const docResults = await validate_1.validateDocFiles(process.cwd());
    if (!licenseResults.valid || !docResults.valid) {
        core.setFailed(`Failed OSS Compliance Check
    
Errors
-------
${[...licenseResults.errors, ...docResults.errors].join('\n')}
    `);
    }
}
run();
