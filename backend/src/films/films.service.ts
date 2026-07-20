import { Injectable, NotFoundException } from '@nestjs/common';

import { FilmsRepository } from '../repository/films.repository';
import { FilmDto, ListResponseDto, ScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getFilms(): Promise<ListResponseDto<FilmDto>> {
    const items = await this.filmsRepository.findAll();

    return { total: items.length, items };
  }

  async getSchedule(filmId: string): Promise<ListResponseDto<ScheduleDto>> {
    const items = await this.filmsRepository.findSchedule(filmId);

    if (!items) {
      throw new NotFoundException(
        `Фильм с идентификатором ${filmId} не найден`,
      );
    }

    return { total: items.length, items };
  }
}
