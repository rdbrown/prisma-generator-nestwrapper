/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DMMF } from "@prisma/generator-helper";
import { IField } from "../interfaces/IField";
import { fieldGeneratorGeneral } from "../templates/index";
import { DefaultPrismaFieldType } from "../types";
export class FieldComponent {
    name: string;
    pk = false;
    unique = false;
    kind: DMMF.FieldKind = "scalar";
    type: DefaultPrismaFieldType;
    required = false;
    readonly = false;
    decorations = "";
    _decorations = `@ApiProperty();\n`;
    _enums: string[] = [];
    _relations: string[] = [];
    tsType?: string;

    constructor(options: IField) {
        this.name = options.name;
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
            this.decorations = options.decorations;
        }
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
        return fieldGeneratorGeneral(this.name, this.tsType, this.decorations);
    }

    static MappedTypes = {
        String: "string",
        Int: "number",
        DateTime: "Date",
        Boolean: "boolean"
    };

    static MappedDecorators = {
        B$Email: "@IsEmail()"
    };
}
