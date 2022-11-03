import { DefaultPrismaFieldType } from "../types";
export interface IField {
    name: string;
    pk: boolean;
    unique: boolean;
    kind: "scalar" | "object";
    type: DefaultPrismaFieldType;
    required: boolean;
    readonly: boolean;
    decorations: string;
}
