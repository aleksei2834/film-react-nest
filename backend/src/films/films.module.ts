import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilmsRepository } from '../repository/films.repository';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

@Module({
  imports: [TypeOrmModule.forFeature([Film, Schedule])],
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository],
  exports: [FilmsRepository],
})
export class FilmsModule {}
