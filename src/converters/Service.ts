import { DMMF } from "@prisma/generator-helper";
import { importGenerator } from "../templates";
import { TService } from "../templates/service";
import { ModelConverter } from "./Model";
export class ServiceConverter extends ModelConverter {
    constructor(options: DMMF.Model) {
        super(options);
        this.serviceDefaultImports();
    }

    serviceDefaultImports() {
        let iString = "";
        const defaultImports = [
            { NAME: `{Injectable}`, MODULE: `'@nestjs/common'` },
            { NAME: `{Prisma}`, MODULE: `"@prisma/client"` },
            { NAME: `{PrismaService}`, MODULE: `'nestjs-prisma'` }
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
            name: this.name,
            body: ""
        });
    }
}
