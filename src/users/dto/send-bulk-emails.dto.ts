import { ApiProperty } from '@nestjs/swagger';

export class SendBulkEmailsDto {
  @ApiProperty({ description: 'Email subject', example: 'Test Email' })
  subject: string;

  @ApiProperty({ description: 'Email message', example: 'Hello from NestJS' })
  message: string;
}