import { GeneratorOptions } from "@prisma/generator-helper";
import { logger, parseEnvValue } from "@prisma/sdk";
import * as changeCase from "change-case";
import path from "path";
import { Options, resolveConfig } from "prettier";
import { ModelConverter, ServiceConverter } from "./converters";
import { genEnum } from "./converters/enum";
import { GeneratorPathNotExists } from "./error-handler";
import { writeFileSafely } from "./utils/writeFileSafely";
// eslint-disable-next-line @typescript-eslint/no-var-requires
//const { version } = require("../package.json");

export const PrismaNestBaseGeneratorOptions = {
    makeIndexFile: {
        desc: "make index file",
        defaultValue: true
    },
    dryRun: {
        desc: "dry run",
        defaultValue: true
    },
    separateRelationFields: {
        desc: "separate relation fields",
        defaultValue: false
    },
    useSwagger: {
        desc: "use swagger decorator",
        defaultValue: true
    },
    output: {
        desc: "output path",
        defaultValue: "./base"
    }
} as const;

export type PrismaNestBaseGeneratorOptionsKeys =
    keyof typeof PrismaNestBaseGeneratorOptions;
export type PrismaNestBaseGeneratorConfig = Partial<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<PrismaNestBaseGeneratorOptionsKeys, any>
>;

export class PrismaGenerator {
    static instance: PrismaGenerator;
    _options: GeneratorOptions;
    _prettierOptions: Options;
    rootPath!: string;
    clientPath!: string;

    constructor(options: GeneratorOptions) {
        // if (options) {
        //     this._options = options;
        // }
        this._options = options;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const output = parseEnvValue(this._options.generator.output!);
        this._prettierOptions =
            resolveConfig.sync(output, { useCache: false }) ||
            (resolveConfig.sync(process.cwd()) as Options);
    }

    static getInstance(options: GeneratorOptions): PrismaGenerator {
        if (PrismaGenerator.instance) {
            return PrismaGenerator.instance;
        }
        PrismaGenerator.instance = new PrismaGenerator(options);
        return PrismaGenerator.instance;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public get options() {
        return this._options;
    }

    public set options(value) {
        this._options = value;
    }

    public get prettierOptions(): Options {
        return this._prettierOptions;
    }

    public set prettierOptions(value) {
        this._prettierOptions = value;
    }

    getClientImportPath(): string {
        if (!this.rootPath || !this.clientPath) {
            throw new GeneratorPathNotExists();
        }
        return path
            .relative(this.rootPath, this.clientPath)
            .replace("node_modules/", "");
    }

    setPrismaClientPath(): void {
        const { otherGenerators, schemaPath } = this.options;

        this.rootPath = schemaPath.replace("/prisma/schema.prisma", "");
        const defaultPath = path.resolve(
            this.rootPath,
            "node_modules/@prisma/client"
        );
        const clientGenerator = otherGenerators.find(
            (g) => g.provider.value === "prisma-client-js"
        );

        this.clientPath = clientGenerator?.output?.value ?? defaultPath;
    }

    writeEnums = async (): Promise<void> => {
        this._options.dmmf.datamodel.enums.forEach(async (enumInfo) => {
            const tsEnum = genEnum(enumInfo);

            const writeLocation = path.join(
                this._options.generator.output?.value || "",
                `enums`,
                `${enumInfo.name}.ts`
            );

            await writeFileSafely(writeLocation, tsEnum);
        });
    };

    writeModels = async (): Promise<void> => {
        let models = "";
        const writeLocation = path.join(
            this._options.generator.output?.value || "",
            `models/`
        );
        for await (const modelInfo of this._options.dmmf.datamodel.models) {
            const tsModel = new ModelConverter(modelInfo);
            const _data = await tsModel.genModel();
            //   logger.info(`model info ${tsModel}`);
            models += _data;
            await writeFileSafely(
                path.join(
                    writeLocation,
                    `${changeCase.capitalCase(modelInfo.name, {
                        delimiter: ""
                    })}.ts`
                ),
                _data
            );
        }
        logger.info(`Models generated: ${models.length}`);

        // await writeFileSafely(writeLocation, models);
    };

    writeServices = async (): Promise<void> => {
        let services = "";

        for await (const modelInfo of this._options.dmmf.datamodel.models) {
            const service = new ServiceConverter(modelInfo);
            const _data = await service.genService();
            const writeLocation = path.join(
                this._options.generator.output?.value || "",
                `${changeCase.camelCase(service.name)}`
            );
            //   logger.info(`model info ${tsModel}`);
            services += _data;
            await writeFileSafely(
                path.join(
                    writeLocation,
                    `${changeCase.camelCase(modelInfo.name)}ServiceBase.ts`
                ),
                _data
            );
        }
        logger.info(`Services Generate; ${services.length}`);
    };

    run = async (): Promise<void> => {
        //     const { generator, dmmf } = this.options;
        //    const output = parseEnvValue(generator.output!);

        // set path to the client
        //    const config = this.getConfig();
        this.setPrismaClientPath();
        // logger.info(`starting config: ${JSON.stringify(config)}`);

        // const convertor = PrismaConvertor.getInstance();
        // convertor.dmmf = dmmf;
        // convertor.config = config;

        // write the enums
        await this.writeEnums();

        // create the models
        await this.writeModels();

        // create the services
        await this.writeServices();
    };
}
