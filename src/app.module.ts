import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TripsModule } from './trips/trips.module';
import { TicketsModule } from './tickets/tickets.module';
import { User } from './users/user.entity';
import { Trip } from './trips/trip.entity';
import { Ticket } from './tickets/ticket.entity';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/role.entity';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Trip, Ticket, Role],
          synchronize: true
        }
      }
    }),
    UsersModule,
    TripsModule,
    TicketsModule,
    RolesModule
  ],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      cookieSession({
        keys: ['some_text']
      })
    ).forRoutes('*');

    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
