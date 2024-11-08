import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BookStatusScheduler {
  constructor(private dbService: DatabaseService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateOverdueBooks() {
    const now = new Date();

    await this.dbService.borrowRecord.updateMany({
      where: {
        AND: [{ status: 'BORROWED' }, { due_date: { lt: now } }],
      },
      data: {
        status: 'OVERDUE',
      },
    });
  }
}
