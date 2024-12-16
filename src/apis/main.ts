import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { HttpExceptionFilter } from 'src/\bcommon/filters/http-exception.filter';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역 인터셉터 등록
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 전역 ValidationPipe 적용
  app.useGlobalPipes(new ValidationPipe());

  // 전역 예외 필터 등록
  // app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('API 문서')
    .setDescription('API 명세서입니다.')
    .setVersion('1.0')
    .addBearerAuth() // JWT 토큰 인증 추가
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
