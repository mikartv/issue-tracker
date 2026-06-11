import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { IssueStatus } from '../../entities/issue.entity';

export class UpdateIssueStatusDto {
  @ApiProperty({ enum: IssueStatus })
  @IsEnum(IssueStatus)
  @IsNotEmpty()
  status!: IssueStatus;
}
