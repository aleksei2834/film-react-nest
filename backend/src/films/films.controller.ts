import { Controller, Get, Param } from '@nestjs/common';

import { FilmDto, ListResponseDto, ScheduleDto } from './dto/films.dto';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getFilms(): Promise<ListResponseDto<FilmDto>> {
    return this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  getSchedule(
    @Param('id') filmId: string,
  ): Promise<ListResponseDto<ScheduleDto>> {
    return this.filmsService.getSchedule(filmId);
  }
}
