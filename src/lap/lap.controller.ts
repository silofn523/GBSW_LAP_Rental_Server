import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ValidationPipe,
  UseGuards,
  NotFoundException,
  Delete
} from '@nestjs/common'
import { LapService } from './lap.service'
import { CreateLapDto } from './dto/create-lap.dto'
import { UpdateLapDto } from './dto/update-lap.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/auth/guard/auth.guard'
import { RolesGuard } from 'src/auth/guard/role.guard'
import { Roles } from 'src/util/decorator/roles.decorator'
import { RolesEnum } from 'src/util/enum/roles.enum'
import { UserService } from 'src/user/user.service'
import { Lap } from './entities/lap.entity'

@ApiTags('Lap')
@Controller('lap')
export class LapController {
  constructor(
    private readonly lapService: LapService,
    private readonly userService: UserService
  ) {}

  @ApiOperation({
    summary: '랩실 대여',
    description: '랩실 대여를 요청합니다.'
  })
  @Roles(RolesEnum.user)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBody({ type: CreateLapDto })
  @Post()
  public async createLap(
    @Body(ValidationPipe) dto: CreateLapDto
  ): Promise<{ success: boolean; ID: number }> {
    const lap = await this.lapService.createLap(dto)

    return {
      success: true,
      ID: lap.id
    }
  }

  @ApiOperation({
    summary: '모든 대여 요청 조회'
  })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get()
  public async findAll(): Promise<{ success: boolean; body: Lap[] }> {
    const laps = await this.lapService.findAll()

    return {
      success: true,
      body: laps
    }
  }

  @ApiOperation({
    summary: '승인 요청중인 대여 요청 모두 조회'
  })
  @Roles(RolesEnum.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('approved')
  public async findApprovalRental(): Promise<{ success: boolean; body: Lap[] }> {
    const laps = await this.lapService.findApprovalRental()

    return {
      success: true,
      body: laps
    }
  }

  @ApiOperation({
    summary: '삭제 요청중인 대여 요청 모두 조회'
  })
  @Roles(RolesEnum.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('deletion')
  public async finDdeletionRental(): Promise<{ success: boolean; body: Lap[] }> {
    const laps = await this.lapService.finDdeletionRental()

    return {
      success: true,
      body: laps
    }
  }

  @ApiOperation({
    summary: '대여 요청 하나만 조회'
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  public async findOne(@Param('id') id: number): Promise<{ success: boolean; body: Lap }> {
    const lap = await this.lapService.findOneLap(id)

    if (!lap) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 대여 요청을 찾지 못했습니다`
      })
    }

    return {
      success: true,
      body: lap
    }
  }

  @ApiOperation({
    summary: '유저별 작성한 대여 요청 조회'
  })
  @ApiBearerAuth()
  @Get('user/:id')
  @UseGuards(AuthGuard)
  public async findAllUserBoard(@Param('id') id: number): Promise<Lap[]> {
    const userId = await this.userService.getOneUser(id)

    if (!userId) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 유저를 찾지 못했습니다`
      })
    }

    return await this.lapService.findAllUserLap(id)
  }

  @ApiOperation({
    summary: '삭제 혹은 대여 완료 요청 승인, 랩실 배정'
  })
  @ApiBearerAuth()
  @Roles(RolesEnum.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  public async update(
    @Param('id') id: number,
    @Body(ValidationPipe) dto: UpdateLapDto
  ): Promise<{ success: boolean }> {
    const lap = await this.lapService.findOneLap(id)

    if (!lap) {
      throw new NotFoundException({
        success: false,
        message: `${id}를 가진 요청을 찾지 못했습니다`
      })
    }
    await this.lapService.update(id, dto)

    return {
      success: true
    }
  }

  @ApiOperation({
    summary: '모든 랩실 데여 요청 삭제'
  })
  @Roles(RolesEnum.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Delete()
  public async allDelete() {
    await this.lapService.allDelete()

    return {
      success: true
    }
  }
}
