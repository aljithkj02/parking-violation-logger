import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Role } from "generated/prisma";


export class SignupDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @IsNotEmpty()
    password: string;

    @IsEnum(Role, { message: 'Role must be either ADMIN or USER' })
    role: Role;
}
