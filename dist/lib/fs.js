"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDirAsync = exports.writeFileAsync = exports.readFileAsync = void 0;
const util = require("util");
const fs = require("fs");
exports.readFileAsync = util.promisify(fs.readFile);
exports.writeFileAsync = util.promisify(fs.writeFile);
exports.readDirAsync = util.promisify(fs.readdir);
