import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ShiftModule } from '../shift/shift.module';

@Module({
  imports: [PrismaModule, ShiftModule, AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
