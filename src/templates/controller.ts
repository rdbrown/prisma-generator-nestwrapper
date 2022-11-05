import { NameCases } from "../converters/Model";

export const TController = (options: {
    header: string;
    imports: string;
    name: NameCases;
    body: string;
}): string => {
    return `
    import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import {${options.name.title}ServiceBase} from './${options.name.camel}ServiceBase'
    ${options.header}\n\n\n
${options.imports}\n
export class ${options.name.title}ControllerBase {\n
    constructor(private _service: ${options.name.title}Service) {}\n
    ${options.body}
}`;
};
