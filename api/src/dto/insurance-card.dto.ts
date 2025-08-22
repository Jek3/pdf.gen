import { IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InsuranceCardDto {
  @ApiProperty({ example: 'First Last' })
  @IsString()
  name: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  policyNumber: string;

  @ApiProperty({ example: 'UCC' })
  @IsString()
  provider: string;

  @ApiProperty({ example: '2026-12-31', type: 'string', format: 'date' })
  @IsDateString()
  validUntil: string;
}

export default InsuranceCardDto;
