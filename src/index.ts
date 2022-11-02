/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { genEnum } from "./converters/enum";
import { generatorHandler, GeneratorOptions } from "@prisma/generator-helper";
import { logger } from "@prisma/sdk";
import path from "path";
import { GENERATOR_NAME } from "./constants";
import { writeFileSafely } from "./utils/writeFileSafely";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../package.json");

generatorHandler({
    onManifest() {
        logger.info(`${GENERATOR_NAME}:Registered`);
        return {
            version,
            defaultOutput: "../generated",
            prettyName: GENERATOR_NAME,
            requiresGenerators: ["prisma-client-js"]
        };
    },
    onGenerate: async (options: GeneratorOptions) => {
        options.dmmf.datamodel.enums.forEach(async (enumInfo) => {
            const tsEnum = genEnum(enumInfo);

            const writeLocation = path.join(
                options.generator.output?.value!,
                `${enumInfo.name}.ts`
            );

            await writeFileSafely(writeLocation, tsEnum);
        });
    }
});
