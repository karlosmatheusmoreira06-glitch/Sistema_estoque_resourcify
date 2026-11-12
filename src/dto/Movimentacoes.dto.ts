import "reflect-metadata";

import {
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from "class-validator";

import { Type } from "class-transformer";
import { Tipo } from "../modelo/Movimentacoes";

export class MovimentacoesDto{
    constructor(
        public id: number,
        public tipo: Tipo
    ) {}
}

export class MovimentacoesCreateDto{

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    id?: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    item_id!: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    usuario_id?: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    quantidade!: number

    @IsNotEmpty()
    @IsIn(["ENTRADA", "SAIDA"])
    tipo!: Tipo

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    preco_unitario?: number

    @IsNotEmpty()
    @IsString()
    observacao!: string
}

export class MovimentacoesUpdateDto{

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    item_id!: number

    @IsOptional()
    @IsNumber()
    @Type(() =>Number)
    usuario_id?: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    quantidade!: number

    @IsNotEmpty()
    @IsIn(["ENTRADA", "SAIDA"])
    tipo!: Tipo

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    preco_unitario?: number

    @IsNotEmpty()
    @IsString()
    observacao!: string
}