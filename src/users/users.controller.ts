import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { EmailService } from '../email/email.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from './user.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { SendBulkEmailsDto } from './dto/send-bulk-emails.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(
      createUserDto.email,
      createUserDto.password,
      createUserDto.role || Role.USER,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Post('send-bulk-emails')
  @ApiOperation({ summary: 'Send bulk emails to all users (admin only)' })
  @ApiBody({ type: SendBulkEmailsDto }) // Defines the request body
  @ApiResponse({ status: 201, description: 'Emails queued successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden (non-admin)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendBulkEmails(@Body() sendBulkEmailsDto: SendBulkEmailsDto) {
    await this.emailService.sendBulkEmails(
      sendBulkEmailsDto.subject,
      sendBulkEmailsDto.message,
    );
    return { message: 'Bulk emails have been queued successfully' };
  }
}