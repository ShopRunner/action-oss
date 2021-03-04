export declare const getTemplatePath: (type: string) => string;
export declare function getApprovedLicenseList(): Promise<string[]>;
export declare function getApprovedLicenseListSync(): string[];
export declare function generateLicense(year: string, license: string): Promise<string>;
export declare function generateCodeOfConduct(maintainerEmail: string): Promise<string>;
