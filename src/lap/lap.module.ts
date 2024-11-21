import { Module } from '@nestjs/common'
import { LapService } from './lap.service'
import { LapController } from './lap.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Lap } from './entities/lap.entity'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Lap]), UserModule],
  controllers: [LapController],
  providers: [LapService]
})
export class LapModule {}
