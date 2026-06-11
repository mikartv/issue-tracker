import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IssuePriority } from '../../entities/issue.entity';

export class UpdateIssueDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: IssuePriority })
  @IsEnum(IssuePriority)
  @IsOptional()
  priority?: IssuePriority;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  assignee?: string;
}
