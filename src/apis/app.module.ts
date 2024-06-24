import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TourModule } from './tour/tour.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TourModule,
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      envFilePath: `src/configs/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
      cache: true,
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
