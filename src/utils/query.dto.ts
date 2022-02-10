import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class ListQueryCalendarDTO {
  @IsString()
  @IsOptional()
  startDate: Date;

  @IsString()
  @IsOptional()
  endDate: Date;
}

export class ListQueryParamsDTO {
  @IsNumberString()
  @IsOptional()
  page: number;

  @IsNumberString()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  orderBy: string;

  @IsString()
  @IsOptional()
  order: string;

  @IsString()
  @IsOptional()
  search: string;
}

export interface ListBasicOperation {
  page: number;
  skip: number;
  limit: number;
  orderBy: string;
  order: 'ASC' | 'DESC';
  search: string;
  startDate?: string;
  endDate?: string;
}
