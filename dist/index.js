require('./sourcemap-register.js');module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 761:
/***/ (() => {


// We force set here for use in modules
process.env.ROOT_PATH = __dirname;


/***/ }),

/***/ 795:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readDirAsync = exports.writeFileAsync = exports.readFileAsync = void 0;
const util = __nccwpck_require__(669);
const fs = __nccwpck_require__(747);
exports.readFileAsync = util.promisify(fs.readFile);
exports.writeFileAsync = util.promisify(fs.writeFile);
exports.readDirAsync = util.promisify(fs.readdir);


/***/ }),

/***/ 438:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.generateCodeOfConduct = exports.generateLicense = exports.getApprovedLicenseListSync = exports.getApprovedLicenseList = exports.getTemplatePath = void 0;
const fs_1 = __nccwpck_require__(747);
const path = __nccwpck_require__(622);
const fs_2 = __nccwpck_require__(795);
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


/***/ }),

/***/ 751:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateDocFiles = exports.validateCodeOfConduct = exports.validateLicenseFile = exports.validateLicense = void 0;
const path = __nccwpck_require__(622);
const template_1 = __nccwpck_require__(438);
const fs_1 = __nccwpck_require__(795);
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
        valid: file && file === templateFile
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
        errors.push('The CODE-OF-CONDUCT.md is invalid or missing.');
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


/***/ }),

/***/ 496:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __nccwpck_require__(186);
__nccwpck_require__(761);
const validate_1 = __nccwpck_require__(751);
async function run() {
    const licenseResults = await validate_1.validateLicenseFile(`${process.cwd()}/LICENSE`);
    const docResults = await validate_1.validateDocFiles(process.cwd());
    if (!licenseResults.valid || !docResults.valid) {
        core.setFailed([...licenseResults.errors, ...docResults.errors].join(', '));
    }
}
run();


/***/ }),

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(278);
const os = __importStar(__nccwpck_require__(87));
const path = __importStar(__nccwpck_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(747));
const os = __importStar(__nccwpck_require__(87));
const utils_1 = __nccwpck_require__(278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, exports) => {


// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 747:
/***/ ((module) => {

module.exports = require("fs");;

/***/ }),

/***/ 87:
/***/ ((module) => {

module.exports = require("os");;

/***/ }),

/***/ 622:
/***/ ((module) => {

module.exports = require("path");;

/***/ }),

/***/ 669:
/***/ ((module) => {

module.exports = require("util");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(496);
/******/ })()
;
//# sourceMappingURL=index.js.map