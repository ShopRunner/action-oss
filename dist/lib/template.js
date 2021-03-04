"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCodeOfConduct = exports.generateLicense = exports.getApprovedLicenseListSync = exports.getApprovedLicenseList = exports.getTemplatePath = void 0;
const fs_1 = require("fs");
const path = require("path");
const fs_2 = require("./fs");
const getTemplatePath = (type) => path.join(process.env.ROOT_PATH, 'templates', type);
exports.getTemplatePath = getTemplatePath;
async function getApprovedLicenseList() {
    return await fs_2.readDirAsync(exports.getTemplatePath('licenses'));
}
exports.getApprovedLicenseList = getApprovedLicenseList;
function getApprovedLicenseListSync() {
    return fs_1.readdirSync(exports.getTemplatePath('licenses'));
}
exports.getApprovedLicenseListSync = getApprovedLicenseListSync;
async function generateLicense(year, license) {
    const fileContents = await fs_2.readFileAsync(path.join(exports.getTemplatePath('licenses'), license));
    return fileContents.toString().replace('{{YEAR}}', year);
}
exports.generateLicense = generateLicense;
async function generateCodeOfConduct(maintainerEmail) {
    const fileContents = await fs_2.readFileAsync(path.join(exports.getTemplatePath('docs'), 'CODE-OF-CONDUCT.md'));
    return fileContents.toString().replace(/{{MAINTAINER_EMAIL}}/g, maintainerEmail);
}
exports.generateCodeOfConduct = generateCodeOfConduct;
