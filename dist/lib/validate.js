"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDocFiles = exports.validateCodeOfConduct = exports.validateLicenseFile = exports.validateLicense = void 0;
const path = require("path");
const cli_diff_1 = require("cli-diff");
const template_1 = require("./template");
const fs_1 = require("./fs");
// Utils
// -------
async function readFileAsyncSafe(path) {
    try {
        return await fs_1.readFileAsync(path);
    }
    catch (err) {
        // force to void
    }
}
// License
// -------
function getMatchedYear(file) {
    const fileMatch = file.match(/[0-9]{4}/);
    return fileMatch && fileMatch.length ? fileMatch[0] : undefined;
}
async function validateLicenseCopyright(file) {
    const fileYear = getMatchedYear(file);
    const valid = /Copyright \(c\) [0-9]{4} ShopRunner, Inc\./.test(file);
    return {
        valid,
        currentYear: fileYear
    };
}
async function validateLicenseAllowed(file) {
    const licenseList = await template_1.getApprovedLicenseList();
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
            const templateFile = await template_1.generateLicense(fileYear, lic);
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
async function validateLicense(fileContents) {
    const parsedFileContents = fileContents ? fileContents.toString() : '';
    const resultAllowed = await validateLicenseAllowed(parsedFileContents);
    const resultCopyright = await validateLicenseCopyright(parsedFileContents);
    const errors = [];
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
exports.validateLicense = validateLicense;
async function validateLicenseFile(path) {
    const file = await readFileAsyncSafe(path);
    return await validateLicense(file);
}
exports.validateLicenseFile = validateLicenseFile;
// Docs
// -------
function getMatchedEmail(file) {
    const fileMatch = file.match(/[a-zA-Z-]+@shoprunner\.com/);
    return fileMatch && fileMatch.length ? fileMatch[0] : undefined;
}
async function validateCodeOfConduct(file) {
    const maintainerEmail = getMatchedEmail(file || '');
    const templateFile = await template_1.generateCodeOfConduct(maintainerEmail);
    return {
        valid: file && file === templateFile,
        diff: file ? cli_diff_1.default(file, templateFile) : null
    };
}
exports.validateCodeOfConduct = validateCodeOfConduct;
async function validateDocFiles(rootPath) {
    var _a;
    const errors = [];
    const codeOfConduct = (_a = (await readFileAsyncSafe(path.join(rootPath, 'CODE-OF-CONDUCT.md')))) === null || _a === void 0 ? void 0 : _a.toString();
    const codeOfConductResult = await validateCodeOfConduct(codeOfConduct);
    const contribValid = await readFileAsyncSafe(path.join(rootPath, 'CONTRIBUTING.md'));
    const prTemplateValid = await readFileAsyncSafe(path.join(rootPath, '.github/PULL_REQUEST_TEMPLATE.md'));
    const bugFixTemplateValid = await readFileAsyncSafe(path.join(rootPath, '.github', 'ISSUE_TEMPLATE', 'bug_report.md'));
    const featureTemplateValid = await readFileAsyncSafe(path.join(rootPath, '.github', 'ISSUE_TEMPLATE', 'feature_report.md'));
    if (!codeOfConductResult.valid) {
        if (codeOfConduct) {
            errors.push(`The CODE-OF-CONDUCT.md is invalid: \n ${codeOfConductResult.diff}`);
        }
        else {
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
exports.validateDocFiles = validateDocFiles;
