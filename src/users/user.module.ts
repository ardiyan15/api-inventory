import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HashIdModule } from 'src/common/hashid/hash.module';

@Module({
  imports: [HashIdModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UserModule { }
