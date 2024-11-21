import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateLapDto } from './create-lap.dto'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class UpdateLapDto extends PartialType(CreateLapDto) {
  @ApiProperty({
    description: '삭제여부',
    default: 'false'
  })
  @IsOptional()
  @IsBoolean()
  public readonly deletionRental: boolean

  @ApiProperty({
    description: '승인여부',
    default: 'false'
  })
  @IsOptional()
  @IsBoolean()
  public readonly approvalRental: boolean

  @ApiProperty({
    description: '빌릴 랩실 이름',
    default: '3층 임베디드 실습실'
  })
  @IsString()
  @IsOptional()
  public readonly lapName: string
}
