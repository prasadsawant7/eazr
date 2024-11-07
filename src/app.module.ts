import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import serverConfig from './config/server.config';
import dbConfig from './config/db.config';
import { LoggerMiddleware } from './common/middlewares';
import clientConfig from './config/client.config';
import jwtConfig from './config/jwt.config';
import { ATGuard } from './common/guards';
import { BorrowRecordsModule } from './borrow-records/borrow-records.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [clientConfig, serverConfig, dbConfig, jwtConfig],
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.env'
          : `.env.${process.env.NODE_ENV}`,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
