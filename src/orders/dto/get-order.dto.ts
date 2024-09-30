import { IsNumberString } from 'class-validator';

export class GetOrderDto {
  @IsNumberString()
  id: number;
}
