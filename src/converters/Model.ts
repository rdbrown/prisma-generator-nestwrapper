import { DMMF } from "@prisma/generator-helper";
import { logger } from "@prisma/sdk";
import * as changeCase from "change-case";
import { FieldComponent } from "../components/Field";
import { IField } from "../interfaces/IField";
import commentdisclaimer from "../templates/commentdisclamer";
import { importGenerator } from "../templates/index";
import {
    ClassTransformers,
    ClassValidators,
    DefaultPrismaFieldType
} from "../types";
import { convertBool } from "../utils/utils";

type ClassValType = typeof ClassValidators[number];
type ClassTransformType = typeof ClassTransformers[number];

export type NameCases = {
    camel: string;
    snake: string;
    pascal: string;
    caps: string;
    title: string;
};

export interface IImport {
    NAME: string;
    MODULE: string;
}
export class ModelConverter {
    name: string;
    pk: string;
    _rawModel: DMMF.Model;
    docs: string[] = [];
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
    _imports: IImport[] = [
        { NAME: `{ApiProperty}`, MODULE: `'@nestjs/swagger'` }
    ];
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
        // make all relate from fields optional
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
        //  logger.info("relation string", this.relationString);
    }
    genDefaultImportsString(): void {
        let iString = "";

        this._imports.forEach(
            (d) => (iString += `${importGenerator(d.NAME, d.MODULE)};\n`)
        );
        this.importString = iString;
    }
    genModel(): string {
        const allDecorators = this._fields.flatMap((f) => f.docs);
        //    logger.info(`all decorators ${JSON.stringify(allDecorators)}`);
        const uniqueDecorators = allDecorators.reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (acc: any[], cur: any) => {
                if (!acc.includes(cur)) {
                    acc.push(cur);
                }
                return acc;
            },
            []
        );
        this.docs = uniqueDecorators.map((x) =>
            x.replace("@", "").replace("()", "")
        );
        this.classValImports();
        this.classTransformImports();
        this.genDefaultImportsString();

        return `${this.disclaimer}\n\n\n
        ${this.importString}
        ${this.relationString};
        ${this.enumString};
        export class ${this.name} {${this.fieldString}}`;
    }

    classValImports(): void {
        const classValues = this.docs.map((d) => {
            if (this.isClassVal(d)) {
                return d;
            }
        });
        if (classValues.length > 0)
            this._imports.push({
                MODULE: `'class-validator'`,
                NAME: `{${classValues.join(",").replace(",,", ",")}}`
            });
    }

    private isClassVal = (classValKey: string): classValKey is ClassValType =>
        ClassValidators.includes(classValKey as ClassValType);

    classTransformImports(): void {
        let classTransformers = this.docs.map((d) => {
            logger.log(`check transformers ${JSON.stringify(d)}`);
            if (this.isClassTransform(d) && this.isClassTransform(d) !== null) {
                logger.log(`is transformer ${this.isClassTransform(d)}`);
                return d;
            } else return "";
        });
        logger.log(
            `check all transformers ${JSON.stringify(classTransformers)}`
        );
        classTransformers = classTransformers.filter((x) => x !== "");
        if (classTransformers.length > 0) {
            logger.log(
                `write transformers ${JSON.stringify(classTransformers)}`
            );
            this._imports.push({
                NAME: `{${classTransformers.join(",").replace(",,", ",")}}`,
                MODULE: `'class-transformer'`
            });
        }
    }

    private isClassTransform = (
        classTransformKey: string
    ): classTransformKey is ClassTransformType =>
        ClassTransformers.includes(classTransformKey as ClassTransformType);

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
            return {
                name: f.name,
                type: f.type as DefaultPrismaFieldType,
                pk: convertBool(f.isId),
                kind: f.kind,
                unique: convertBool(f.isUnique),
                required: convertBool(f.isRequired),
                readonly: convertBool(f.isReadOnly),
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
