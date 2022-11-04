import { NameCases } from "@converters/Model";

export const TService = (options: {
    header: string;
    imports: string;
    name: NameCases;
    body: string;
}): string => {
    return `${options.header}\n\n\n
    ${options.imports}\n
    @Injectable()
    export class ${options.name.title}ServiceBase {\n
        constructor(private prisma: PrismaService) {}\n
        ${options.body}
    }`;
};

export const TServiceCrud = (options: NameCases): string => {
    return `async create(args: Prisma.${options.title}CreateArgs):Promise<Prisma.Prisma__${options.title}Client<${options.title}| null>> {
        return await this.prisma.${options.camel}.create(args);
    }

    async findAll(args: Prisma.${options.title}FindManyArgs):Promise<Prisma.Prisma__${options.title}Client<${options.title}[]| null>>  {
        return await this.prisma.${options.camel}.findMany(args);
    }

    async  findOne(args: Prisma.${options.title}FindUniqueArgs):Promise<Prisma.Prisma__${options.title}Client<${options.title}| null>>   {
        return await this.prisma.${options.camel}.findUnique(args);
    }

    async   update(args: Prisma.${options.title}UpdateArgs):Promise<Prisma.Prisma__${options.title}Client<${options.title}| null>>  {
        return await this.prisma.${options.camel}.update(args);
    }

    async   remove(args:Prisma.${options.title}DeleteArgs):Promise<Prisma.Prisma__${options.title}Client<${options.title}| null>>   {
        return await this.prisma.${options.camel}.delete(args);
    }`;
};
