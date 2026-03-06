import { Module } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${[process.env.NODE_ENV || 'development']}`
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
        genReqId: () => {
          return uuidv4()
        },
        timestamp: () => {
          const date = new Date().toLocaleString('sv-SE', {
            timeZone: "Asia/Jakarta"
          }).replace('T', '')
          return `,"time":"${date}"`
        },
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              options: {
                singleLine: true
              }
            },
            {
              target: 'pino/file',
              options: {
                destination: './logs/app.log'
              }
            }
          ]
        },
        autoLogging: true,
        redact: ['req.headers.authorization'],
      }
    }),
    PrismaModule,
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
