import "reflect-metadata";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,


} from "class-validator";
import { Type } from "class-transformer";

export class ItensDto{
    constructor(
        public id:number,
        public nome:string
    )
    {}

}

export class ItensCreateDto{
    @IsOptional()
    @IsNumber()
    @Type(()=>Number)
    id?: number

    @IsNotEmpty()
    @IsString()
    nome!:string

   @IsString()
    @IsNotEmpty()
    unidade_medida!: string

    @IsNotEmpty()
    @IsString()
    descricao!:string

    @IsOptional()
    @IsString()
    link_referencia!:string

    @IsOptional()
    @IsString()
    imagem?: string | null

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(()=>Number)
    estoque_minimo?: number

 

}

export class ItensUpdateDto{
       @IsOptional()
    @IsNumber()
    @Type(()=>Number)
    id?: number

    @IsNotEmpty()
    @IsString()
    nome!:string

    @IsString()
    @IsNotEmpty()
    unidade_medida!:string

    @IsNotEmpty()
    @IsString()
    descricao!:string

    @IsOptional()
    @IsString()
    link_referencia!:string

    @IsOptional()
    @IsString()
    imagem?: string | null

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(()=>Number)
    estoque_minimo?: number

}