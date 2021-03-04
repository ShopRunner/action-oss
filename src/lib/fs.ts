import * as util from 'util';
import * as fs from 'fs';

export const readFileAsync = util.promisify(fs.readFile);
export const writeFileAsync = util.promisify(fs.writeFile);
export const readDirAsync = util.promisify(fs.readdir);
