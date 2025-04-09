import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Laptop' })
  name: string;

  @ApiProperty({ description: 'Product price', example: 1000 })
  price: number;

  @ApiProperty({ description: 'Product description', example: 'A high-end laptop' })
  description: string;
}