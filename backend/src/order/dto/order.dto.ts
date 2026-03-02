import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

// 1. Описываем один билет
export class TicketDto {
  @IsString()
  @IsNotEmpty()
  film: string;

  @IsString()
  @IsNotEmpty()
  session: string;

  @IsNumber()
  row: number;

  @IsNumber()
  seat: number;

  @IsString()
  daytime: string;
}

// 2. Описываем весь заказ, который приходит с фронтенда
export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

// DTO ответа (список созданных билетов)
export class OrderResponseDto {
  items: TicketDto[];
}
