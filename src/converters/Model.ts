import { DMMF } from "@prisma/generator-helper";
import { logger } from "@prisma/sdk";
import * as changeCase from "change-case";
import { DefaultPrismaFieldType } from "src/types";
import { FieldComponent } from "../components/Field";
import { IField } from "../interfaces/IField";
import commentdisclaimer from "../templates/commentdisclamer";
import { importGenerator } from "../templates/index";

export type NameCases = {
    camel: string;
    snake: string;
    pascal: string;
    caps: string;
    title: string;
};
export class ModelConverter {
    name: string;
    pk: string;
    _rawModel: DMMF.Model;
    uniqueFields: string[];
    requiredFields: string[];
    readonlyFields: string[] = ["createdAt", "updatedAt"];
    _enums: string[] = [];
    _relations: string[] = [];
    _fields: FieldComponent[];
    fieldString = "";
    enumString = "";
    relationString = "";
    defaultImports = "";
    disclaimer = `${commentdisclaimer}\n\n\n`;
    importString?: string;
    nameValues: NameCases;
    relationFields: string[] = [];

    constructor(options: DMMF.Model) {
        this.name = options.name;
        this.nameValues = ModelConverter.nameCases(this.name);
        this._rawModel = options;
        this.genDefaultImportsString();
        this._fields = this.mapFields(options.fields);
        logger.info(`fields ${JSON.stringify(this._fields)}`);
        const tempPk = this._fields.filter((a) => a.pk);
        // make all relate from fields options
        for (let i = 0; i < this._fields.length; i++) {
            if (this.relationFields.includes(this._fields[i].name)) {
                this._fields[i].required = false;
            }
        }
        this._fields.forEach((f) => {
            this.fieldString += f.fieldToStringTemplate();
        });

        this.genEnumString();
        this.genRelationString();

        this.pk = tempPk[0].name;
        this.uniqueFields = [this.pk];
        this.requiredFields = [this.pk];
    }
    genEnumString(): void {
        let eString = "";
        this._enums.forEach(
            (e) => (eString += `import {${e}} from "../enums/${e}";\n`)
        );
        this.enumString = eString;
    }
    genRelationString(): void {
        let rString = "";
        this._relations.forEach(
            (e) => (rString += `import {${e}} from "./${e}";\n`)
        );
        this.relationString = rString;
        logger.info("relation string", this.relationString);
    }
    genDefaultImportsString(): void {
        let iString = "";
        const defaultImports = [
            { NAME: `{ApiProperty}`, MODULE: `'@nestjs/swagger'` },
            { NAME: `{IsEmail}`, MODULE: `'class-validator'` }
        ];
        defaultImports.forEach(
            (d) => (iString += `${importGenerator(d.NAME, d.MODULE)};\n`)
        );
        this.defaultImports = iString;
    }
    async genModel(): Promise<string> {
        return `${this.disclaimer}\n\n\n
        ${this.defaultImports}
        ${this.relationString};
        ${this.enumString};
        export class ${this.name} {${this.fieldString}}`;
    }

    static nameCases(opts: string): NameCases {
        return {
            camel: changeCase.camelCase(opts),
            snake: changeCase.snakeCase(opts),
            pascal: changeCase.pascalCase(opts),
            caps: changeCase.constantCase(opts),
            title: changeCase.capitalCase(opts, { delimiter: "" })
        };
    }

    toComponents(options: IField[]): FieldComponent[] {
        return options.map((f) => {
            const temp = new FieldComponent(f);
            this._enums.push(...temp._enums);
            this._relations.push(...temp._relations);
            if (temp.relationDetail)
                this.relationFields.push(
                    ...temp.relationDetail.relationFromFields
                );
            // this.fieldString += `${temp.fieldToStringTemplate()}\n`;
            return temp;
        });
    }

    mapFields(options: DMMF.Field[]): FieldComponent[] {
        const fields: IField[] = options.map((f): IField => {
            logger.info(` raw filed : ${JSON.stringify(f)}`);
            return {
                name: f.name,
                type: f.type as DefaultPrismaFieldType,
                pk: f.isId === false ? false : true,
                kind: f.kind,
                unique: f.isUnique === false ? false : true,
                required: f.isRequired === false ? false : true,
                readonly: f.isReadOnly === false ? false : true,
                decorations: f.documentation || "",
                ...(f.kind === "object" &&
                    f.relationFromFields &&
                    f.relationName &&
                    f.relationToFields && {
                        relation: {
                            relationFromFields: f.relationFromFields,
                            relationName: f.relationName,
                            relationToFields: f.relationToFields,
                            isMandatory: false
                        }
                    }),
                ...(f.relationFromFields && {
                    relationFromFields: f.relationFromFields
                })
            };
        });
        return this.toComponents(fields);
    }
}
