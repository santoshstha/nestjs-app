import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UsersService } from '../users/users.service';
import { Cron, CronExpression } from '@nestjs/schedule'; // Import Cron utilities

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

  @Cron('0 8 * * *') // Runs every at 8 am
  async handleBulkEmailCron() {
    console.log('Running bulk email cron job at:', new Date().toISOString());
    const subject = 'Scheduled Bulk Email';
    const message = 'This is an automated email sent every 5 minutes.';
    await this.sendBulkEmails(subject, message);
    console.log('Bulk emails queued successfully');
  }
}