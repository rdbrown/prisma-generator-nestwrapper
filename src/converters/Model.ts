import { DMMF } from "@prisma/generator-helper";
import { logger } from "@prisma/sdk";
import { importGenerator } from "@templates/index";
import { DefaultPrismaFieldType } from "src/types";
import { FieldComponent } from "../components/Field";
import { IField } from "../interfaces/IField";
import commentdisclaimer from "../templates/commentdisclamer";
export class Model {
    name: string;
    pk: string;
    uniqueFields: string[];
    requiredFields: string[];
    readonlyFields: string[] = ["createdAt", "updatedAt"];
    _enums: string[] = [];
    _relations: string[] = [];
    _fields: FieldComponent[];
    fieldString: string = "";
    enumString: string = "";
    relationString: string = "";
    defaultImports: string = "";

    constructor(options: DMMF.Model) {
        this.name = options.name;
        this.genDefaultImportsString();
        const fields: IField[] = options.fields.map((f): IField => {
            return {
                name: f.name,
                type: f.type as DefaultPrismaFieldType,
                pk: f.isId,
                kind: f.kind,
                unique: f.isUnique,
                required: f.isRequired,
                readonly: f.isReadOnly,
                decorations: f.documentation || ""
            };
        });

        this._fields = fields.map((f) => {
            const temp = new FieldComponent(f);
            this._enums.push(...temp._enums);
            this._relations.push(...temp._relations);
            this.fieldString += `${temp.fieldToStringTemplate()}\n`;
            return temp;
        });
        const tempPk = this._fields.filter((a) => a.pk);

        this.genEnumString();
        this.genRelationString();

        this.pk = tempPk[0].name;
        this.uniqueFields = [this.pk];
        this.requiredFields = [this.pk];
    }
    genEnumString() {
        let eString = "";
        this._enums.forEach(
            (e) => (eString += `import {${e}} from "../enums/${e}";\n`)
        );
        this.enumString = eString;
    }
    genRelationString() {
        let rString = "";
        this._relations.forEach(
            (e) => (rString += `import {${e}} from "./${e}";\n`)
        );
        this.relationString = rString;
        logger.info("relation string", this.relationString);
    }
    genDefaultImportsString() {
        let iString = "";
        const defaultImports = [
            { NAME: `{ApiProperty}`, MODULE: `'@nestjs/swagger'` }
        ];
        defaultImports.forEach(
            (d) => (iString += importGenerator(d.NAME, d.MODULE))
        );
        this.defaultImports = iString;
    }
    async genModel() {
        return `${commentdisclaimer}\n\n\n
        ${this.relationString};
        ${this.enumString};
        export class ${this.name} {${this.fieldString}}`;
    }
}
export const genModel = async (options: DMMF.Model) => {
    // logger.info("genModel" + JSON.stringify(options));
    let _enums = [];
    let _imports = [];

    const fields: IField[] = options.fields.map((f): IField => {
        return {
            name: f.name,
            type: f.type as DefaultPrismaFieldType,
            pk: f.isId,
            kind: f.kind,
            unique: f.isUnique,
            required: f.isRequired,
            readonly: f.isReadOnly,
            decorations: f.documentation || ""
        };
    });
    logger.info("genModel" + JSON.stringify(fields));
    let fieldString = "";
    fields.forEach((f) => {
        const fieldC = new FieldComponent(f);
        _enums.push(...fieldC._enums);
        _imports.push(...fieldC._relations);
        fieldString += `${fieldC.fieldToStringTemplate()}\n`;
    });
    return `export class ${options.name} {${fieldString}}`;
};
