import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Film, FilmDocument, Schedule } from '../films/schemas/film.schema';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().select('-schedule -_id').lean<Film[]>().exec();
  }

  async findSchedule(filmId: string): Promise<Schedule[] | null> {
    const film = await this.filmModel
      .findOne({ id: filmId })
      .select('schedule -_id')
      .lean<{ schedule: Schedule[] }>()
      .exec();

    return film?.schedule ?? null;
  }

  async findSession(
    filmId: string,
    sessionId: string,
  ): Promise<Schedule | null> {
    const film = await this.filmModel
      .findOne({ id: filmId, 'schedule.id': sessionId })
      .select('schedule.$ -_id')
      .lean<{ schedule: Schedule[] }>()
      .exec();

    return film?.schedule[0] ?? null;
  }

  async reserveSeats(
    filmId: string,
    sessionId: string,
    places: string[],
  ): Promise<boolean> {
    const result = await this.filmModel
      .updateOne(
        {
          id: filmId,
          schedule: {
            $elemMatch: {
              id: sessionId,
              taken: { $nin: places },
            },
          },
        },
        {
          $addToSet: {
            'schedule.$.taken': { $each: places },
          },
        },
      )
      .exec();

    return result.modifiedCount === 1;
  }
}
