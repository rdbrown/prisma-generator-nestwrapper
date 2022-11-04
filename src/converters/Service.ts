import { DMMF } from "@prisma/generator-helper";
import { importGenerator } from "../templates";
import { TService, TServiceCrud } from "../templates/service";
import { ModelConverter } from "./Model";
export class ServiceConverter extends ModelConverter {
    constructor(options: DMMF.Model) {
        super(options);
        this.serviceDefaultImports();
    }

    serviceDefaultImports(): void {
        let iString = "";
        const defaultImports = [
            { NAME: `{Injectable}`, MODULE: `'@nestjs/common'` },
            {
                NAME: `{Prisma,${this.nameValues.title}}`,
                MODULE: `"@prisma/client"`
            },
            {
                NAME: `{PrismaService}`,
                MODULE: `'nestjs-prisma'`
            }
            // {
            //     NAME: `{${this.nameValues.title}}`,
            //     MODULE: `'../models/${this.nameValues.title}'`
            // }
        ];
        defaultImports.forEach(
            (d) => (iString += `${importGenerator(d.NAME, d.MODULE)}\n`)
        );
        this.defaultImports = iString;
    }

    async genService(): Promise<string> {
        return TService({
            header: this.disclaimer,
            imports: this.defaultImports,
            name: this.nameValues,
            body: TServiceCrud(this.nameValues)
        });
    }
}
