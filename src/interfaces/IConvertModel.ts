import { DMMF } from "@prisma/generator-helper";

export interface IConvertModelInput {
    model: DMMF.Model;
    extractRelationFields?: boolean;
    postfix?: string;
    useGraphQL?: boolean;
}
