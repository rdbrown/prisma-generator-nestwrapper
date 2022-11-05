/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DMMF } from "@prisma/generator-helper";
import { logger } from "@prisma/sdk";
import { IField, IRelation } from "../interfaces/IField";
import { fieldGeneratorGeneral } from "../templates/index";
import { DefaultPrismaFieldType } from "../types";
type InOut = {
    input: string;
    output: string[];
};
export class FieldComponent {
    name: string;
    pk = false;
    unique = false;
    kind: DMMF.FieldKind = "scalar";
    type: DefaultPrismaFieldType;
    required = false;
    readonly = false;
    _decorations = "";
    docs: string[] = [];
    stringedDecorations = `@ApiProperty()`;
    _enums: string[] = [];
    _relations: string[] = [];
    tsType?: string;
    relationDetail?: IRelation;

    constructor(options: IField) {
        this.name = options.name;
        if (options.relation) {
            this.relationDetail = options.relation;
        }
        if (options.kind) {
            this.kind = options.kind;
        }
        this.type = options.type;
        if (options.pk) {
            this.pk = options.pk;
        }
        if (options.unique) {
            this.unique = options.unique;
        }
        if (options.required) {
            this.required = options.required;
        }
        if (options.readonly) {
            this.readonly = options.readonly;
        }
        if (options.decorations) {
            this._decorations = options.decorations;
        }
        //this.decorations = `@ApiProperty()`;
        this.generateDecorators();
        this.mapFieldType();
    }

    mapFieldType(): void {
        //@ts-ignore
        this.tsType = FieldComponent.MappedTypes[this.type];

        if (!this.tsType) {
            this.unMappedTypes();
            this.tsType = this.type;
        }
    }

    private unMappedTypes(): void {
        // check if enum
        if (this.type.startsWith("Enum")) {
            this._enums.push(`${this.type}`);
        } else {
            this._relations.push(`${this.type}`);
        }
    }

    fieldToStringTemplate(): string {
        if (this.relationDetail) {
            this.required = this.relationDetail.isMandatory ? true : false;
        }
        logger.info(`check decorations: ${this.stringedDecorations}`);
        const _name = this.required ? this.name : this.name + "?";
        return fieldGeneratorGeneral(
            `${_name}`,
            this.tsType,
            this.stringedDecorations
        );
    }

    static MappedTypes = {
        String: "string",
        Int: "number",
        DateTime: "Date",
        Boolean: "boolean"
    };

    static MappedDecorators: InOut[] = [
        { input: "B$Email", output: ["@IsEmail()"] },
        { input: "B$Exclude", output: ["@Exclude()"] }
    ];

    generateDecorators(): void {
        const ugly = this._decorations.split("\n");
        logger.log(`ugly: ${ugly}`);

        ugly.forEach((u) => {
            const decResult = FieldComponent.MappedDecorators.find(
                (x: InOut) => x.input === u
            );
            logger.log(`x: ${decResult}`);

            if (decResult) {
                this.docs.push(...decResult.output);
                const s = decResult.output;
                this.stringedDecorations += s;
            }
        });

        if (!this.required) this.docs.push("@IsOptional()");
        else this.docs.push("@IsNotEmpty()");

        if (this._enums.length > 0) this.docs.push("@IsEnum()");

        this.prismaToDecorate();

        this.stringedDecorations += this.docs.join(" ");
    }

    prismaToDecorate(): void {
        switch (this.type) {
            case "DateTime":
                this.docs.push("@IsDate()");
                break;
            case "String":
                this.docs.push("@IsString()");
                break;
            case "Boolean":
                this.docs.push("@IsBoolean()");
                break;
            case "BigInt":
                this.docs.push("@IsInt()");
                break;
        }
    }
}
