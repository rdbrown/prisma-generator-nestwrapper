import { DMMF } from "@prisma/generator-helper";
import { DefaultPrismaFieldType } from "../types";
export interface IField {
    name: string;
    pk?: boolean;
    unique?: boolean;
    kind?: DMMF.FieldKind;
    type: DefaultPrismaFieldType;
    required?: boolean;
    readonly?: boolean;
    decorations?: string;
}
