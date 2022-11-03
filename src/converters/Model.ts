import { DMMF } from "@prisma/generator-helper";
import { logger } from "@prisma/internals";
import { IField } from "../interfaces/IField";
export const genModel = async (options: DMMF.Model) => {
    logger.info(JSON.stringify(options));

    const fields: IField[] = options.fields.map((f): IField => {
        return { name, type };
    });
    return JSON.stringify(options);
};
