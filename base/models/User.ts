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

import { ApiProperty } from "@nestjs/swagger";
import { Book } from "./Book";
import { EnumUserRole } from "../enums/EnumUserRole";
export class User {
    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    id: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    roles: EnumUserRole;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    username: string;

    @ApiProperty()
    Book: Book;
}