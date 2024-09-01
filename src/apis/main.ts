import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { HttpExceptionFilter } from 'src/\bcommon/filters/http-exception.filter';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 인터셉터 등록
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 전역 ValidationPipe 적용
  app.useGlobalPipes(new ValidationPipe());

  // 전역 예외 필터 등록
  // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
