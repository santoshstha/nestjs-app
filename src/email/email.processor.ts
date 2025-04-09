import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Processor('email')
export class EmailProcessor {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // Use TLS
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  @Process('send-email')
  async handleSendEmail(job: any) {
    const { email, subject, message } = job.data;
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject,
      text: message,
    });
  }
}