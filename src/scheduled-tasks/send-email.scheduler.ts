import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from 'src/database/database.service';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';
import { ConfigService } from '@nestjs/config';
import { formatDate } from 'src/utils/format-date';

@Injectable()
export class SendEmailScheduler {
  constructor(
    private configService: ConfigService,
    private dbService: DatabaseService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async sendEmailToOverdueUsers() {
    const overdueRecords = await this.dbService.borrowRecord.findMany({
      where: {
        status: 'OVERDUE',
      },
      select: {
        Book: {
          select: {
            title: true,
          },
        },
        User: {
          select: {
            name: true,
            email: true,
          },
        },
        due_date: true,
      },
    });

    overdueRecords.map(async (record) => {
      await this.sendEmail(
        record.User.email,
        record.User.name,
        record.Book.title,
        formatDate(record.due_date),
      );
    });
  }

  async sendEmail(
    recipientEmail: string,
    recipientName: string,
    bookTitle: string,
    dueDate: string,
  ) {
    try {
      const mailersend = new MailerSend({
        apiKey: this.configService.get<string>('MAILERSEND_API_TOKEN'),
      });

      const sender = new Sender(
        'prasad@trial-z3m5jgr2dxdldpyo.mlsender.net',
        'Prasad Sawant',
      );
      const recipients = [new Recipient(recipientEmail, recipientName)];

      const emailParams = new EmailParams()
        .setFrom(sender)
        .setTo(recipients)
        .setSubject('Reminder: Overdue Book')
        .setText(
          `Dear ${recipientName},\nWe hope you're enjoying your reading! This is a reminder that your borrowed book, "${bookTitle}", was due on ${dueDate}.\nPlease return it at your earliest convenience to avoid any late fees and to help others access this book too. If you need assistance or an extension, feel free to reach out!\nThank you`,
        );

      await mailersend.email.send(emailParams);
    } catch (error: any) {
      console.log('Unable to send Email', error);
    }
  }
}
