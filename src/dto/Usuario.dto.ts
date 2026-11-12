import "reflect-metadata";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,

} from "class-validator";
import { Type } from "class-transformer";

export class UsuarioDto{
    constructor(
        public id:number,
        public nome: string
    )
    {}
}
export class UsuarioCreateDto {
      @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id?: number;

    @IsNotEmpty()
    @IsString()
    nome!: string;

    @IsNotEmpty()
    @IsString()
    email!: string;

    @IsString()
    @MinLength(6, {
        message: "A senha deve ter pelo menos 6 caracteres"
    })
    senhaHash!: string;
}

export class UsuarioUpdateDto{
 @IsNotEmpty()
    @IsString()
    nome!: string

    @IsNotEmpty()
    @IsString()
    email!:string   
}