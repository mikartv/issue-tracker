import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IssuePriority } from '../../entities/issue.entity';

export class CreateIssueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: IssuePriority, default: IssuePriority.MEDIUM })
  @IsEnum(IssuePriority)
  @IsOptional()
  priority?: IssuePriority;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  assignee?: string;
}
