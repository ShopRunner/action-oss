/// <reference types="node" />
export declare function validateLicense(fileContents?: Buffer): Promise<{
    valid: boolean | "";
    errors: string[];
    currentYear?: string | undefined;
    license?: string | undefined;
}>;
export declare function validateLicenseFile(path: string): Promise<{
    valid: boolean | "";
    errors: string[];
    currentYear?: string | undefined;
    license?: string | undefined;
}>;
export declare function validateCodeOfConduct(file?: string): Promise<{
    valid: boolean | "" | undefined;
    diff: string | null;
}>;
export declare function validateDocFiles(rootPath: string): Promise<{
    valid: false | "" | Buffer | undefined;
    errors: string[];
}>;
