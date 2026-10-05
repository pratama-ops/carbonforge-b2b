import { Injectable } from '@nestjs/common';
import { CreateLandplotDto } from './dto/create-landplot.dto';
import { UpdateLandplotDto } from './dto/update-landplot.dto';

@Injectable()
export class LandplotService {
  create(createLandplotDto: CreateLandplotDto) {
    return 'This action adds a new landplot';
  }

  findAll() {
    return `This action returns all landplot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} landplot`;
  }

  update(id: number, updateLandplotDto: UpdateLandplotDto) {
    return `This action updates a #${id} landplot`;
  }

  remove(id: number) {
    return `This action removes a #${id} landplot`;
  }
}
