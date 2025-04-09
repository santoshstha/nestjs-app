import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UsersService } from '../users/users.service';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    private usersService: UsersService,
  ) {}

  async sendBulkEmails(subject: string, message: string) {
    const users = await this.usersService.findAll();
    for (const user of users) {
      await this.emailQueue.add('send-email', {
        email: user.email,
        subject,
        message,
      });
    }
  }
}