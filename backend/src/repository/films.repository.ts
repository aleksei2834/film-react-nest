import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmRepository.find({
      select: [
        'id',
        'rating',
        'director',
        'tags',
        'image',
        'cover',
        'title',
        'about',
        'description',
      ],
    });
  }

  async findSchedule(filmId: string): Promise<Schedule[] | null> {
    const film = await this.filmRepository.findOne({
      where: { id: filmId },
      relations: ['schedule'],
    });

    if (!film) {
      return null;
    }

    return film.schedule.map(
      ({ id, daytime, hall, rows, seats, price, taken }) =>
        ({ id, daytime, hall, rows, seats, price, taken }) as Schedule,
    );
  }

  async findSession(
    filmId: string,
    sessionId: string,
  ): Promise<Schedule | null> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: sessionId, filmId },
    });

    return schedule ?? null;
  }

  async reserveSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<boolean> {
    const result = await this.scheduleRepository
      .createQueryBuilder()
      .update(Schedule)
      .set({ taken: () => 'taken || :places::text[]' })
      .where('id = :sessionId', { sessionId })
      .andWhere('film_id = :filmId', { filmId })
      .andWhere('NOT (taken && :places::text[])', { places })
      .execute();

    return (result.affected ?? 0) === 1;
  }
}
