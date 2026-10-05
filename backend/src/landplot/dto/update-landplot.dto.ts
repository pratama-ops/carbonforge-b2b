import { PartialType } from '@nestjs/mapped-types';
import { CreateLandplotDto } from './create-landplot.dto';

export class UpdateLandplotDto extends PartialType(CreateLandplotDto) {}
