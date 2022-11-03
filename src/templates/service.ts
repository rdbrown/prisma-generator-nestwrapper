export const TService = (options: {
    header: string;
    imports: string;
    name: string;
    body: string;
}) => {
    return `${options.header}\n\n\n
    ${options.imports}\n
    @Injectable()
    export class ${options.name}ServiceBase {\n
        ${options.body}
    }`;
};
