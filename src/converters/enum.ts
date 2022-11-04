import { DMMF } from "@prisma/generator-helper";
import { TEnum } from "../templates/enum";

export const genEnum = ({ name, values }: DMMF.DatamodelEnum): string => {
    const enumValues = values
        .map(({ name }) => `${name}="${name}"`)
        .join(",\n");

    return TEnum({ name, enumValues });
};
