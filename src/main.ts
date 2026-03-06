import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import fs from 'fs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  app.useGlobalFilters(new PrismaExceptionFilter())

  if(!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs')
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
