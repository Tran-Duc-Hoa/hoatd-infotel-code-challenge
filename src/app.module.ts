import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    BookingModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
