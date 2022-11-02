import { DMMF } from "@prisma/generator-helper";
import { logger } from "@prisma/internals";

export const genModel = async (options: DMMF.Model) => {
    logger.info(JSON.stringify(options));
    return JSON.stringify(options);
};
