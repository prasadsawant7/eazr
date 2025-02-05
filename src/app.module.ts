import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { LoggerMiddleware } from './common/middlewares';
import { ATGuard } from './common/guards';
import { BorrowRecordsModule } from './borrow-records/borrow-records.module';
import { BookStatusScheduler } from './scheduled-tasks/book-status.scheduler';
import serverConfig from './config/server.config';
import dbConfig from './config/db.config';
import clientConfig from './config/client.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [clientConfig, serverConfig, dbConfig, jwtConfig],
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ScheduleModule.forRoot(),
    HealthModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    BooksModule,
    BorrowRecordsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ATGuard,
    },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    BookStatusScheduler,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
