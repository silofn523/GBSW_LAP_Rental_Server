import { Injectable, NotAcceptableException } from '@nestjs/common'
import { CreateLapDto } from './dto/create-lap.dto'
import { UpdateLapDto } from './dto/update-lap.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Lap } from './entities/lap.entity'
import { Repository } from 'typeorm'
import { UserService } from 'src/user/user.service'

@Injectable()
export class LapService {
  constructor(
    @InjectRepository(Lap)
    private readonly lap: Repository<Lap>,
    private readonly userService: UserService
  ) {}

  public async createLap(dto: CreateLapDto): Promise<Lap> {
    const userId = await this.userService.getOneUser(dto.userId)

    if (!userId) {
      throw new NotAcceptableException({
        success: false,
        message: `ID : ${dto.userId}를 가진 해당 유저는 없습니다.`
      })
    }
    const lap = await this.lap.save({
      rentalDate: dto.rentalDate,
      rentalUser: dto.rentalUser,
      rentalUsers: dto.rentalUsers,
      rentalPurpose: dto.rentalPurpose,
      rentalStartTime: dto.rentalStartTime,
      lapName: dto.lapName,
      userId: dto.userId,
      deletionRental: false,
      approvalRental: false
    })

    return lap
  }

  public async findAll(): Promise<Lap[]> {
    return await this.lap.find()
  }

  public async findApprovalRental(): Promise<Lap[]> {
    return await this.lap.find({
      where: {
        approvalRental: false
      }
    })
  }

  public async finDdeletionRental(): Promise<Lap[]> {
    return await this.lap.find({
      where: {
        deletionRental: false
      }
    })
  }

  public async findAllUserLap(id: number): Promise<Lap[]> {
    return await this.lap.find({
      where: {
        userId: id
      }
    })
  }

  public async findOneLap(id: number): Promise<Lap> {
    return await this.lap.findOne({
      where: {
        id
      }
    })
  }

  public async update(id: number, dto: UpdateLapDto): Promise<void> {
    const { ...update } = dto

    if (update.deletionRental) {
      await this.lap.update({ id }, dto)

      await this.deleteLap(id)
    }

    await this.lap.update({ id }, dto)
  }

  public async deleteLap(id: number): Promise<void> {
    const deletionRental = await this.findOneLap(id)

    if (deletionRental.deletionRental == false) {
      throw new NotAcceptableException({
        success: false,
        message: `해당 요청의 삭제가 승인되지않았습니다.`
      })
    }
    await this.lap.delete({ id })
  }

  public async allDelete(): Promise<void> {
    await this.lap.delete({})
  }
}
