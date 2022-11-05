/********************************************************************************************************************
 * ******************************************************************************************************************
 * ******************************************************************************************************************
 *
 *                          AUTOGENERATED CODE : DO NOT EDIT
 *
 *
 * ******************************************************************************************************************
 * ******************************************************************************************************************
 ******************************************************************************************************************/

import { Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class UserServiceBase {
    constructor(private prisma: PrismaService) {}

    async count<T extends Prisma.UserFindManyArgs>(
        args: Prisma.SelectSubset<T, Prisma.UserFindManyArgs>
    ): Promise<number> {
        return this.prisma.user.count(args);
    }

    async create<T extends Prisma.UserCreateArgs>(
        args: Prisma.SelectSubset<T, Prisma.UserCreateArgs>
    ): Promise<User> {
        return await this.prisma.user.create<T>(args);
    }

    async findAll(
        args: Prisma.UserFindManyArgs
    ): Promise<Prisma.Prisma__UserClient<User[] | null>> {
        return await this.prisma.user.findMany(args);
    }

    async findOne(
        args: Prisma.UserFindUniqueArgs
    ): Promise<Prisma.Prisma__UserClient<User | null>> {
        return await this.prisma.user.findUnique(args);
    }

    async update(
        args: Prisma.UserUpdateArgs
    ): Promise<Prisma.Prisma__UserClient<User | null>> {
        return await this.prisma.user.update(args);
    }

    async remove(
        args: Prisma.UserDeleteArgs
    ): Promise<Prisma.Prisma__UserClient<User | null>> {
        return await this.prisma.user.delete(args);
    }
}
